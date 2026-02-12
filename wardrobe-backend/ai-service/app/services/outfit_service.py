import json
import logging
import re

from google import genai

from app.core.config import settings
from app.models.outfit import ClothingItem, OutfitRequest, OutfitResponse

logger = logging.getLogger(__name__)

class OutfitService:
    def __init__(self) -> None:
        self.client = genai.Client(api_key=settings.gemini_api_key)

    def map_llm_output_to_ids(self, llm_output_ids: list[str], available_items: list[ClothingItem]) -> list[str]:
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
        你是一位专业的时尚造型师。根据用户的衣橱单品、天气条件和风格偏好，推荐一套完美的穿搭方案。
        
        用户风格偏好: {request.vibe}
        天气情况: {request.weather if request.weather else "未指定"}
        
        【重要】只能从以下可用衣橱单品中选择：
        {items_desc}
        
        要求：
        1. 从上述列表中选择 2-4 件单品，组成一套协调的穿搭方案
        2. 【严格要求】JSON 响应中的 "item_ids" 字段必须包含上述列表中的原始 UUID 字符串
        3. 为穿搭方案起一个吸引人的中文标题
        4. 用中文撰写简短的"造型师建议"，解释为什么这套搭配效果好
        5. 用中文标注风格类别（例如：休闲、正式、街头、通勤等）
        
        响应格式（仅返回 JSON）：
        {{
            "title": "穿搭方案标题（中文）",
            "description": "造型师建议，解释搭配理由（中文）",
            "item_ids": ["uuid_1", "uuid_2"],
            "style_category": "风格类别（中文）"
        }}
        """

        response = self.client.models.generate_content(
            model=settings.llm_model,
            contents=prompt
        )
        
        # Extract JSON
        text = response.text or ""
        match = re.search(r'(\{.*\})', text, re.DOTALL)
        content = match.group(1) if match else text.strip()
        result = json.loads(content)
        
        # Fix IDs
        result['item_ids'] = self.map_llm_output_to_ids(result.get('item_ids', []), request.items)
        
        return OutfitResponse(**result)
