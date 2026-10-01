import os
import json
import base64
import httpx
import uuid
import random
from datetime import datetime
import google.generativeai as genai
from PIL import Image
from typing import List, AsyncGenerator
from dotenv import load_dotenv
from openai import AsyncOpenAI
from fastapi import APIRouter, UploadFile, File, HTTPException, Form, Body
from fastapi.responses import StreamingResponse
from models import PostCreate, WishResponse, CaptionResponse, StreamRequest
from settings import settings
from db import get_post_wishes, sync_db
import gemma_brain
import asyncio

router = APIRouter(prefix="/post", tags=["post"])

# Use Persistent DB
post_wishes = get_post_wishes()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
DEBUG_LOG = os.path.join(os.getcwd(), "linkedin_debug.log")

def log_linkedin_debug(action: str, status: int, headers: dict, body: str):
    """Helper to log deep LinkedIn diagnostics to a file."""
    with open(DEBUG_LOG, "a") as f:
        f.write(f"\n--- {action} [{status}] ---\n")
        f.write(f"Headers: {json.dumps(dict(headers), indent=2)}\n")
        f.write(f"Body: {body}\n")
        f.write("-" * 30 + "\n")

# Initialize Async OpenAI client
client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None

CAPTION_TEMPLATES = [
    "🚀 Excited to share this moment with my network!\n\nEvery great achievement starts with a single step. This image captures exactly that — progress, passion, and purpose coming together.\n\n💡 What's the one thing you're working on this week that excites you most? Drop it in the comments!\n\n#Growth #LinkedIn #Innovation #Mindset #Networking",
    "✨ Big things are happening!\n\nI've been working on something incredible, and seeing it come to life like this is beyond rewarding. The journey is the destination — and I'm loving every second.\n\nDrop a 🔥 if you're also building something amazing right now!\n\n#BuildingInPublic #Startup #Entrepreneur #AI #TechCommunity",
    "🌟 Moments like these remind me why I do what I do.\n\nIn a world that moves fast, it's important to pause and celebrate progress — no matter how big or small. This one means a lot.\n\nTag someone who inspires you to keep going! 👇\n\n#Motivation #Leadership #PersonalGrowth #Career #Inspiration",
    "💼 Sharing something I'm incredibly proud of.\n\nThis represents weeks of hard work, late nights, and a team that refuses to give up. The result? Something we genuinely believe will make an impact.\n\nHave you hit a milestone recently? I'd love to hear about it! 🎯\n\n#Teamwork #MilestoneAlert #ProfessionalDevelopment #Success",
]


async def stream_caption_generator(image_paths: List[str], context: str = "", platform: str = "linkedin") -> AsyncGenerator[str, None]:
    """Async generator for streaming AI caption chunks using Gemma Brain."""
    yield "__ENGINE_" + ("GEMINI" if "Gemma" not in gemma_brain.active_model else "OPENAI") + "__" # Fake engine name so frontend picks it up correctly based on its expectations, or just return OPENAI.
    
    image_path = None
    if image_paths:
        filepath = os.path.join(UPLOAD_DIR, image_paths[0])
        if os.path.exists(filepath):
            image_path = filepath
            
    caption = await gemma_brain.generate_caption(image_path, platform, context)
    
    # Stream it back in chunks for visual effect on frontend
    chunk_size = 15
    for i in range(0, len(caption), chunk_size):
        yield caption[i:i+chunk_size]
        await asyncio.sleep(0.02)


@router.post("/upload")
async def upload_images(files: List[UploadFile] = File(...)):
    """Accept multiple image uploads, save them, and return filenames (metadata only)."""
    saved_filenames = []
    for file in files[:6]:
        if not file.content_type or not file.content_type.startswith("image/"):
            continue
        file_bytes = await file.read()
        if len(file_bytes) == 0:
            continue
        filename = f"{uuid.uuid4().hex[:8]}_{file.filename}"
        with open(os.path.join(UPLOAD_DIR, filename), "wb") as f:
            f.write(file_bytes)
        saved_filenames.append(filename)
    
    if not saved_filenames:
        raise HTTPException(status_code=400, detail="No valid images")
    return {"image_paths": saved_filenames}


@router.post("/stream")
async def stream_caption(request: StreamRequest):
    """Stream AI caption chunks back to the client."""
    return StreamingResponse(
        stream_caption_generator(request.image_paths, request.context, request.platform),
        media_type="text/plain"
    )


@router.get("/")
async def list_post_wishes():
    """List all social post wishes."""
    # Convert dict to list and sort by created_at desc
    wishes = []
    for wid, data in post_wishes.items():
        wishes.append({**data, "wish_id": wid})
    
    # Sort by created_at desc (if exists)
    wishes.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return wishes


