import uuid
from fastapi import APIRouter, HTTPException
from models import ConnectCreate, WishResponse

router = APIRouter(prefix="/connect", tags=["connect"])

# In-memory store (replace with DB in production)
connect_wishes: dict = {}


@router.post("/create", response_model=WishResponse)
async def create_connect_wish(payload: ConnectCreate):
    """Save a connect campaign and return a shareable wish link."""
    if not payload.role:
        raise HTTPException(status_code=400, detail="Target role is required")

    wish_id = f"connect_{uuid.uuid4().hex[:10]}"
    connect_wishes[wish_id] = {
        "type": "connect",
        "role": payload.role,
        "location": payload.location,
        "message": payload.message,
    }
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
