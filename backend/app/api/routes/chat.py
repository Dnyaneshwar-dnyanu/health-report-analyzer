from fastapi import APIRouter, Depends, HTTPException
from fastapi.concurrency import run_in_threadpool
from pydantic import BaseModel, Field
from app.api.dependencies import get_chat_service
from app.services.chat_service import ChatService
from app.core.logger import logger

router = APIRouter()


class ChatRequest(BaseModel):
    question: str = Field(..., description="The medical question or query from the user.")
    report_id: str | None = Field(None, description="Optional report ID to provide context from a specific blood test report.")


class ChatResponse(BaseModel):
    answer: str = Field(..., description="The generated response from the AI assistant.")
    citations: list[str] = Field(default_factory=list, description="List of knowledge base file citations used for answering.")


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    chat_service: ChatService = Depends(get_chat_service)
):
    logger.info(f"Route POST /chat called with question: {request.question[:50]}... and report_id: {request.report_id}")
    try:
        result = await run_in_threadpool(
            chat_service.answer_with_citations,
            question=request.question,
            report_id=request.report_id
        )
        return ChatResponse(answer=result["answer"], citations=result["citations"])
    except ValueError as e:
        logger.error(f"Validation error in chat route: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Internal error in chat route: {e}")
        raise HTTPException(status_code=500, detail=str(e))

