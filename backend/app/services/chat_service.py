from app.services.rag_service import RagService
from app.services.report_service import ReportService
from app.core.logger import logger


class ChatService:

    def __init__(self, rag_service: RagService | None = None, report_service: ReportService | None = None):
        self.rag_service = rag_service or RagService()
        self.report_service = report_service or ReportService()

    def answer_with_citations(self, question: str, report_id: str | None = None, top_k: int = 3) -> dict:
        blood_report_text = None
        if report_id:
            logger.info(f"Chat request with report_id: {report_id}")
            report = self.report_service.get_report_by_id(report_id)
            if report:
                # Format extracted report parameters for the prompt
                blood_report_text = f"Patient: {report.get('patient_name')}\n"
                blood_report_text += f"Date: {report.get('report_date')}\n"
                blood_report_text += f"Summary: {report.get('summary')}\n"
                blood_report_text += "Biomarkers:\n"
                for param in report.get('blood_parameters', []):
                    blood_report_text += f"- {param.get('biomarker')}: {param.get('value')} {param.get('unit')} (Range: {param.get('reference_range')}, Flag: {param.get('flag')})\n"
            else:
                logger.warning(f"Report ID {report_id} not found in database. Answering question without patient context.")

        return self.rag_service.answer_with_citations(question, blood_report=blood_report_text, top_k=top_k)

    def answer(self, question: str, report_id: str | None = None, top_k: int = 3) -> str:
        res = self.answer_with_citations(question, report_id=report_id, top_k=top_k)
        return res["answer"]

