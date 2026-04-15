from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import post, connect, auth, x_auth, github, workflow

app = FastAPI(
    title="Djinn API",
    description="Omni-Platform AI Action Agent",
    version="1.3.0",
)

# ... (middleware stays same)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(post.router, prefix="/api")
app.include_router(connect.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(x_auth.router, prefix="/api")
app.include_router(github.router, prefix="/api")
app.include_router(workflow.router, prefix="/api")

# ... (middleware stays same)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(post.router, prefix="/api")
app.include_router(connect.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(x_auth.router, prefix="/api")
app.include_router(github.router, prefix="/api")

# ─── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ─────────────────────────────────────────────────────────────────
app.include_router(post.router, prefix="/api")
app.include_router(connect.router, prefix="/api")
app.include_router(auth.router, prefix="/api/auth")
app.include_router(x_auth.router, prefix="/api")


# ─── Health check ────────────────────────────────────────────────────────────
@app.get("/")
async def root():
    return {
        "status": "✨ Djinn is awake",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "ok"}
 
