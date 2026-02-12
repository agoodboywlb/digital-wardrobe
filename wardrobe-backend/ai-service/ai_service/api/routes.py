from fastapi import APIRouter, HTTPException

from ai_service.models.outfit import OutfitRequest, OutfitResponse
from ai_service.services.outfit_service import OutfitService

router = APIRouter()
outfit_service = OutfitService()

@router.get("/health")
async def health_check() -> dict[str, str]:
    return {"status": "healthy"}

@router.post("/generate-outfit", response_model=OutfitResponse)
async def generate_outfit(request: OutfitRequest) -> OutfitResponse:
    try:
        return outfit_service.generate_outfit(request)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate outfit: {str(e)}") from e
