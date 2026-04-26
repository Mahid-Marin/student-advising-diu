from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime
from app.services.groq_service import groq_service

router = APIRouter()

class ExplainRequest(BaseModel):
    content: str
    title: str = "Content"
    prompt: str = ""
    question: str = ""

class ExplainResponse(BaseModel):
    explanation: str
    success: bool
    title: str

@router.post("/explain", response_model=ExplainResponse)
async def explain_content(request: ExplainRequest):
    """
    Generate explanation for knowledge base content using Groq AI
    """
    try:
        # Build comprehensive prompt for Groq
        full_prompt = f"""
        Topic: {request.title}
        Content: {request.content}
        
        Question: {request.question if request.question else 'Explain this content'}
        
        {request.prompt if request.prompt else ''}
        
        Please provide a clear, student-friendly explanation focusing on:
        1. Main concepts
        2. Real-world applications
        3. Key takeaways
        4. Study tips if applicable
        
        Keep the explanation concise but comprehensive (200-400 words).
        """
        
        # Get AI response
        explanation = groq_service.chat_with_context(
            user_message=full_prompt,
            context=f"Topic: {request.title}"
        )
        
        return ExplainResponse(
            explanation=explanation,
            success=True,
            title=request.title
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating explanation: {str(e)}")

@router.get("/health")
async def ai_health():
    """Check if AI service is running"""
    try:
        # Test Groq API availability
        test_response = groq_service.chat_with_context("Hello")
        if test_response and "error" not in test_response.lower():
            return {"status": "healthy", "service": "ai-service"}
        return {"status": "unhealthy", "service": "ai-service", "message": "Groq API not responding"}
    except Exception as e:
        return {"status": "unhealthy", "service": "ai-service", "error": str(e)}

@router.post("/followup")
async def follow_up_question(request: dict):
    """Ask a follow-up question about previous content"""
    try:
        question = request.get("question", "")
        context = request.get("context", "")
        
        response = groq_service.chat_with_context(
            user_message=question,
            context=context
        )
        
        return {
            "response": response,
            "success": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing follow-up: {str(e)}")
