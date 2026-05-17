from fastapi import APIRouter, HTTPException
from datetime import datetime
import uuid
from models import ConnectCreate, WishResponse
from db import get_connect_wishes, sync_db
import gemma_brain

router = APIRouter(prefix="/connect", tags=["connect"])

# Use Persistent DB
connect_wishes = get_connect_wishes()


@router.get("/")
async def list_connect_wishes():
    """List all connection campaigns."""
    wishes = []
    for wid, data in connect_wishes.items():
        wishes.append({**data, "wish_id": wid})
    
    # Sort by created_at desc
    wishes.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return wishes


@router.post("/create", response_model=WishResponse)
async def create_connect_wish(payload: ConnectCreate):
    """Save a connect campaign and return a shareable wish link."""
    if not payload.role:
        raise HTTPException(status_code=400, detail="Target role is required")

    message = payload.message
    if not message:
        message = await gemma_brain.generate_message(payload.role, payload.location, "Expand my professional network")

    wish_id = f"connect_{uuid.uuid4().hex[:10]}"
    connect_wishes[wish_id] = {
        "type": "connect",
        "role": payload.role,
        "location": payload.location,
        "message": message,
        "status": "created",
        "created_at": datetime.now().isoformat(),
    }
    sync_db() # Persist!
    return WishResponse(
        wish_id=wish_id,
        type="connect",
        share_url=f"/wish/{wish_id}",
    )


@router.get("/{wish_id}")
async def get_connect_wish(wish_id: str):
    """Retrieve a stored connect wish by ID."""
    wish = connect_wishes.get(wish_id)
    if not wish:
        raise HTTPException(status_code=404, detail="Wish not found")
    return wish


@router.post("/execute/{wish_id}")
async def execute_connect_wish(wish_id: str, access_token: str = None):
    """Execute the Djinn Magic for a connection wish."""
    wish = connect_wishes.get(wish_id)
    if not wish:
        raise HTTPException(status_code=404, detail="Connection wish not found")

    # Update status
    connect_wishes[wish_id].update({
        "status": "executed",
        "executed_at": datetime.now().isoformat()
    })
    sync_db()

    # For now, we simulate the 'Magic' and return the payload for the frontend
    # to open the LinkedIn search with pre-filled filters.
    return {
        "status": "success",
        "type": "connect",
        "role": wish["role"],
        "location": wish["location"],
        "message": wish["message"]
    }
