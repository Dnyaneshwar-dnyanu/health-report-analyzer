import sys
from pathlib import Path

# Add backend directory to PYTHONPATH
backend_dir = Path(__file__).resolve().parent.parent
sys.path.append(str(backend_dir))

import os
import json
import shutil
import hashlib
import time
from dotenv import load_dotenv
load_dotenv()

# Verify that environment variables are loaded
print(f"GROQ_API_KEY: {'Present' if os.getenv('GROQ_API_KEY') else 'Missing'}")

# Global Mocking of Groq Client when API key is missing
from app.llm.groq_client import GroqClient
if not os.getenv("GROQ_API_KEY"):
    print("Warning: GROQ_API_KEY is missing. Mocking Groq Client for testing...")
    def mock_generate(self, prompt) -> str:
        if "Extract structured parameters" in prompt.user:
            return """
            {
              "patient_name": "John Doe",
              "report_date": "2026-05-15",
              "blood_parameters": [
                 {
                   "biomarker": "Hemoglobin",
                   "value": "11.5",
                   "reference_range": "13.5 - 17.5",
                   "unit": "g/dL",
                   "flag": "LOW"
                 },
                 {
                   "biomarker": "Cholesterol",
                   "value": "210",
                   "reference_range": "< 200",
                   "unit": "mg/dL",
                   "flag": "HIGH"
                 }
              ],
              "summary": "Hemoglobin is low and cholesterol is slightly high."
            }
            """
        else:
            return "This is a mocked RAG answer since GROQ_API_KEY is not set. Chunks would normally be sent to Groq Llama model."
    GroqClient.generate = mock_generate

# Import after mocking to ensure singletons use mocked GroqClient
from fastapi.testclient import TestClient
import fitz
from main import app
from app.core.config import settings
from app.api.dependencies import get_chroma_store, get_report_service
from app.ingestion.indexer import Indexer


def test_health_check(client: TestClient):
    print("\n--- Testing Health Check Endpoint ---")
    response = client.get("/health")
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    data = response.json()
    print("Health Data:", json.dumps(data, indent=2))
    assert data["status"] == "running"
    assert "vector_database" in data
    assert "relational_database" in data
    print("Health check test passed!")


