# digital-wardrobe - AI Service

> AI-powered outfit recommendation engine using Google Gemini 1.5 Flash.

## Overview

The digital-wardrobe AI Service is a FastAPI-based microservice that provides intelligent outfit recommendations based on a user's wardrobe, current weather conditions, and desired "vibe".

### Core Features
- **Intelligent Recommendations**: Uses LLM to select cohesive outfits.
- **Robust Mapping**: Automatically maps LLM output (names or IDs) back to valid system UUIDs.
- **Fail-safe Logic**: Built-in validation and mapping to ensure data consistency.
- **Performance**: Lightweight and modular architecture designed for high throughput.

## Tech Stack
- **Framework**: FastAPI
- **LLM SDK**: Google GenAI
- **Validation**: Pydantic v2
- **Config**: Pydantic Settings
- **Testing**: Pytest

## Project Structure
```text
app/
├── api/          # Web layer (Routes, Handlers)
├── core/         # Orchestration (Config, Logging)
├── models/       # Data models (Pydantic schemas)
├── services/     # Business logic (LLM integration)
└── main.py       # Application entry point
```

## Setup & Installation

### Prerequisites
- Python 3.14
- Google Gemini API Key

### 1. Environment Setup
```bash
source wardrobe-backend/ai-service/venv/bin/activate && python wardrobe-backend/ai-service/main.py
```

### 2. Configuration
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
HOST=0.0.0.0
PORT=8000
DEBUG=True
```

## Usage

### Running the server
```bash
# Start the application
python main.py
```
The service will be available at `http://localhost:8000`. API documentation is available at `/docs`.

### API Endpoints
- `GET /health`: Health check.
- `POST /generate-outfit`: Generate an outfit recommendation.

## Development

### Running Tests
```bash
pytest
```

### Linting & Formatting
```bash
ruff check .
ruff format .
```

### Type Checking
```bash
mypy .
```
