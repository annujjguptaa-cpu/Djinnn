from pydantic import BaseModel
from typing import Optional, List


class PostCreate(BaseModel):
    caption: str
    has_images: Optional[bool] = False
    image_paths: Optional[List[str]] = []
    platform: str = "linkedin" # Default to linkedin for backward compatibility


class ConnectCreate(BaseModel):
    role: str
    location: Optional[str] = ""
    message: Optional[str] = ""


class WishResponse(BaseModel):
    wish_id: str
    type: str
    share_url: str


class CaptionResponse(BaseModel):
    caption: str
    confidence: float
    image_paths: Optional[List[str]] = []
    is_template: Optional[bool] = False
class StreamRequest(BaseModel):
    image_paths: List[str]
    context: Optional[str] = ""
    platform: Optional[str] = "linkedin"
