from app.ingestion.embedding_model import EmbeddingModel
from app.ingestion.embedder import Embedder
from app.vector_store.chroma_store import ChromaStore
from app.parser.blood_report_parser import BloodReportParser
from app.services.report_service import ReportService
from app.services.upload_service import UploadService
from app.services.rag_service import RagService
from app.services.chat_service import ChatService

# Pre-loaded globals to ensure singletons
embedding_model = None
chroma_store = None
embedder = None
blood_report_parser = None
report_service = None
upload_service = None
rag_service = None
chat_service = None


def init_app_dependencies():
    global embedding_model, chroma_store, embedder, blood_report_parser, report_service, upload_service, rag_service, chat_service

    # Initialize database and model only once
    if chroma_store is None:
        chroma_store = ChromaStore()

    if embedding_model is None:
        embedding_model = EmbeddingModel()

    if embedder is None:
        embedder = Embedder(model=embedding_model)

    if blood_report_parser is None:
        # Pass the groq client or it will instantiate inside parser lazily
        blood_report_parser = BloodReportParser()

    if report_service is None:
        report_service = ReportService()

    if upload_service is None:
        upload_service = UploadService(parser=blood_report_parser, report_service=report_service)

    if rag_service is None:
        rag_service = RagService(chroma_store=chroma_store, embedder=embedder)

    if chat_service is None:
        chat_service = ChatService(rag_service=rag_service, report_service=report_service)


def get_chroma_store() -> ChromaStore:
    return chroma_store


def get_embedder() -> Embedder:
    return embedder


def get_embedding_model() -> EmbeddingModel:
    return embedding_model


def get_report_service() -> ReportService:
    return report_service


def get_upload_service() -> UploadService:
    return upload_service


def get_chat_service() -> ChatService:
    return chat_service


def get_rag_service() -> RagService:
    return rag_service
