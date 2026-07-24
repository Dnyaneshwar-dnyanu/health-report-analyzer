import sqlite3
import json
import uuid
import datetime
from pathlib import Path
from app.core.config import settings
from app.core.logger import logger


class ReportService:

    def __init__(self, db_path: str | None = None):
        if db_path is None:
            db_dir = Path(settings.vector_db_path).parent
            db_dir.mkdir(parents=True, exist_ok=True)
            self.db_path = str(db_dir / "reports.db")
        else:
            self.db_path = db_path

        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.db_path)
        conn.row_factory = sqlite3.Row
        return conn

    def _init_db(self):
        logger.info(f"Initializing SQLite database at: {self.db_path}")
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS reports (
                    report_id TEXT PRIMARY KEY,
                    patient_name TEXT,
                    report_date TEXT,
                    summary TEXT,
                    raw_text TEXT,
                    upload_time TEXT,
                    blood_parameters TEXT,
                    pdf_path TEXT,
                    file_hash TEXT
                )
            """)
            conn.commit()

            # Dynamic migration check: Ensure new columns exist if table was created previously without them
            cursor = conn.execute("PRAGMA table_info(reports)")
            columns = [row["name"] for row in cursor.fetchall()]

            if "pdf_path" not in columns:
                logger.info("Migrating SQLite: Adding pdf_path column to reports table.")
                conn.execute("ALTER TABLE reports ADD COLUMN pdf_path TEXT")
                conn.commit()

            if "file_hash" not in columns:
                logger.info("Migrating SQLite: Adding file_hash column to reports table.")
                conn.execute("ALTER TABLE reports ADD COLUMN file_hash TEXT")
                conn.commit()

    def save_report(self, patient_name: str | None, report_date: str | None, summary: str | None, raw_text: str, blood_parameters: list, pdf_path: str | None = None, file_hash: str | None = None) -> dict:
        report_id = str(uuid.uuid4())
        upload_time = datetime.datetime.now(datetime.timezone.utc).isoformat()

        blood_parameters_str = json.dumps(blood_parameters)

        with self._get_connection() as conn:
            conn.execute("""
                INSERT INTO reports (report_id, patient_name, report_date, summary, raw_text, upload_time, blood_parameters, pdf_path, file_hash)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (report_id, patient_name or "Unknown", report_date or "Unknown", summary or "", raw_text, upload_time, blood_parameters_str, pdf_path, file_hash))
            conn.commit()

        logger.info(f"Saved blood report with ID: {report_id} and hash: {file_hash} to SQLite.")
        return {
            "report_id": report_id,
            "patient_name": patient_name or "Unknown",
            "report_date": report_date or "Unknown",
            "summary": summary or "",
            "upload_time": upload_time,
            "blood_parameters": blood_parameters,
            "pdf_path": pdf_path,
            "file_hash": file_hash
        }

    def get_all_reports(self) -> list[dict]:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT report_id, patient_name, report_date, summary, upload_time, blood_parameters, pdf_path, file_hash FROM reports ORDER BY upload_time DESC")
            rows = cursor.fetchall()

            reports = []
            for row in rows:
                reports.append({
                    "report_id": row["report_id"],
                    "patient_name": row["patient_name"],
                    "report_date": row["report_date"],
                    "summary": row["summary"],
                    "upload_time": row["upload_time"],
                    "blood_parameters": json.loads(row["blood_parameters"]),
                    "pdf_path": row["pdf_path"],
                    "file_hash": row["file_hash"]
                })
            return reports

    def get_report_by_id(self, report_id: str) -> dict | None:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT report_id, patient_name, report_date, summary, raw_text, upload_time, blood_parameters, pdf_path, file_hash FROM reports WHERE report_id = ?", (report_id,))
            row = cursor.fetchone()

            if row is None:
                return None

            return {
                "report_id": row["report_id"],
                "patient_name": row["patient_name"],
                "report_date": row["report_date"],
                "summary": row["summary"],
                "raw_text": row["raw_text"],
                "upload_time": row["upload_time"],
                "blood_parameters": json.loads(row["blood_parameters"]),
                "pdf_path": row["pdf_path"],
                "file_hash": row["file_hash"]
            }

    def get_report_by_hash(self, file_hash: str) -> dict | None:
        if not file_hash:
            return None
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT report_id, patient_name, report_date, summary, raw_text, upload_time, blood_parameters, pdf_path, file_hash FROM reports WHERE file_hash = ?", (file_hash,))
            row = cursor.fetchone()

            if row is None:
                return None

            return {
                "report_id": row["report_id"],
                "patient_name": row["patient_name"],
                "report_date": row["report_date"],
                "summary": row["summary"],
                "raw_text": row["raw_text"],
                "upload_time": row["upload_time"],
                "blood_parameters": json.loads(row["blood_parameters"]),
                "pdf_path": row["pdf_path"],
                "file_hash": row["file_hash"]
            }

    def get_report_count(self) -> int:
        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM reports")
            return cursor.fetchone()[0]

    def get_parameter_history(self, biomarker_name: str) -> list[dict]:
        """
        Query historical values for a given biomarker across all saved reports.
        """
        if not biomarker_name:
            return []
        
        target_name = biomarker_name.lower().strip()
        history = []

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT report_id, report_date, upload_time, blood_parameters FROM reports ORDER BY upload_time ASC")
            rows = cursor.fetchall()

            for row in rows:
                params = json.loads(row["blood_parameters"])
                date_val = row["report_date"]
                if not date_val or date_val == "Unknown":
                    date_val = row["upload_time"].split("T")[0]

                for p in params:
                    b_name = p.get("biomarker", "").lower().strip()
                    if target_name in b_name or b_name in target_name:
                        raw_val = p.get("value")
                        try:
                            val_num = float(raw_val)
                        except (ValueError, TypeError):
                            val_num = raw_val

                        history.append({
                            "report_id": row["report_id"],
                            "date": date_val,
                            "value": val_num,
                            "unit": p.get("unit", ""),
                            "range": p.get("reference_range", "N/A"),
                            "flag": p.get("flag", "NORMAL")
                        })
                        break

        return history

    def delete_report(self, report_id: str) -> bool:

        report = self.get_report_by_id(report_id)
        if not report:
            return False

        # Attempt to delete the physical PDF file
        pdf_path = report.get("pdf_path")
        if pdf_path:
            try:
                p = Path(pdf_path)
                if p.exists() and p.is_file():
                    p.unlink()
                    logger.info(f"Successfully deleted associated PDF file from disk: {pdf_path}")
            except Exception as e:
                logger.error(f"Failed to delete associated PDF file {pdf_path}: {e}")

        with self._get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("DELETE FROM reports WHERE report_id = ?", (report_id,))
            conn.commit()
            changes = cursor.rowcount
            if changes > 0:
                logger.info(f"Deleted blood report with ID: {report_id} from SQLite.")
                return True
            else:
                logger.warning(f"Attempted to delete report with ID: {report_id} but it was not found.")
                return False