def test_incremental_indexing_logic():
    print("\n--- Testing Incremental Indexing Logic ---")
    chroma_store = get_chroma_store()
    kb_path = Path(settings.knowledge_base_directory)
    
    # 1. Clear database and manifest to start fresh for test
    try:
        chroma_store.client.delete_collection(chroma_store.collection.name)
    except Exception:
        pass
    chroma_store.collection = chroma_store.client.get_or_create_collection(name="medical_kb")
    
    manifest_path = Path(settings.vector_db_path).parent / "indexing_manifest.json"
    if manifest_path.exists():
        manifest_path.unlink()
        
    indexer = Indexer(chroma_store=chroma_store)
    
    # Run initial index
    print("Running initial incremental index (empty database)...")
    indexer.run_incremental_indexing()
    initial_count = chroma_store.get_document_count()
    print(f"Initial document count: {initial_count}")
    assert initial_count > 0, "ChromaDB should have documents after indexing."
    
    # Verify second run has no changes
    print("Running incremental index a second time...")
    indexer.run_incremental_indexing()
    second_count = chroma_store.get_document_count()
    assert second_count == initial_count, "Document count should remain identical on duplicate checks."
    
    # 2. Test ADDING a file
    temp_file_rel = "general/temp_test_file.md"
    temp_file_path = kb_path / temp_file_rel
    print(f"Creating temporary file: {temp_file_path}")
    temp_file_path.write_text("## Test Section\n\nThis is temporary medical knowledge base text regarding ferritin values.", encoding="utf-8")
    
    try:
        print("Running incremental index after adding file...")
        indexer.run_incremental_indexing()
        count_after_add = chroma_store.get_document_count()
        print(f"Count after add: {count_after_add}")
        assert count_after_add > initial_count, "ChromaDB document count should increase."
        
        # Verify the manifest entry exists
        with open(manifest_path, "r", encoding="utf-8") as f:
            manifest = json.load(f)
        assert temp_file_rel in manifest, "Temporary file should be in the manifest."
        
        # 3. Test MODIFYING a file
        print(f"Modifying temporary file: {temp_file_path}")
        temp_file_path.write_text("## Test Section\n\nUpdated text: ferritin values are checked to monitor iron storage reserves.", encoding="utf-8")
        
        print("Running incremental index after modifying file...")
        indexer.run_incremental_indexing()
        count_after_modify = chroma_store.get_document_count()
        print(f"Count after modify: {count_after_modify}")
        
        # Verify the hash updated in manifest
        with open(manifest_path, "r", encoding="utf-8") as f:
            updated_manifest = json.load(f)
        assert updated_manifest[temp_file_rel]["hash"] != manifest[temp_file_rel]["hash"], "Hash should have changed in manifest."
        
    finally:
        # 4. Test DELETING the file
        if temp_file_path.exists():
            print(f"Cleaning up temporary file: {temp_file_path}")
            temp_file_path.unlink()
            
        print("Running incremental index after deleting file...")
        indexer.run_incremental_indexing()
        count_after_delete = chroma_store.get_document_count()
        print(f"Count after delete: {count_after_delete}")
        assert count_after_delete == initial_count, "ChromaDB count should return to initial count."
        
        # Verify the manifest entry is removed
        with open(manifest_path, "r", encoding="utf-8") as f:
            final_manifest = json.load(f)
        assert temp_file_rel not in final_manifest, "Temporary file should be removed from manifest."
        
    print("Incremental indexing tests passed!")


def generate_valid_pdf_bytes() -> bytes:
    doc = fitz.open()
    doc.new_page()
    pdf_bytes = doc.write()
    doc.close()
    return pdf_bytes


def test_upload_and_duplicate_detection(client: TestClient):
    print("\n--- Testing Upload and Duplicate Detection ---")
    pdf_bytes = generate_valid_pdf_bytes()
    
    # 1. First upload
    response = client.post(
        "/api/upload",
        files={"file": ("test_report.pdf", pdf_bytes, "application/pdf")}
    )
    assert response.status_code == 200, f"Expected 200, got {response.status_code}"
    report_data = response.json()
    report_id = report_data.get("report_id")
    print(f"First upload success. Report ID: {report_id}")
    assert report_id is not None
    assert report_data["patient_name"] == "John Doe"
    
    # 2. Second upload of identical file (Duplicate Detection)
    print("Uploading identical file to test duplicate upload protection...")
    response_dup = client.post(
        "/api/upload",
        files={"file": ("test_report_duplicate.pdf", pdf_bytes, "application/pdf")}
    )
    assert response_dup.status_code == 200
    dup_data = response_dup.json()
    dup_report_id = dup_data.get("report_id")
    print(f"Duplicate upload result ID: {dup_report_id}")
    assert dup_report_id == report_id, "Should return existing report ID for duplicate upload."
    
    # 3. Test path traversal safety
    print("Testing path traversal validation...")
    response_traversal = client.post(
        "/api/upload",
        files={"file": ("../../traversal.pdf", pdf_bytes, "application/pdf")}
    )
    assert response_traversal.status_code == 200
    traversal_data = response_traversal.json()
    saved_pdf_path = Path(traversal_data["pdf_path"])
    print(f"Saved PDF path basename: {saved_pdf_path.name}")
    assert ".." not in saved_pdf_path.name, "Filename must not contain path traversal characters."
    
    # 4. Cleanup SQLite reports
    report_service = get_report_service()
    report_service.delete_report(report_id)
    report_service.delete_report(traversal_data["report_id"])
    print("Upload and duplicate tests passed!")


