from pydantic import BaseModel

class UserCourseSch(BaseModel):
    id: int
    user_id: int
    course_id: int

    class Config:
        from_attributes = True
        
        
class UserCourseResp(BaseModel):
    user_id: int
    course_id: int
    
    class Config:
        from_attributes = True
        
class RequestUserCourse(UserCourseSch):
    pass