import time
from fastapi import APIRouter, Depends, Request
from app.api.dependencies import get_chroma_store, get_report_service, get_embedding_model
from app.core.config import settings

router = APIRouter()

# Fallback start time in case app state isn't initialized
IMPORT_START_TIME = time.time()


@router.get("/health")
async def health(
    request: Request,
    chroma_store=Depends(get_chroma_store),
    report_service=Depends(get_report_service),
    embedding_model=Depends(get_embedding_model)
):
    # Check Server Uptime
    start_time = getattr(request.app.state, "start_time", IMPORT_START_TIME)
    uptime_seconds = time.time() - start_time

    # Check Groq configuration
    groq_configured = settings.groq_api_key is not None and len(settings.groq_api_key.strip()) > 0
    groq_status = "configured" if groq_configured else "missing"

    # Check ChromaDB connection
    try:
        chroma_doc_count = chroma_store.get_document_count()
        chroma_status = "connected"
    except Exception as e:
        chroma_doc_count = 0
        chroma_status = f"error: {str(e)}"

    # Check SQLite connection
    try:
        sqlite_doc_count = report_service.get_report_count()
        sqlite_status = "connected"
    except Exception as e:
        sqlite_doc_count = 0
        sqlite_status = f"error: {str(e)}"

    # Check Embedding Model
    try:
        emb_dim = embedding_model.model.get_sentence_embedding_dimension()
        embedding_status = "loaded"
    except Exception as e:
        emb_dim = 384  # fallback default for bge-small-en-v1.5
        embedding_status = f"error: {str(e)}"

    # Check Knowledge Base Status
    kb_loaded = chroma_doc_count > 0
    kb_status = "loaded" if kb_loaded else "empty"

    return {
        "status": "running",
        "uptime_seconds": round(uptime_seconds, 2),
        "groq_status": groq_status,
        "embedding_model": {
            "status": embedding_status,
            "model_name": settings.embedding_model_name,
            "dimension": emb_dim
        },
        "vector_database": {
            "status": chroma_status,
            "document_count": chroma_doc_count,
            "path": settings.vector_db_path
        },
        "relational_database": {
            "status": sqlite_status,
            "report_count": sqlite_doc_count,
            "path": report_service.db_path
        },
        "knowledge_base": {
            "status": kb_status,
            "path": settings.knowledge_base_directory
        }
    }
