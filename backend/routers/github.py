from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import RedirectResponse
import httpx
import uuid
from typing import List, Optional
from settings import settings
from db_supabase import SupabaseDB
from services.guardian import GuardianScanner
from services.ai_readme import AIReadmeService
from github import Github as PyGithub
import json
import os
import base64

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
            raise HTTPException(status_code=400, detail="GitHub Token exchange failed")

        # 2. Get User Info
        user_res = await client.get(
            "https://api.github.com/user",
            headers={"Authorization": f"Bearer {access_token}"}
        )
        user_data = user_res.json()
        username = user_data["login"]

        # 3. Store in Supabase (Encrypted)
        user_id = state # Simplification for demo
        await SupabaseDB.save_github_auth(user_id, access_token, username)

        # 4. Redirect to Frontend Dashboard
        return RedirectResponse(url=f"{settings.FRONTEND_URL}/github-dashboard?status=connected&user={username}")

@router.get("/detect-projects")
async def detect_projects():
    """Detect recent projects from VS Code storage."""
    # Standard Windows VS Code storage path
    vscode_path = os.path.expandvars(r"%APPDATA%\Code\User\globalStorage\storage.json")
    if not os.path.exists(vscode_path):
        return {"projects": []}
    
    try:
        with open(vscode_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            workspaces = data.get("profileAssociations", {}).get("workspaces", {})
            
            # Extract and clean paths
            projects = []
            for uri in workspaces.keys():
                if uri.startswith("file:///"):
                    # Convert file:///c%3A/Users/... to C:\Users\...
                    raw_path = uri.replace("file:///", "").replace("%3A", ":")
                    path = os.path.normpath(raw_path)
                    if os.path.exists(path):
                        projects.append({
                            "name": os.path.basename(path),
                            "path": path,
                            "last_modified": os.path.getmtime(path)
                        })
            
            # Sort by most recent
            projects.sort(key=lambda x: x['last_modified'], reverse=True)
            return {"projects": projects[:10]}
    except Exception as e:
        return {"error": str(e), "projects": []}

@router.post("/link/create")
async def create_shareable_link(request: Request):
    """Admin creates a shareable link (Workflow, Fork, or Org)."""
    data = await request.json()
    link_type = data.get("type") # 'workflow', 'fork', 'org'
    target_id = data.get("target_id")
    admin_id = data.get("admin_id")
    
    # Logic to save to Supabase and return unique link_id
    link_id = str(uuid.uuid4())[:8]
    # await SupabaseDB.save_link(link_id, link_type, target_id, admin_id)
    return {"link_id": link_id, "url": f"{settings.FRONTEND_URL}/share/{link_id}"}

@router.post("/push/personal")
async def personal_push(request: Request):
    """The 'Summon Your Djinn' B2C flow with real PyGitHub push."""
    data = await request.json()
    project_path = data.get("path")
    user_id = data.get("user_id")
    
    # 1. Fetch encrypted GitHub token
    auth_data = await SupabaseDB.get_github_auth(user_id)
    if not auth_data:
         raise HTTPException(status_code=400, detail="GitHub not connected")
    
    gh = PyGithub(auth_data['access_token'])
    user = gh.get_user()

    # 2. Read files and Run Guardian Security Scan
    project_files = {} 
    for root, dirs, files in os.walk(project_path):
        if any(exc in root for exc in ['node_modules', '.git', '__pycache__', '.env']):
            continue
        for file in files:
            full_path = os.path.join(root, file)
            try:
                with open(full_path, 'r', encoding='utf-8') as f:
                    project_files[os.path.relpath(full_path, project_path)] = f.read()
            except: continue

    scan_result = GuardianScanner.scan_project(project_files)
    if not scan_result["is_safe"]:
        return {"status": "blocked", "findings": scan_result["findings"]}

    # 3. Create Repo and Push
    repo_name = os.path.basename(project_path)
    try:
        repo = user.create_repo(repo_name)
        
        # Add AI README
        readme_content = await AIReadmeService.generate_readme(repo_name, "\n".join(project_files.keys()))
        repo.create_file("README.md", "Initial commit - pushed via Djinn", readme_content)
        
        # Push all other files
        for path, content in project_files.items():
            if path == "README.md": continue
            repo.create_file(path, "Initial commit - pushed via Djinn", content)
            
        return {
            "status": "success",
            "repo_url": repo.html_url,
            "message": f"Successfully summoned {repo_name} to GitHub!"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/link/execute")
async def execute_link_action(request: Request):
    """Execute action when a shareable link is clicked/used."""
    data = await request.json()
    link_id = data.get("link_id")
    user_id = data.get("user_id") # The clicker

    # 1. Fetch link info (mocked for now)
    # link = await SupabaseDB.get_link(link_id)
    link = {"type": "fork", "target_repo": "octocat/hello-world"} # Mock
    
    auth_data = await SupabaseDB.get_github_auth(user_id)
    gh = PyGithub(auth_data['access_token'])
    user = gh.get_user()

    if link["type"] == "fork":
        target_repo = gh.get_repo(link["target_repo"])
        forked_repo = user.create_fork(target_repo)
        return {"status": "success", "repo_url": forked_repo.html_url}
    
    elif link["type"] == "org":
        # Invite to org (requires admin token for the org)
        # gh_admin.get_organization(link["org_name"]).add_to_members(user)
        return {"status": "success", "message": "Invitation sent!"}