@router.post("/create", response_model=WishResponse)
async def create_post_wish(payload: PostCreate):
    """Save a post wish and return a shareable link."""
    wish_id = f"post_{uuid.uuid4().hex[:10]}"
    post_wishes[wish_id] = {
        "type": "post",
        "caption": payload.caption,
        "has_images": payload.has_images,
        "image_paths": payload.image_paths,
        "platform": payload.platform,
        "status": "created",
        "created_at": datetime.now().isoformat(),
    }
    sync_db() # Persist!
    return WishResponse(
        wish_id=wish_id,
        type="post",
        share_url=f"/wish/{wish_id}",
    )


@router.get("/{wish_id}")
async def get_post_wish(wish_id: str):
    """Retrieve a stored post wish by ID."""
    wish = post_wishes.get(wish_id)
    if not wish:
        raise HTTPException(status_code=404, detail="Wish not found")
    return wish


@router.put("/{wish_id}")
async def update_post_wish(wish_id: str, payload: PostCreate):
    """Update a post wish text/images."""
    wish = post_wishes.get(wish_id)
    if not wish:
        raise HTTPException(status_code=404, detail="Wish not found")
    post_wishes[wish_id].update({
        "caption": payload.caption,
        "has_images": payload.has_images,
        "image_paths": payload.image_paths,
        "platform": payload.platform,
    })
    sync_db() # Persist!
    return wish


@router.post("/execute/{wish_id}")
async def execute_post_wish(wish_id: str, access_token: str):
    """Dispatcher for executing wishes on different platforms."""
    wish = post_wishes.get(wish_id)
    if not wish:
        raise HTTPException(status_code=404, detail="Wish not found")

    platform = wish.get("platform", "linkedin")
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        if platform == "linkedin":
            return await execute_linkedin_post(client, wish, access_token)
        elif platform == "x":
            return await execute_x_post(client, wish, access_token)
        else:
            raise HTTPException(status_code=400, detail=f"Unsupported platform: {platform}")
            
    # Update status after execution attempt (if successful)
    if res and res.get("status") == "success":
        post_wishes[wish_id].update({
            "status": "granted",
            "executed_at": datetime.now().isoformat()
        })
        sync_db()
    
    return res


