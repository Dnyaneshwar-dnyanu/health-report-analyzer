from pathlib import Path

from ingestion.chunking.text_chunker import TextChunker
from ingestion.document_loader import load_documents

BASE_DIR = Path(__file__).resolve().parent.parent.parent

knowledge_base = BASE_DIR / "knowledge_base"

documents = load_documents(str(knowledge_base))

chunker = TextChunker(chunk_size=400, overlap=50)

chunks = chunker.chunk_documents(documents)

print(f"\nTotal Documents : {len(documents)}")
print(f"Total Chunks    : {len(chunks)}\n")

for chunk in chunks[:5]:

    print("=" * 80)
    print("Chunk ID :", chunk.chunk_id)
    print("Category :", chunk.category)
    print("Section  :", chunk.section)
    print("Words    :", len(chunk.text.split()))
    print("-" * 80)
    print(chunk.text[:500])
    print()