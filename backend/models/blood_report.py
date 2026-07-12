from dataclasses import dataclass


@dataclass
class BloodReport:
    raw_text: str
    source: str | None = None
    patient_name: str | None = None
    report_date: str | None = None
