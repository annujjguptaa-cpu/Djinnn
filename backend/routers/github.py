from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
import httpx
import uuid
from typing import List, Optional
from settings import settings
from db_supabase import SupabaseDB
from services.guardian import GuardianScanner
from services.ai_readme import AIReadmeService
from services.github_service import GitHubService
import json
import os
import base64
from github import Github as PyGithub

router = APIRouter(prefix="/auth/github", tags=["github_auth"])

@router.get("/login")
async def github_login(state: Optional[str] = None):
    """Initiate GitHub OAuth flow."""
    if not settings.GITHUB_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GitHub Credentials not configured")
    
    # State can carry the workflow_id or user session
    state_payload = state if state else str(uuid.uuid4())
    
    url = (
        f"https://github.com/login/oauth/authorize?"
        f"client_id={settings.GITHUB_CLIENT_ID}&"
        f"redirect_uri={settings.GITHUB_REDIRECT_URI}&"
        f"scope=repo,user,admin:org&"
        f"state={state_payload}"
    )
    return RedirectResponse(url=url)

@router.get("/callback")
async def github_callback(code: str, state: str):
    """Handle GitHub OAuth callback."""
    async with httpx.AsyncClient() as client:
        # 1. Exchange code for access token
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            data={
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": code,
                "redirect_uri": settings.GITHUB_REDIRECT_URI,
            },
            headers={"Accept": "application/json"}
        )
        token_data = token_res.json()
        access_token = token_data.get("access_token")
        
        if not access_token:
            detail = token_data.get("error_description") or "GitHub Token exchange failed"
            raise HTTPException(status_code=400, detail=detail)

        # 2. Get User Info
        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}", "Accept": "application/json"}
        )
        if user_res.status_code != 200:
            raise HTTPException(status_code=500, detail="Failed to fetch GitHub user info")
            
        user_data = user_res.json()
        username = user_data.get("login")
        if not username:
            raise HTTPException(status_code=500, detail="GitHub username not found in profile")

        # 3. Store in Supabase (Encrypted)
        user_id = state # State carries the user identifier
        try:
            await SupabaseDB.save_github_auth(user_id, access_token, username)
        except Exception as e:
            print(f"Supabase Auth Save Error: {e}")
            raise HTTPException(status_code=500, detail="Failed to persist GitHub identity")

        # 4. Redirect to Frontend Dashboard
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/github-personal?status=connected&user={username}&id={user_id}")

@router.get("/stats")
async def get_github_stats():
    """Aggregate statistics for the B2B Admin Dashboard."""
    try:
        # 1. Fetch all executions
        executions = await SupabaseDB._request("GET", "github_executions")
        if not executions:
            return {
                "total_repos": 0,
                "time_saved": 0,
                "compliance_rate": 100,
                "recent_activity": []
            }

        total_repos = len(executions)
        total_time_saved = sum(e.get("time_saved", 0) for e in executions)
        
        # 2. Map for chart data
        recent_activity = sorted(executions, key=lambda x: x.get('created_at', ''), reverse=True)[:10]
        
        return {
            "total_repos": total_repos,
            "time_saved": f"{total_time_saved // 60}h {total_time_saved % 60}m",
            "compliance_rate": 98, # Mocked for now
            "recent_activity": recent_activity
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/list-repos")
async def list_repositories(user_id: str):
    """Fetch live repository list for the connected user."""
    auth_data = await SupabaseDB.get_github_auth(user_id)
    if not auth_data:
        raise HTTPException(status_code=400, detail="GitHub not connected")
    
    gh = PyGithub(auth_data['access_token'])
    try:
        repos = []
        for repo in gh.get_user().get_repos(sort='updated', direction='desc'):
            repos.append({
                "id": repo.id,
                "name": repo.name,
                "full_name": repo.full_name,
                "html_url": repo.html_url,
                "description": repo.description,
                "language": repo.language,
                "stars": repo.stargazers_count,
                "updated_at": repo.updated_at.isoformat()
            })
        return {"repos": repos[:20]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/link/create")
async def create_shareable_link(request: Request):
    """Admin creates a shareable link (Workflow, Fork, or Org)."""
    data = await request.json()
    link_type = data.get("type") # 'workflow', 'fork', 'org'
    target_id = data.get("target_id")
    admin_id = data.get("admin_id")
    
    link_id = str(uuid.uuid4())[:8]
    # await SupabaseDB.save_link(link_id, link_type, target_id, admin_id)
    return {"link_id": link_id, "url": f"{settings.FRONTEND_URL}/share/{link_id}"}

@router.post("/push/personal")
async def personal_push(request: Request):
    """Refactored B2C flow using GitHubService."""
    data = await request.json()
    project_path = data.get("path")
    user_id = data.get("user_id")
    
    # 1. Fetch encrypted GitHub token
    auth_data = await SupabaseDB.get_github_auth(user_id)
    if not auth_data:
         raise HTTPException(status_code=400, detail="GitHub not connected")
    
    # 2. Delegate to Service
    service = GitHubService(auth_data['access_token'])
    try:
        result = await service.summon_personal_push(user_id, project_path)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/link/execute")
async def execute_link_action(request: Request):
    """Refactored link execution using GitHubService."""
    data = await request.json()
    link_id = data.get("link_id")
    user_id = data.get("user_id")

    # 1. Fetch link info (mocked/queried from registry)
    # payload = await SupabaseDB.get_link(link_id)
    payload = {"type": "fork", "target_repo": "annujjguptaa-cpu/Djinn---AI-Action-Agent"} # Demo Target
    
    auth_data = await SupabaseDB.get_github_auth(user_id)
    if not auth_data:
        raise HTTPException(status_code=400, detail="Clicker GitHub not connected")

    # 2. Delegate to Service
    service = GitHubService(auth_data['access_token'])
    try:
        result = await service.execute_link_action(user_id, link_id, payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/ping")
async def ping():
    return {"status": "GitHub Router Awake"}

@router.get("/team")
async def get_team(admin_id: str):
    """Fetch all members in the admin's network."""
    members = await SupabaseDB.get_team_members(admin_id)
    return {"members": members or []}

@router.post("/team")
async def add_member(admin_id: str, request: Request):
    """Add a new member to the team network."""
    data = await request.json()
    return await SupabaseDB.add_team_member(admin_id, data)

@router.delete("/team/{member_id}")
async def remove_member(member_id: str):
    """Delete a team member."""
    return await SupabaseDB.delete_team_member(member_id)

@router.get("/links")
async def list_links(admin_id: str):
    """Fetch all active streams."""
    links = await SupabaseDB.get_active_links(admin_id)
    return {"links": links or []}

@router.post("/links")
async def generate_link(admin_id: str, request: Request):
    """Generate and persist a magic link."""
    data = await request.json()
    link_id = str(uuid.uuid4())[:8]
    payload = {
        "id": link_id,
        "admin_id": admin_id,
        "type": data.get("type", "workflow"),
        "label": data.get("label", "Standard Push"),
        "color": data.get("color", "#8b5cf6"),
        "created_at": "now()" # Basic timestamp hint
    }
    await SupabaseDB.save_magic_link(payload)
    return {"link_id": link_id, "url": f"{settings.FRONTEND_URL}/share/{link_id}"}
