from typing import Any

from pydantic import BaseModel


class ClothingItem(BaseModel):
    id: str
    name: str
    category: str
    sub_category: str | None = None
    color: str | None = None
    tags: list[str] = []

class OutfitRequest(BaseModel):
    items: list[ClothingItem]
    weather: dict[str, Any] | None = None
    vibe: str | None = "casual"

class OutfitResponse(BaseModel):
    title: str
    description: str
    item_ids: list[str]
    style_category: str
