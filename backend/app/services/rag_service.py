from pathlib import Path

from app.core.config import settings
from app.ingestion.embedder import Embedder
from app.llm.generator import AnswerGenerator
from app.llm.groq_client import GroqClient
from app.prompts.prompt_builder import PromptBuilder
from app.retrieval.retriever import Retriever
from app.vector_store.chroma_store import ChromaStore


class RagService:

    def __init__(
        self,
        chroma_store: ChromaStore | None = None,
        embedder: Embedder | None = None,
        retriever: Retriever | None = None,
        prompt_builder: PromptBuilder | None = None,
        answer_generator: AnswerGenerator | None = None,
    ):
        self.chroma_store = chroma_store or ChromaStore()
        self.embedder = embedder or Embedder()
        self.prompt_builder = prompt_builder or PromptBuilder()
        self.answer_generator = answer_generator or AnswerGenerator(GroqClient())
        self.retriever = retriever or Retriever(
            self.embedder,
            self.chroma_store,
        )

    def answer_with_citations(
        self, question: str, blood_report: str | None = None, top_k: int = 3, category: str | None = None
    ) -> dict:
        search_results = self.retriever.retrieve(question, top_k=top_k, category=category)

        prompt = self.prompt_builder.build_prompt(
            question=question,
            search_results=search_results,
            blood_report=blood_report,
        )

        answer_text = self.answer_generator.generate(prompt)

        # Collect unique citation files
        citations = []
        for res in search_results:
            file_name = getattr(res.chunk, "file_name", None)
            if file_name and file_name not in citations:
                citations.append(file_name)

        return {
            "answer": answer_text,
            "citations": citations
        }

    def answer(self, question: str, blood_report: str | None = None, top_k: int = 3) -> str:
        res = self.answer_with_citations(question, blood_report=blood_report, top_k=top_k)
        return res["answer"]