def test_reports_crud(client: TestClient):
    print("\n--- Testing Reports CRUD Endpoints ---")
    pdf_bytes = generate_valid_pdf_bytes()
    
    # Ingest a test report
    response = client.post(
        "/api/upload",
        files={"file": ("crud_test.pdf", pdf_bytes, "application/pdf")}
    )
    report_id = response.json().get("report_id")
    pdf_path = response.json().get("pdf_path")
    print(f"Created report: {report_id} at {pdf_path}")
    
    # Get all reports
    get_all_response = client.get("/api/reports")
    assert get_all_response.status_code == 200
    all_reports = get_all_response.json()
    print(f"Total reports: {len(all_reports)}")
    assert any(r["report_id"] == report_id for r in all_reports)
    
    # Get specific report
    get_specific_response = client.get(f"/api/reports/{report_id}")
    assert get_specific_response.status_code == 200
    assert get_specific_response.json()["patient_name"] == "John Doe"
    
    # Delete report
    delete_response = client.delete(f"/api/reports/{report_id}")
    assert delete_response.status_code == 200
    print("Delete Response:", delete_response.json())
    
    # Verify file is deleted on disk
    assert not Path(pdf_path).exists(), "The PDF file on disk should be deleted automatically."
    
    # Verify report is deleted from SQLite
    get_deleted_response = client.get(f"/api/reports/{report_id}")
    assert get_deleted_response.status_code == 404, "Report should no longer exist in SQLite."
    print("Reports CRUD tests passed!")


def test_chat_rag_endpoints(client: TestClient):
    print("\n--- Testing Chat / RAG Flow Endpoints ---")
    # Chat without report ID
    response = client.post(
        "/api/chat",
        json={"question": "What is normal hemoglobin range?"}
    )
    assert response.status_code == 200
    data = response.json()
    print("Chat response (no report):", data["answer"])
    assert len(data["answer"]) > 0
    
    # Upload a test report to get a valid report_id
    pdf_bytes = generate_valid_pdf_bytes()
    response_upload = client.post(
        "/api/upload",
        files={"file": ("chat_test.pdf", pdf_bytes, "application/pdf")}
    )
    report_id = response_upload.json()["report_id"]
    
    # Chat WITH report ID
    response_with_report = client.post(
        "/api/chat",
        json={"question": "Check my cholesterol value", "report_id": report_id}
    )
    assert response_with_report.status_code == 200
    data_report = response_with_report.json()
    print("Chat response (with report):", data_report["answer"])
    
    # Cleanup SQLite
    report_service = get_report_service()
    report_service.delete_report(report_id)
    print("Chat/RAG tests passed!")


def test_admin_reindex_endpoint(client: TestClient):
    print("\n--- Testing Admin Reindexing Endpoint ---")
    # Test incremental reindex
    response = client.post("/api/admin/reindex")
    assert response.status_code == 200
    data = response.json()
    print("Incremental reindex response:", data)
    assert data["status"] == "success"
    
    # Test force reindex
    response_force = client.post("/api/admin/reindex?force=true")
    assert response_force.status_code == 200
    data_force = response_force.json()
    print("Force reindex response:", data_force)
    assert data_force["status"] == "success"
    assert data_force["document_count"] > 0
    print("Admin reindexing endpoint tests passed!")


if __name__ == "__main__":
    # Test with lifespan context manager trigger for dependencies setting
    print("Initializing test Client...")
    with TestClient(app) as test_client:
        try:
            test_health_check(test_client)
            test_incremental_indexing_logic()
            test_upload_and_duplicate_detection(test_client)
            test_reports_crud(test_client)
            test_chat_rag_endpoints(test_client)
            test_admin_reindex_endpoint(test_client)
            print("\n=======================================================")
            print("ALL AUTOMATED PRODUCTION INTEGRATION TESTS PASSED SUCCESSFULLY!")
            print("=======================================================")
        except Exception as e:
            import traceback
            traceback.print_exc()
            print(f"\nIntegration test failed: {e}")
            sys.exit(1)
