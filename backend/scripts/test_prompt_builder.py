from pathlib import Path

from ingestion.chunking.text_chunker import TextChunker
from ingestion.document_loader import load_documents
from ingestion.embedder import Embedder
from prompts.prompt_builder import PromptBuilder
from vector_store.in_memory_store import InMemoryVectorStore


BASE_DIR = Path(__file__).resolve().parent.parent.parent

knowledge_base = BASE_DIR / "knowledge_base"

documents = load_documents(str(knowledge_base))

chunker = TextChunker(
    chunk_size=400,
    overlap=50
)

chunks = chunker.chunk_documents(documents)

print(f"Documents : {len(documents)}")
print(f"Chunks    : {len(chunks)}")

embedder = Embedder()

embedded_chunks = embedder.embed_chunks(chunks)

store = InMemoryVectorStore()

store.add_documents(embedded_chunks)

query = "What causes low hemoglobin?"

query_embedding = embedder.embed_query(query)

results = store.search(
    query_embedding=query_embedding,
    top_k=3
)

builder = PromptBuilder()

prompt = builder.build_prompt(
    question="What causes low hemoglobin?",
    search_results=results
)

print(prompt)