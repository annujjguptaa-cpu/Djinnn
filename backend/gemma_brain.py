import os
import json
import base64
import httpx
from fastapi import APIRouter
from services.ai_engine import AIEngine

router = APIRouter(prefix="/ai", tags=["ai"])

# State
active_model = "Claude Fallback"

async def check_ollama_health():
    """Ping Ollama to check if Gemma 4 is available."""
    global active_model
    try:
        async with httpx.AsyncClient(timeout=2.0) as client:
            res = await client.get("http://localhost:11434/api/tags")
            if res.status_code == 200:
                data = res.json()
                models = [m.get("name") for m in data.get("models", [])]
                if any("gemma4" in m for m in models):
                    active_model = "Gemma 4 Local"
                else:
                    active_model = "Claude Fallback (Gemma4 missing)"
            else:
                active_model = "Claude Fallback"
    except Exception:
        active_model = "Claude Fallback"
        
    print(f"--- AI BRAIN ACTIVE: {active_model} ---")

@router.get("/status")
async def get_ai_status():
    return {"active_model": active_model}

async def run_gemma(prompt: str, image_base64: str = None) -> str:
    """Run generation against local Gemma 4."""
    payload = {
        "model": "gemma4",
        "prompt": prompt,
        "stream": False
    }
    if image_base64:
        payload["images"] = [image_base64]
        
    async with httpx.AsyncClient(timeout=30.0) as client:
        res = await client.post("http://localhost:11434/api/generate", json=payload)
        res.raise_for_status()
        return res.json().get("response", "")

async def generate_caption(image_path: str, platform: str, context: str = "") -> str:
    global active_model
    is_x = (platform == 'x')
    role = "Professional X (Twitter) Ghostwriter" if is_x else "Professional LinkedIn Ghostwriter"
    goal = "Write a viral tweet strictly under 280 characters" if is_x else "Write an engaging, high-performing LinkedIn post."
    guidelines = "Punchy, 2-3 hashtags, line breaks for readability. Under 280 chars total." if is_x else "Professional tone, 3-5 hashtags, storytelling structure. 150-300 words."
    user_context = context if context else "Craft a compelling post that highlights achievement, growth or insight."
    
    prompt = f"You are a {role}.\nGoal: {goal}\nContext from user: {user_context}\nStyle guidelines: {guidelines}\nOutput ONLY the final post text. No preamble, no explanation."
    
    img_b64 = None
    if image_path and os.path.exists(image_path):
        with open(image_path, "rb") as f:
            img_b64 = base64.b64encode(f.read()).decode("utf-8")
            
    if "Gemma" in active_model:
        try:
            return await run_gemma(prompt, img_b64)
        except Exception as e:
            print(f"Gemma failed: {e}. Falling back to Claude.")
            active_model = "Claude Fallback"
            
    # Fallback to Claude 3.5 Sonnet
    # Currently AIEngine doesn't support images directly, but we can send the prompt
    return await AIEngine.generate_text(prompt, engine="claude")

async def generate_message(target_role: str, location: str, context: str) -> str:
    global active_model
    prompt = f"Write a personalized LinkedIn connection message (under 300 chars) for a {target_role} in {location}. Context: {context}. Just return the message text, no quotes or preamble."
    if "Gemma" in active_model:
        try:
            return await run_gemma(prompt)
        except Exception as e:
            print(f"Gemma failed: {e}. Falling back to Claude.")
            active_model = "Claude Fallback"
            
    return await AIEngine.generate_text(prompt, engine="claude")

async def analyse_page(base64_screenshot: str, task_instruction: str) -> str:
    global active_model
    prompt = f"Task: {task_instruction}\nAnalyze this screenshot and return JSON with: action_type ('click', 'type', 'navigate', 'scroll', 'wait', 'complete', 'failed'), target_element_description, input_value (if typing), reasoning."
    if "Gemma" in active_model:
        try:
            # Requires a multimodal Gemma model if image is provided
            return await run_gemma(prompt, base64_screenshot)
        except Exception as e:
            print(f"Gemma failed: {e}. Falling back to Claude.")
            active_model = "Claude Fallback"
            
    return await AIEngine.generate_text(prompt, engine="claude")

async def generate_content(topic: str, platform: str, tone: str) -> str:
    global active_model
    prompt = f"Generate {tone} content for {platform} about {topic}. Provide only the content."
    if "Gemma" in active_model:
        try:
            return await run_gemma(prompt)
        except Exception as e:
            print(f"Gemma failed: {e}. Falling back to Claude.")
            active_model = "Claude Fallback"
            
    return await AIEngine.generate_text(prompt, engine="claude")
