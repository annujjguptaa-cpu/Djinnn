from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import post, connect, auth, x_auth, github, workflow

from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI(
    title="Djinn API",
    description="Omni-Platform AI Action Agent",
    version="1.3.0",
)

@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    print(f"GLOBAL CRASH: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "msg": str(exc)},
        headers={
            "Access-Control-Allow-Origin": "http://localhost:5173",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
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
 
