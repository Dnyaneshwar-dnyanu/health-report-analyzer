from pydantic import BaseModel, Field


class BiomarkerParameter(BaseModel):
    biomarker: str = Field(..., description="Name of the biomarker/test.")
    value: str | float = Field(..., description="Measured value.")
    reference_range: str | None = Field(None, description="Standard reference interval.")
    unit: str | None = Field(None, description="Unit of measurement.")
    flag: str | None = Field(None, description="Status flag: NORMAL, HIGH, LOW.")


class ReportResponse(BaseModel):
    report_id: str = Field(..., description="Unique ID of the report.")
    patient_name: str = Field("Unknown", description="Patient full name.")
    report_date: str = Field("Unknown", description="Report date.")
    summary: str = Field("", description="Medical summary of key findings.")
    upload_time: str = Field(..., description="Upload timestamp.")
    blood_parameters: list[BiomarkerParameter] = Field(default_factory=list, description="Extracted biomarkers list.")
    pdf_path: str | None = Field(None, description="Local disk path to uploaded PDF.")
    file_hash: str | None = Field(None, description="SHA-256 hash of PDF file.")


class ParameterHistoryItem(BaseModel):
    report_id: str
    date: str
    value: str | float
    unit: str
    range: str
    flag: str

