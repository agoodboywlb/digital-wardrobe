from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Calculate project root (2 levels up from app/core)
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    gemini_api_key: str = ""
    llm_model: str = "gemini-2.0-flash"
    host: str = "127.0.0.1"
    port: int = 8000
    debug: bool = False

    model_config = SettingsConfigDict(
        env_file=PROJECT_ROOT / ".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
