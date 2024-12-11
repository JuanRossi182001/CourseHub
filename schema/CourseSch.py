from pydantic import BaseModel
from datetime import date


class CourseSch(BaseModel):
    title: str
    description: str
    price: float
    category: str
    start_date: date
    end_date: date
    teacher_id: int 
    video_url: str
    
    class Config:
        from_attributes = True
        
        
class CourseResp(BaseModel):
    id:int
    title: str
    description: str
    price: float
    category: str
    start_date: date
    end_date: date
    teacher_id: int
    video_url: str
    
    class Config:
        from_attributes = True
    
    
    
class RequestCourse(CourseSch):
    pass
    
                     