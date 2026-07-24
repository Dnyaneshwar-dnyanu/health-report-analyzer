from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from fastapi.concurrency import run_in_threadpool
from app.api.dependencies import get_upload_service
from app.services.upload_service import UploadService
from app.core.logger import logger

router = APIRouter()


@router.post("/upload")
async def upload_pdf(
    file: UploadFile = File(...),
    upload_service: UploadService = Depends(get_upload_service)
):
    logger.info(f"Route POST /upload called with file: {file.filename}")
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Unsupported file format. Only PDFs are supported.")

    try:
        saved_report = await run_in_threadpool(upload_service.upload_report, file)
        return saved_report
    except ValueError as e:
        logger.error(f"Value error in upload route: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Internal error in upload route: {e}")
        raise HTTPException(status_code=500, detail=str(e))

