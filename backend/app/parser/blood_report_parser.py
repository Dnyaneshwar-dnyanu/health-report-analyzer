import json
import re
from app.core.logger import logger
from app.llm.groq_client import GroqClient

PARSER_PROMPT = """
You are an expert medical data extractor. Your task is to extract structured information from a raw text page of a patient's blood report.
Extract the following information:
1. Patient name (if found, otherwise null)
2. Report date (if found, otherwise null)
3. Patient age (numeric integer if found, e.g. 45, otherwise null)
4. Patient gender/sex (e.g. "Male", "Female", or null)
5. Blood group (e.g. "O+", "A+", "B-", or null)
6. Blood parameters (a list of objects, each containing:
   - "biomarker": the name of the biomarker/test (e.g. Hemoglobin, RBC, WBC, Cholesterol)
   - "value": the numeric or text value of the test
   - "reference_range": the standard reference range (e.g. "12-16", ">150", or null)
   - "unit": the unit of measurement (e.g. "g/dL", "10^6/uL", or null)
   - "flag": status of the value relative to reference range (e.g. "NORMAL", "HIGH", "LOW", or null)
7. A concise 1-2 sentence medical summary of the key findings (e.g. "Hemoglobin is low, indicating mild anemia. Other parameters are normal.").

Return ONLY a valid JSON object in the following format:
{
  "patient_name": "...",
  "report_date": "...",
  "patient_age": 42,
  "patient_gender": "Male",
  "blood_group": "O+",
  "blood_parameters": [
     {
       "biomarker": "...",
       "value": "...",
       "reference_range": "...",
       "unit": "...",
       "flag": "..."
     }
  ],
  "summary": "..."
}

If no information is found or the text is empty, return an empty structure with empty arrays. Do not include markdown code block formatting in your raw response, return only raw JSON.
"""


def redact_phi(text: str) -> str:
    """
    Sanitize text to redact potential Sensitive PHI (phone numbers, email addresses, SSN patterns)
    before sending payload to external LLM services.
    """
    # Redact email addresses
    sanitized = re.sub(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}", "[REDACTED_EMAIL]", text)
    # Redact phone numbers
    sanitized = re.sub(r"\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", "[REDACTED_PHONE]", sanitized)
    # Redact Social Security Numbers (SSN)
    sanitized = re.sub(r"\b\d{3}-\d{2}-\d{4}\b", "[REDACTED_SSN]", sanitized)
    return sanitized


class BloodReportParser:

    def __init__(self, groq_client: GroqClient | None = None):
        # We lazy load or use the injected groq client
        self._groq_client = groq_client

    @property
    def groq_client(self):
        if self._groq_client is None:
            self._groq_client = GroqClient()
        return self._groq_client

    def parse(self, raw_text: str) -> dict:
        """
        Parses raw text of a blood report using Groq LLM to extract structured data.
        """
        logger.info("Parsing blood report text using Groq LLM...")

        from app.core.config import settings
        if not settings.groq_api_key or "YOUR_GROQ_API_KEY" in settings.groq_api_key or len(settings.groq_api_key.strip()) == 0:
            logger.warning("GROQ_API_KEY is not configured or mock. Using fallback structured mock extraction for local development.")
            return {
                "patient_name": "John Doe",
                "report_date": "2026-05-15",
                "patient_age": 42,
                "patient_gender": "Male",
                "blood_group": "O+",
                "blood_parameters": [
                    {
                        "biomarker": "Hemoglobin",
                        "value": "11.5",
                        "reference_range": "13.5 - 17.5",
                        "unit": "g/dL",
                        "flag": "LOW"
                    },
                    {
                        "biomarker": "Total Cholesterol",
                        "value": "215",
                        "reference_range": "< 200",
                        "unit": "mg/dL",
                        "flag": "HIGH"
                    },
                    {
                        "biomarker": "Fasting Glucose",
                        "value": "98",
                        "reference_range": "70 - 99",
                        "unit": "mg/dL",
                        "flag": "NORMAL"
                    }
                ],
                "summary": "Your hemoglobin level is slightly low (11.5 g/dL), indicating mild anemia. Total cholesterol is elevated at 215 mg/dL. Fasting glucose is within normal limits at 98 mg/dL."
            }

        sanitized_text = redact_phi(raw_text)

        from app.prompts.prompt import Prompt
        prompt = Prompt(
            user=f"Extract structured parameters from the following text:\n\n{sanitized_text}",
            system=PARSER_PROMPT
        )

        try:
            response_text = self.groq_client.generate(prompt)
            # Handle potential markdown code block formatting
            response_text = response_text.strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:]
            elif response_text.startswith("```"):
                response_text = response_text[3:]

            if response_text.endswith("```"):
                response_text = response_text[:-3]

            response_text = response_text.strip()

            parsed_json = json.loads(response_text)
            logger.info("Successfully parsed blood report text into JSON structure.")
            return parsed_json
        except Exception as e:
            logger.error(f"Error parsing blood report: {e}")
            # Return basic structure on failure
            return {
                "patient_name": "Unknown",
                "report_date": "Unknown",
                "patient_age": None,
                "patient_gender": None,
                "blood_group": None,
                "blood_parameters": [],
                "summary": f"Error parsing report content: {str(e)}"
            }

