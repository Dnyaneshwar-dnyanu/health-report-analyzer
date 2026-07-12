from pathlib import Path
from ingestion.document_loader import load_documents

BASE_DIR = Path(__file__).resolve().parent.parent.parent

knowledge_base = BASE_DIR / "knowledge_base"

documents = load_documents(str(knowledge_base))

print("\n")

for doc in documents:

    print("=" * 60)
    print(doc.file_name)
    print(doc.extension)
    print(len(doc.text))
    print(doc.text[:500])