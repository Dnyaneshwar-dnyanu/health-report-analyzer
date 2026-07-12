from models.blood_report import BloodReport


class BloodReportParser:

    def parse(self, raw_text: str) -> BloodReport:
        return BloodReport(raw_text=raw_text)
