from app.models.outfit import ClothingItem
from app.services.outfit_service import OutfitService


def test_map_llm_output_to_ids() -> None:
    service = OutfitService()
    items = [
        ClothingItem(id="uuid-1", name="Blue T-Shirt", category="tops"),
        ClothingItem(id="uuid-2", name="Black Jeans", category="bottoms")
    ]
    
    # Case 1: LLM returns correct IDs
    llm_output = ["uuid-1", "uuid-2"]
    result = service.map_llm_output_to_ids(llm_output, items)
    assert result == ["uuid-1", "uuid-2"]
    
    # Case 2: LLM returns names instead of IDs
    llm_output_names = ["Blue T-Shirt", "Black Jeans"]
    result = service.map_llm_output_to_ids(llm_output_names, items)
    assert result == ["uuid-1", "uuid-2"]
    
    # Case 3: Mixed and unknown
    llm_output_mixed = ["uuid-1", "Unknown Item"]
    result = service.map_llm_output_to_ids(llm_output_mixed, items)
    assert result == ["uuid-1"]
