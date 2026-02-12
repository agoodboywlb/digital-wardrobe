import logging
import json
import re
from typing import List, Optional
from google import genai
from ai_service.core.config import settings
from ai_service.models.outfit import ClothingItem, OutfitRequest, OutfitResponse

logger = logging.getLogger(__name__)

class OutfitService:
    def __init__(self) -> None:
        self.client = genai.Client(api_key=settings.gemini_api_key)

    def map_llm_output_to_ids(self, llm_output_ids: List[str], available_items: List[ClothingItem]) -> List[str]:
        """
        Fix logic: If LLM returned names instead of IDs, try to map them back.
        """
        id_map = {item.id: item.id for item in available_items}
        name_map = {item.name: item.id for item in available_items}
        
        final_ids = []
        for oid in llm_output_ids:
            if oid in id_map:
                final_ids.append(oid)
            elif oid in name_map:
                logger.warning(f"LLM returned name '{oid}' instead of ID. Mapping back to {name_map[oid]}")
                final_ids.append(name_map[oid])
            else:
                logger.warning(f"LLM returned unknown ID/Name: {oid}")
        return final_ids

    def generate_outfit(self, request: OutfitRequest) -> OutfitResponse:
        logger.info(f"Generating outfit for {len(request.items)} items, vibe: {request.vibe}")
        
        if not request.items:
            raise ValueError("No items provided for recommendation")

        items_desc = "\n".join([
            f"- {item.name} ({item.category}/{item.sub_category}) Color: {item.color}, Tags: {', '.join(item.tags)} (ID: {item.id})"
            for item in request.items
        ])
        
        prompt = f"""
        You are a professional fashion stylist. Based on the user's available wardrobe items, weather conditions, and requested vibe, suggest ONE perfect outfit.
        
        User's Vibe: {request.vibe}
        Weather: {request.weather if request.weather else "Not specified"}
        
        [CRITICAL] Use the following Available Wardrobe items only:
        {items_desc}
        
        Instructions:
        1. Select 2-4 items from the available list that make a cohesive outfit. 
        2. [STRICT REQUIREMENT] In your JSON response, the "item_ids" field MUST contain the original UUID strings from the list above.
        3. Provide a catchy title for the outfit.
        4. Write a short "Stylist Note" explaining why this combination works.
        5. Categorize the style (e.g., Casual, Formal, Streetwear).
        
        Response Format (JSON only):
        {{
            "title": "Outfit Title",
            "description": "Stylist Note explaining the choice",
            "item_ids": ["uuid_1", "uuid_2"],
            "style_category": "Style Category"
        }}
        """

        response = self.client.models.generate_content(
            model=settings.llm_model,
            contents=prompt
        )
        
        # Extract JSON
        match = re.search(r'(\{.*\})', response.text, re.DOTALL)
        content = match.group(1) if match else response.text.strip()
        result = json.loads(content)
        
        # Fix IDs
        result['item_ids'] = self.map_llm_output_to_ids(result.get('item_ids', []), request.items)
        
        return OutfitResponse(**result)
