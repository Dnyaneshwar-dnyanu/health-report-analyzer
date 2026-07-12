from pathlib import Path

from ingestion.loaders.pdf_loader import load_pdf

BASE_DIR = Path(__file__).resolve().parent.parent.parent

pdf_path = BASE_DIR / "knowledge_base" / "cbc" / "complement_blood_test.pdf"

text = load_pdf(str(pdf_path))

print("\n\n====================================")
print("TEXT PREVIEW")
print("====================================\n")

print(text[:3000])

print("\n")
print("=" * 50)
print(f"Total Characters: {len(text)}")
print("=" * 50)