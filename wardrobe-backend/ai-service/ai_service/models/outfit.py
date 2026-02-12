from typing import List, Optional
from pydantic import BaseModel

class ClothingItem(BaseModel):
    id: str
    name: str
    category: str
    sub_category: Optional[str] = None
    color: Optional[str] = None
    tags: List[str] = []

class OutfitRequest(BaseModel):
    items: List[ClothingItem]
    weather: Optional[dict] = None
    vibe: Optional[str] = "casual"

class OutfitResponse(BaseModel):
    title: str
    description: str
    item_ids: List[str]
    style_category: str
