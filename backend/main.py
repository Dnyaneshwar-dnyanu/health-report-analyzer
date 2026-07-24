import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.startup import lifespan
from app.api.routes import health, upload, chat, reports, admin

app = FastAPI(
    title="Blood Report Analyzer API",
    description="Production-ready FastAPI backend for RAG-based blood test analysis and context retrieval.",
    version="1.0.0",
    lifespan=lifespan
)

from app.core.config import settings

# CORS configuration
origins = [o.strip() for o in settings.allowed_origins.split(",") if o.strip()]
if "*" in origins:
    allow_credentials = False
else:
    allow_credentials = True

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register routes
app.include_router(health.router, tags=["Health"])
app.include_router(upload.router, prefix="/api", tags=["Reports Ingestion"])
app.include_router(chat.router, prefix="/api", tags=["Chat & Q&A"])
app.include_router(reports.router, prefix="/api/reports", tags=["Reports Management"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin Operations"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
