from pathlib import Path

from ingestion.chunking.text_chunker import TextChunker
from ingestion.document_loader import load_documents
from ingestion.embedder import Embedder

BASE_DIR = Path(__file__).resolve().parent.parent.parent

knowledge_base = BASE_DIR / "knowledge_base"

# Load documents
documents = load_documents(str(knowledge_base))

# Chunk documents
chunker = TextChunker()
chunks = chunker.chunk_documents(documents)

print(f"Total Documents : {len(documents)}")
print(f"Total Chunks    : {len(chunks)}")

# Generate embeddings
embedder = Embedder()
embedded_chunks = embedder.embed_chunks(chunks)

print("\nEmbedding Statistics")
print("-" * 50)

first_embedding = embedded_chunks[0].embedding

print("Embedding Dimension :", len(first_embedding))

print("\nFirst 10 values:")
print(first_embedding[:10])

print("\nMetadata:")
print(f"Chunk ID  : {embedded_chunks[0].chunk.chunk_id}")
print(f"File      : {embedded_chunks[0].chunk.file_name}")
print(f"Category  : {embedded_chunks[0].chunk.category}")
print(f"Section   : {embedded_chunks[0].chunk.section}")
print(f"Embedding : {embedded_chunks[0].embedding[:10]}")

print("\nChunk Preview:")
print("-" * 50)
print(embedded_chunks[0].chunk.text[:500])