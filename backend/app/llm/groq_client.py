import os
import re
from dotenv import load_dotenv
from groq import Groq
from app.core.config import settings
from app.prompts.prompt import Prompt
from app.llm.llm import LLM
from app.core.logger import logger

load_dotenv()


class GroqClient(LLM):

    def __init__(self, model_name: str = settings.groq_model_name):
        api_key = settings.groq_api_key or os.getenv("GROQ_API_KEY")
        if not api_key or "YOUR_GROQ_API_KEY" in api_key or len(api_key.strip()) == 0:
            logger.warning("GROQ_API_KEY is missing or invalid. GroqClient running in offline fallback mode.")
            self.client = None
        else:
            try:
                self.client = Groq(api_key=api_key.strip())
            except Exception as e:
                logger.error(f"Failed to initialize Groq client: {e}")
                self.client = None

        self.model_name = model_name

    def generate(self, prompt: Prompt) -> str:
        if self.client is None:
            return self._fallback_generate(prompt, "GROQ_API_KEY is not configured.")

        try:
            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {
                        "role": "system",
                        "content": prompt.system
                    },
                    {
                        "role": "user",
                        "content": prompt.user
                    },
                ],
                temperature=0.2,
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.warning(f"Groq API generation error ({e}). Returning context-based fallback response.")
            return self._fallback_generate(prompt, str(e))

    def _fallback_generate(self, prompt: Prompt, error_msg: str) -> str:
        user_text = prompt.user
        
        # Extract patient report section if present
        report_match = re.search(r"Blood Report:\s*(.*?)\s*==============================", user_text, re.DOTALL)
        report_info = report_match.group(1).strip() if report_match else ""

        # Extract retrieved context section
        context_match = re.search(r"Retrieved Medical Context\s*==============================\s*(.*?)\s*==============================", user_text, re.DOTALL)
        context_info = context_match.group(1).strip() if context_match else ""

        lines = []
        if report_info:
            lines.append("Based on your uploaded blood report:")
            for line in report_info.splitlines():
                if line.strip():
                    lines.append(f"  • {line.strip()}")

        if context_info:
            lines.append("\nRelevant Information from Medical Knowledge Base:")
            chunks = context_info.split("Source:")
            for chunk in chunks:
                chunk = chunk.strip()
                if chunk:
                    chunk_lines = chunk.splitlines()
                    header = chunk_lines[0] if chunk_lines else ""
                    content = "\n".join(chunk_lines[1:]).strip() if len(chunk_lines) > 1 else chunk
                    lines.append(f"\n[{header}]\n{content[:400]}")

        if not lines:
            lines.append("No specific report parameters or medical context found for this query.")

        lines.append("\n\n*Note: Please check your GROQ_API_KEY in `backend/.env` for full Llama-3 AI conversational synthesis.*")
        return "\n".join(lines)

