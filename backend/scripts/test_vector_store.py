from pathlib import Path

from ingestion.chunking.text_chunker import TextChunker
from ingestion.document_loader import load_documents
from ingestion.embedder import Embedder
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

print("\n" + "=" * 80)
print(f"Query: {query}")
print("=" * 80)

for index, (embedded_chunk, score) in enumerate(results, start=1):

    print(f"\nResult {index}")
    print("-" * 80)
    print(f"Similarity : {score:.4f}")
    print(f"File       : {embedded_chunk.chunk.file_name}")
    print(f"Category   : {embedded_chunk.chunk.category}")
    print(f"Section    : {embedded_chunk.chunk.section}")

    print("\nChunk:")
    print(embedded_chunk.chunk.text[:500])