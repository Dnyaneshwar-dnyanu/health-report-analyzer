import time
from contextlib import asynccontextmanager
from fastapi import FastAPI

from app.core.logger import logger
from app.api.dependencies import init_app_dependencies, get_chroma_store, get_embedder
from app.ingestion.indexer import Indexer


@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- Startup ---
    logger.info("Starting up Blood Report Analyzer Backend...")

    # Record startup start time for uptime tracking
    app.state.start_time = time.time()

    # Initialize dependencies (model loading, DB connection)
    logger.info("Initializing dependencies...")
    init_app_dependencies()

    # Run Automatic Ingestion Check
    logger.info("Checking knowledge base indexing status...")
    chroma_store = get_chroma_store()
    embedder = get_embedder()
    indexer = Indexer(chroma_store=chroma_store, embedder=embedder)

    try:
        if not indexer.is_indexed():
            logger.info("Vector database is empty. Commencing full automatic indexing pipeline...")
            indexer.run_indexing()
        else:
            logger.info("Vector database contains documents. Running incremental update check...")
            indexer.run_incremental_indexing()
    except Exception as e:
        logger.error(f"Failed to verify/update knowledge base index on startup: {e}", exc_info=True)

    logger.info("Ready immediately. Startup sequence completed.")

    yield

    # --- Shutdown ---
    logger.info("Shutting down Blood Report Analyzer Backend...")
