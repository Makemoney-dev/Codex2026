import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .models import *
from .routes import demo, score, consent, lender
from .ml.predict import get_model

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize SQLite tables
    Base.metadata.create_all(bind=engine)
    # Preload / train ML model if not already present
    try:
        model = get_model()
        print("ML Model loaded successfully.")
    except Exception as e:
        print(f"Error loading ML model: {e}")
    yield

app = FastAPI(
    title="InvisibleScore API",
    description="Consent-based explainable alternative credit/inclusion scoring platform",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(demo.router)
app.include_router(score.router)
app.include_router(consent.router)
app.include_router(lender.router)

@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "InvisibleScore API", "version": "1.0.0"}

@app.get("/health/ready", tags=["Health"])
def readiness_check():
    model_ready = False
    try:
        model = get_model()
        model_ready = model is not None
    except Exception:
        pass

    return {
        "status": "ready" if model_ready else "degraded",
        "database": "connected",
        "ml_model": "loaded" if model_ready else "not_loaded"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
