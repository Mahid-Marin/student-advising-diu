from pydantic import BaseModel
from typing import Optional, List

class ChatMessage(BaseModel):
    message: str
    context: Optional[str] = ""
    session_id: Optional[str] = None
    student_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    session_id: str
    timestamp: str
    needs_escalation: bool = False

class StudentProfile(BaseModel):
    student_id: int
    name: str
    courses: List[str]
    current_gpa: float
    attendance_rate: float
    major: Optional[str] = None

class PerformanceData(BaseModel):
    marks: float
    attendance: float
    engagement_score: float
    courses_completed: int
    semester: str

class RecommendationRequest(BaseModel):
    student_profile: StudentProfile
    performance_data: PerformanceData

class RecommendationResponse(BaseModel):
    recommendations: List[str]
    priority_areas: List[str]
    success: bool
