from pathlib import Path

from core.config import BASE_DIR, settings
from ingestion.embedder import Embedder
from ingestion.ingest import IngestService
from llm.generator import AnswerGenerator
from llm.groq_client import GroqClient
from prompts.prompt_builder import PromptBuilder
from retrieval.retriever import Retriever
from vector_store.in_memory_store import InMemoryVectorStore


class RagService:

    def __init__(
        self,
        knowledge_base_path: str | Path | None = None,
        chunk_size: int = settings.chunk_size,
        overlap: int = settings.chunk_overlap,
        ingest_service: IngestService | None = None,
        retriever: Retriever | None = None,
        prompt_builder: PromptBuilder | None = None,
        answer_generator: AnswerGenerator | None = None,
    ):
        self.knowledge_base_path = Path(knowledge_base_path or BASE_DIR / "knowledge_base")
        self.ingest_service = ingest_service or IngestService(
            self.knowledge_base_path,
            chunk_size=chunk_size,
            overlap=overlap,
            embedder=Embedder(),
            vector_store=InMemoryVectorStore(),
        )
        self.prompt_builder = prompt_builder or PromptBuilder()
        self.answer_generator = answer_generator or AnswerGenerator(GroqClient())
        self.retriever = retriever or Retriever(
            self.ingest_service.embedder,
            self.ingest_service.vector_store,
        )

    def answer(self, question: str, blood_report: str | None = None, top_k: int = 3) -> str:
        self.ingest_service.ingest()

        search_results = self.retriever.retrieve(question, top_k=top_k)

        prompt = self.prompt_builder.build_prompt(
            question=question,
            search_results=search_results,
            blood_report=blood_report,
        )

        return self.answer_generator.generate(prompt)
