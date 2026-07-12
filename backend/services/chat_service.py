from services.rag_service import RagService


class ChatService:

    def __init__(self, rag_service: RagService | None = None):
        self.rag_service = rag_service or RagService()

    def answer(self, question: str, blood_report: str | None = None, top_k: int = 3) -> str:
        return self.rag_service.answer(question, blood_report=blood_report, top_k=top_k)