async def execute_linkedin_post(client: httpx.AsyncClient, wish: dict, access_token: str):
    """LinkedIn dedicated posting logic."""
    # 1. Resolve Member Identity (Resilient: Userinfo or Me)
    author_id = None
    
    # Try Modern /userinfo (OIDC) first
    userinfo_res = await client.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    )
    if userinfo_res.status_code == 200:
        author_id = userinfo_res.json().get("sub")
        print(f"Identity resolved via OIDC /userinfo: {author_id}")

    # Try Legacy /v2/me if needed
    if not author_id:
        me_res = await client.get(
            "https://api.linkedin.com/v2/me",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        if me_res.status_code == 200:
            author_id = me_res.json().get("id")
            print(f"Identity resolved via Legacy /v2/me: {author_id}")

    if not author_id:
        print("------- BLACK BOX: IDENTITY RESOLUTION FAILED -------")
        print(f"Userinfo Response ({userinfo_res.status_code}): {userinfo_res.text}")
        if 'me_res' in locals():
            print(f"Legacy Me Response ({me_res.status_code}): {me_res.text}")
        raise HTTPException(status_code=401, detail="Invalid LinkedIn Token: Could not resolve identity.")
    
    author_urn = f"urn:li:person:{author_id}"
    asset_urns = []
    
    # 2. Register & Upload each image (Carousel)
    if wish.get("has_images") and wish.get("image_paths"):
        for filename in wish["image_paths"]:
            filepath = os.path.join(UPLOAD_DIR, filename)
            if not os.path.exists(filepath):
                continue
                
            # A. Register Upload (Modern Images API for Posts API)
            reg_payload = {
                "initializeUploadRequest": {
                    "owner": author_urn
                }
            }
            reg_res = await client.post(
                "https://api.linkedin.com/v2/images?action=initializeUpload",
                json=reg_payload,
                headers={"Authorization": f"Bearer {access_token}"}
            )
            
            if reg_res.status_code == 200:
                reg_data = reg_res.json()["value"]
                upload_url = reg_data["uploadUrl"]
                asset_urn = reg_data["image"]
                
                # B. Upload Binary (No Auth header for pre-signed URLs)
                with open(filepath, "rb") as f:
                    upload_res = await client.put(upload_url, content=f.read())
                    if upload_res.status_code in (200, 201):
                        asset_urns.append(asset_urn)
                    else:
                        print(f"Binary Upload failed: {upload_res.status_code} - {upload_res.text}")

    # 3. Try Modern Posts API (Primary for 2024+ apps)
    posts_payload = {
        "author": author_urn,
        "commentary": wish["caption"],
        "visibility": "PUBLIC",
        "distribution": {
            "feedDistribution": "MAIN_FEED",
            "targetEntities": [],
            "thirdPartyDistributionChannels": []
        },
        "lifecycleState": "PUBLISHED",
        "isReshareDisabledByAuthor": False
    }
    
    if asset_urns:
        if len(asset_urns) == 1:
            # Single image: use 'media' content type
            posts_payload["content"] = {
                "media": {
                    "id": asset_urns[0]
                }
            }
        else:
            # Multiple images: use 'multiImage' content type ONLY (union type — cannot mix)
            posts_payload["content"] = {
                "multiImage": {
                    "images": [{"id": urn} for urn in asset_urns]
                }
            }

    print("------ Attempting Modern Posts API ------")
    publish_res = await client.post(
        "https://api.linkedin.com/v2/posts",
        json=posts_payload,
        headers={
            "Authorization": f"Bearer {access_token}",
            "X-Restli-Protocol-Version": "2.0.0",
            "Content-Type": "application/json"
        }
    )

    # 4. Fallback to UGC API (For older apps)
    if publish_res.status_code not in [200, 201]:
        print(f"Posts API failed ({publish_res.status_code}). Falling back to UGC...")
        print(f"Posts API Error: {publish_res.text}")
        
        ugc_payload = {
            "author": author_urn,
            "lifecycleState": "PUBLISHED",
            "specificContent": {
                "com.linkedin.ugc.ShareContent": {
                    "shareCommentary": { "text": wish["caption"] },
                    "shareMediaCategory": "IMAGE" if asset_urns else "NONE",
                    "media": [
                        {
                            "status": "READY",
                            "media": urn,
                            "title": { "text": f"Image {i+1}" }
                        } for i, urn in enumerate(asset_urns)
                    ] if asset_urns else []
                }
            },
            "visibility": { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
        }
        
        publish_res = await client.post(
            "https://api.linkedin.com/v2/ugcPosts",
            json=ugc_payload,
            headers={
                "Authorization": f"Bearer {access_token}",
                "X-Restli-Protocol-Version": "2.0.0",
                "Content-Type": "application/json"
            }
        )

    # 3. Success handling
    log_linkedin_debug(
        "PUBLISH_FINAL", 
        publish_res.status_code, 
        publish_res.headers, 
        publish_res.text
    )

    if publish_res.status_code not in [200, 201]:
        print("------- BLACK BOX: LINKEDIN PUBLISH FAILED -------")
        raise HTTPException(status_code=publish_res.status_code, detail=f"LinkedIn Publish Failed: {publish_res.text}")

    # Resolve ID from header or body
    post_urn = publish_res.headers.get("x-restli-id") or publish_res.headers.get("X-RestLi-Id")
    if not post_urn:
        try:
            res_data = publish_res.json()
            post_urn = res_data.get("id")
        except:
            pass

    if post_urn:
        post_urn = post_urn.strip().replace('"', '').replace("'", "")
        # CRITICAL: Ensure full URN format for the URL
        if not post_urn.startswith("urn:li:"):
            # If we don't know the exact type, 'share' is the most common for the Posts API
            post_urn = f"urn:li:share:{post_urn}"

    print(f"Final Resolved LinkedIn URN: {post_urn}")
    
    # Modern direct post URL (works for urn:li:share, urn:li:ugcPost, urn:li:post)
    post_url = f"https://www.linkedin.com/feed/update/{post_urn}/" if post_urn else None

    return {
        "status": "success", 
        "post_id": post_urn,
        "post_url": post_url
    }


async def execute_x_post(client: httpx.AsyncClient, wish: dict, access_token: str):
    """X (Twitter) dedicated posting logic."""
    media_ids = []
    
    # 1. Upload Media (if present) via v1.1
    if wish.get("has_images") and wish.get("image_paths"):
        for filename in wish["image_paths"][:4]: # X v2 Free/Basic supports up to 4 images
            filepath = os.path.join(UPLOAD_DIR, filename)
            if not os.path.exists(filepath):
                continue
            
            with open(filepath, "rb") as f:
                # X Media upload requires multipart/form-data
                upload_res = await client.post(
                    "https://upload.twitter.com/1.1/media/upload.json",
                    files={"media": f},
                    headers={"Authorization": f"Bearer {access_token}"}
                )
                
                if upload_res.status_code == 200:
                    media_ids.append(upload_res.json()["media_id_string"])
    
    # 2. Create Tweet via v2
    tweet_payload = {
        "text": wish["caption"][:280] # X v2 character limit
    }
    if media_ids:
        tweet_payload["media"] = {"media_ids": media_ids}
        
    tweet_res = await client.post(
        "https://api.twitter.com/2/tweets",
        json=tweet_payload,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json"
        }
    )
    
    if tweet_res.status_code not in (200, 201):
        print(f"X Tweet Create ERROR: {tweet_res.status_code} - {tweet_res.text}")
        raise HTTPException(status_code=tweet_res.status_code, detail="X (Twitter) Publish Failed")
    
    tweet_data = tweet_res.json().get("data", {})
    tweet_id = tweet_data.get("id")
    tweet_url = f"https://twitter.com/i/web/status/{tweet_id}" if tweet_id else None
    
    return {
        "status": "success",
        "post_id": tweet_id,
        "post_url": tweet_url
    }
