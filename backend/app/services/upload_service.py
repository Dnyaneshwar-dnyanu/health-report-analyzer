import hashlib
import fitz
from pathlib import Path
from fastapi import UploadFile
from app.core.config import settings
from app.core.logger import logger
from app.ingestion.loaders.pdf_loader import load_pdf
from app.parser.blood_report_parser import BloodReportParser
from app.services.report_service import ReportService


MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


class UploadService:

    def __init__(self, parser: BloodReportParser | None = None, report_service: ReportService | None = None):
        self.parser = parser or BloodReportParser()
        self.report_service = report_service or ReportService()

        # Ensure uploads folder exists
        Path(settings.upload_directory).mkdir(parents=True, exist_ok=True)

    # ------------------------------------------------------------------
    # Public entry point
    # ------------------------------------------------------------------
    def upload_report(self, file: UploadFile) -> dict:
        """
        Main flow for handling a report upload.
        Each step is delegated to a small helper so the overall flow
        reads top-to-bottom like a checklist.
        """
        logger.info(f"Received file upload request: {file.filename}")

        self._validate_extension(file)
        file_bytes = self._read_and_validate_size(file)

        file_path = self._build_safe_file_path(file.filename)
        file_hash = self._compute_hash(file_bytes)

        # If we've seen this exact file before, short-circuit here.
        existing_report = self._get_existing_report(file_hash, file_path, file_bytes)
        if existing_report:
            return existing_report

        self._validate_pdf_integrity(file_bytes, file.filename)
        self._save_file_to_disk(file_path, file_bytes)

        raw_text = self._extract_text(file_path)
        parsed_data = self._parse_text(raw_text, file_path)

        return self._persist_report(parsed_data, raw_text, file_path, file_hash)

    # ------------------------------------------------------------------
    # Step helpers
    # ------------------------------------------------------------------
    def _validate_extension(self, file: UploadFile) -> None:
        """Reject anything that isn't a .pdf file."""
        if not file.filename.lower().endswith(".pdf"):
            logger.warning(f"File upload rejected: {file.filename} is not a PDF.")
            raise ValueError("Only PDF reports are supported.")

    def _read_and_validate_size(self, file: UploadFile) -> bytes:
        """Read the full upload into memory and enforce the size limit."""
        try:
            file_bytes = file.file.read()
            size = len(file_bytes)
            if size > MAX_FILE_SIZE:
                logger.warning(
                    f"File upload rejected: {file.filename} exceeds 10MB size limit (size={size} bytes)."
                )
                raise ValueError("File size exceeds the maximum limit of 10MB.")
        except ValueError:
            raise
        except Exception as e:
            logger.error(f"Failed to read file size: {e}")
            raise IOError("Could not read uploaded file size.")
        finally:
            # Reset file cursor so it can be read again later if needed.
            file.file.seek(0)

        return file_bytes

    def _build_safe_file_path(self, filename: str) -> Path:
        """Strip any directory components to prevent path traversal."""
        safe_filename = Path(filename).name
        return Path(settings.upload_directory) / safe_filename

    def _compute_hash(self, file_bytes: bytes) -> str:
        """Compute a SHA-256 hash of the file contents, used for dedup."""
        hasher = hashlib.sha256()
        hasher.update(file_bytes)
        return hasher.hexdigest()

    def _get_existing_report(self, file_hash: str, file_path: Path, file_bytes: bytes) -> dict | None:
        """
        If a report with this hash already exists in the DB, return it
        (restoring the PDF to disk first if it went missing).
        """
        existing_report = self.report_service.get_report_by_hash(file_hash)
        if not existing_report:
            return None

        logger.info(f"Duplicate upload detected. Returning existing report ID: {existing_report['report_id']}")

        existing_pdf_path = Path(existing_report.get("pdf_path") or "")
        if not existing_pdf_path.exists():
            logger.info(f"Existing PDF was missing from disk. Restoring file to: {file_path}")
            try:
                with file_path.open("wb") as buffer:
                    buffer.write(file_bytes)
            except Exception as e:
                logger.error(f"Failed to restore PDF file: {e}")

        return existing_report

    def _validate_pdf_integrity(self, file_bytes: bytes, filename: str) -> None:
        """Make sure the bytes are actually a readable PDF before saving."""
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            doc.close()
        except Exception as e:
            logger.warning(
                f"File upload rejected: {filename} appears to be corrupted or invalid PDF. Error: {e}"
            )
            raise ValueError("The uploaded file is not a valid PDF or is corrupted.")

    def _save_file_to_disk(self, file_path: Path, file_bytes: bytes) -> None:
        """Persist the uploaded PDF bytes to the uploads directory."""
        logger.info(f"Saving uploaded file to: {file_path}")
        try:
            with file_path.open("wb") as buffer:
                buffer.write(file_bytes)
        except Exception as e:
            logger.error(f"Failed to save file to disk: {e}")
            raise IOError(f"Could not save uploaded file to disk: {str(e)}")

    def _extract_text(self, file_path: Path) -> str:
        """Extract raw text from the PDF, cleaning up the file on failure."""
        logger.info("Extracting text from PDF...")
        try:
            raw_text = load_pdf(str(file_path))
        except Exception as e:
            logger.error(f"Error during PDF text extraction: {e}")
            self._delete_file_if_exists(file_path)
            raise ValueError(f"Failed to extract text from PDF: {str(e)}")

        if not raw_text.strip():
            logger.warning("Extracted text is empty. PDF might be empty or unreadable.")
            self._delete_file_if_exists(file_path)
            raise ValueError("No text could be extracted from the PDF report.")

        return raw_text

    def _parse_text(self, raw_text: str, file_path: Path) -> dict:
        """Run the LLM-backed parser to turn raw text into structured data."""
        try:
            return self.parser.parse(raw_text)
        except Exception as e:
            logger.error(f"Error parsing text with LLM: {e}")
            self._delete_file_if_exists(file_path)
            raise RuntimeError(f"Failed to extract biomarker parameters from report: {str(e)}")

    def _persist_report(self, parsed_data: dict, raw_text: str, file_path: Path, file_hash: str) -> dict:
        """Save the parsed report to SQLite, cleaning up the file on failure."""
        try:
            return self.report_service.save_report(
                patient_name=parsed_data.get("patient_name"),
                report_date=parsed_data.get("report_date"),
                summary=parsed_data.get("summary"),
                raw_text=raw_text,
                blood_parameters=parsed_data.get("blood_parameters", []),
                pdf_path=str(file_path),
                file_hash=file_hash,
            )
        except Exception as e:
            logger.error(f"Error saving parsed report to SQLite: {e}")
            self._delete_file_if_exists(file_path)
            raise RuntimeError(f"Database error during report persistence: {str(e)}")

    # ------------------------------------------------------------------
    # Small shared utility
    # ------------------------------------------------------------------
    def _delete_file_if_exists(self, file_path: Path) -> None:
        if file_path.exists():
            file_path.unlink()