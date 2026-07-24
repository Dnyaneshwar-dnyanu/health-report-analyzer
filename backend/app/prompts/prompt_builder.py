from app.models.search_result import SearchResult
from app.prompts.prompt import Prompt
from app.prompts.system_prompt import SYSTEM_PROMPT


class PromptBuilder:

    def build_prompt(
        self,
        question: str,
        search_results: list[SearchResult],
        blood_report: str | None = None,
    ) -> Prompt:

        context = []

        for result in search_results:

            chunk = result.chunk.chunk

            context.append(
                f"""
                    Source: {chunk.file_name}
                    Category: {chunk.category}
                    Section: {chunk.section}
                    {chunk.text}
                    """
            )

        context_text = "\n\n".join(context)

        report_section = ""

        if blood_report:

            report_section = f""" Blood Report: {blood_report} """

        user_prompt = f"""
                    {SYSTEM_PROMPT}

                    ==============================
                    Retrieved Medical Context
                    ==============================

                    {context_text}

                    ==============================
                    {report_section}
                    ==============================

                    User Question:

                    {question}

                    Answer:
                """

        return Prompt(
                user=user_prompt,
                system=SYSTEM_PROMPT
            )
