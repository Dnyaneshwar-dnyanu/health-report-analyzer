from fastapi import APIRouter, Depends, HTTPException, Query
from app.api.dependencies import get_chroma_store, get_embedder
from app.ingestion.indexer import Indexer
from app.core.logger import logger

router = APIRouter()


@router.post("/reindex")
async def reindex(
    force: bool = Query(False, description="If True, clears the vector database and runs a full re-index of all knowledge base files. Otherwise, runs incrementally."),
    chroma_store=Depends(get_chroma_store),
    embedder=Depends(get_embedder)
):
    logger.info(f"Admin endpoint POST /reindex called with force={force}")
    indexer = Indexer(chroma_store=chroma_store, embedder=embedder)
    try:
        if force:
            logger.info("Clearing ChromaDB collection for full re-indexing...")
            # Recreate the ChromaDB collection to wipe all items
            try:
                chroma_store.client.delete_collection(chroma_store.collection.name)
            except Exception as delete_error:
                logger.warning(f"Could not delete collection on force wipe (might not exist): {delete_error}")

            chroma_store.collection = chroma_store.client.get_or_create_collection(name="medical_kb")

            # Wipe manifest file as well
            from app.core.config import settings
            import os
            manifest_path = os.path.join(os.path.dirname(settings.vector_db_path), "indexing_manifest.json")
            if os.path.exists(manifest_path):
                os.remove(manifest_path)

            # Run full indexing
            indexer.run_indexing()
            message = "Full re-indexing completed successfully."
        else:
            indexer.run_incremental_indexing()
            message = "Incremental indexing completed successfully."

        return {
            "status": "success",
            "message": message,
            "document_count": chroma_store.get_document_count()
        }
    except Exception as e:
        logger.error(f"Re-indexing failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Re-indexing failed: {str(e)}")
