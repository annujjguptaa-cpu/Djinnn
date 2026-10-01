from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import post, connect, auth, x_auth, github, workflow
import gemma_brain
from db_supabase import SupabaseDB
from pydantic import BaseModel
from fastapi import BackgroundTasks
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))
from email_service import send_waitlist_email

from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI(
    title="Djinn API",
    description="Omni-Platform AI Action Agent",
    version="1.3.0",
)

@app.on_event("startup")
async def startup_event():
    await gemma_brain.check_ollama_health()

class WaitlistRequest(BaseModel):
    email: str
    wish_name: str
    topic_name: str

@app.post("/api/waitlist")
async def add_to_waitlist(req: WaitlistRequest, background_tasks: BackgroundTasks):
    existing = await SupabaseDB.check_waitlist_entry(req.email, req.wish_name)
    if existing:
        return {"status": "already registered"}
    
    await SupabaseDB.save_waitlist_entry(req.email, req.wish_name, req.topic_name)
    
    # Send email in background
    background_tasks.add_task(send_waitlist_email, req.email, req.wish_name, req.topic_name)
    
    return {"status": "success"}

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"GLOBAL CRASH: {str(exc)}")
    from settings import settings
    frontend_url = settings.FRONTEND_URL
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "msg": str(exc)},
        headers={
            "Access-Control-Allow-Origin": frontend_url,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

# ─── CORS ────────────────────────────────────────────────────────────────────
from settings import settings
frontend_url = settings.FRONTEND_URL

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url,
        "https://djinn-rho.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Auth Routers ────────────────────────────────────────────────────────────
app.include_router(auth.router, prefix="/api/auth")
app.include_router(github.router, prefix="/api") # Prefixes /auth/github internally

# ─── Feature Routers ──────────────────────────────────────────────────────────
app.include_router(post.router, prefix="/api")
app.include_router(connect.router, prefix="/api")
app.include_router(x_auth.router, prefix="/api")
app.include_router(workflow.router, prefix="/api")
app.include_router(gemma_brain.router, prefix="/api")

from routers import opportunity, growth, access_requests
app.include_router(opportunity.router)
app.include_router(growth.router)
app.include_router(access_requests.router)

# ─── Static Files (uploaded images) ──────────────────────────────────────────
import os
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# ─── Health check ────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "status": "✨ Djinn is awake",
        "version": "1.3.0",
        "docs": "/docs",
    }

@app.get("/health")
async def health():
    return {"status": "ok"}

@app.get("/api/health")
async def detailed_health():
    import httpx
    from settings import settings

    # 1. Supabase status check
    supabase_ok = bool(settings.SUPABASE_URL and settings.SUPABASE_KEY)
    
    # 2. Claude API status check
    claude_configured = bool(settings.ANTHROPIC_API_KEY and not settings.ANTHROPIC_API_KEY.startswith("your_"))

    # 3. Ollama local check
    ollama_ok = False
    try:
        async with httpx.AsyncClient(timeout=1.5) as client:
            res = await client.get("http://localhost:11434/api/tags")
            ollama_ok = (res.status_code == 200)
    except Exception:
        ollama_ok = False

    return {
        "status": "healthy",
        "supabase_connected": supabase_ok,
        "claude_api_configured": claude_configured,
        "ollama_reachable": ollama_ok,
        "environment": settings.APP_ENV,
        "frontend_url": settings.FRONTEND_URL
    }
 
