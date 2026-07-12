from parser.blood_report_parser import BloodReportParser


class ReportService:

    def __init__(self, parser: BloodReportParser | None = None):
        self.parser = parser or BloodReportParser()

    def parse(self, raw_text: str):
        return self.parser.parse(raw_text)
