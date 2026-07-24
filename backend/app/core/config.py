import os
from pathlib import Path
from dataclasses import dataclass
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent


def _resolve_path(env_val: str | None, default_path: Path) -> str:
    if not env_val:
        return str(default_path.resolve())
    p = Path(env_val)
    if p.is_absolute():
        return str(p.resolve())
    # Try resolving relative to BASE_DIR.parent (project root)
    proj_p = BASE_DIR.parent / env_val
    if proj_p.exists():
        return str(proj_p.resolve())
    # Try resolving relative to BASE_DIR (backend root)
    backend_p = BASE_DIR / env_val
    if backend_p.exists():
        return str(backend_p.resolve())
    return str(proj_p.resolve())


@dataclass(frozen=True)
class Settings:
    groq_api_key: str | None = os.getenv("GROQ_API_KEY")
    groq_model_name: str = os.getenv("MODEL_NAME") or os.getenv("GROQ_MODEL_NAME") or "llama-3.3-70b-versatile"
    embedding_model_name: str = os.getenv("EMBEDDING_MODEL_NAME", "BAAI/bge-small-en-v1.5")
    chunk_size: int = int(os.getenv("CHUNK_SIZE", "400"))
    chunk_overlap: int = int(os.getenv("CHUNK_OVERLAP", "50"))
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000")

    # Production Settings
    vector_db_path: str = _resolve_path(os.getenv("VECTOR_DB_PATH"), BASE_DIR / "chroma_db")
    upload_directory: str = _resolve_path(os.getenv("UPLOAD_DIRECTORY"), BASE_DIR / "uploads")
    knowledge_base_directory: str = _resolve_path(os.getenv("KNOWLEDGE_BASE_DIRECTORY"), BASE_DIR.parent / "knowledge_base")


settings = Settings()

