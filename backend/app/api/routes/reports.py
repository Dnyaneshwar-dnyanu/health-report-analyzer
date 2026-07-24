from fastapi import APIRouter, Depends, HTTPException
from fastapi.concurrency import run_in_threadpool
from app.api.dependencies import get_report_service
from app.services.report_service import ReportService
from app.models.blood_report import ReportResponse, ParameterHistoryItem
from app.core.logger import logger

router = APIRouter()


@router.get("", response_model=list[ReportResponse])
async def get_reports(
    report_service: ReportService = Depends(get_report_service)
):
    logger.info("Route GET /reports called")
    try:
        reports = await run_in_threadpool(report_service.get_all_reports)
        return reports
    except Exception as e:
        logger.error(f"Error listing reports: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{biomarker}", response_model=list[ParameterHistoryItem])
async def get_biomarker_history(
    biomarker: str,
    report_service: ReportService = Depends(get_report_service)
):
    logger.info(f"Route GET /reports/history/{biomarker} called")
    try:
        history = await run_in_threadpool(report_service.get_parameter_history, biomarker_name=biomarker)
        return history
    except Exception as e:
        logger.error(f"Error fetching biomarker history for {biomarker}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: str,
    report_service: ReportService = Depends(get_report_service)
):
    logger.info(f"Route GET /reports/{report_id} called")
    try:
        report = await run_in_threadpool(report_service.get_report_by_id, report_id=report_id)
        if not report:
            raise HTTPException(status_code=404, detail="Report not found")
        return report
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching report {report_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{report_id}")
async def delete_report(
    report_id: str,
    report_service: ReportService = Depends(get_report_service)
):
    logger.info(f"Route DELETE /reports/{report_id} called")
    try:
        deleted = await run_in_threadpool(report_service.delete_report, report_id=report_id)
        if not deleted:
            raise HTTPException(status_code=404, detail="Report not found")
        return {"status": "success", "message": f"Report {report_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting report {report_id}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

