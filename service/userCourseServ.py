from typing import Annotated,List
from sqlalchemy.orm import Session
from config.db.connection import get_db
from fastapi.param_functions import Depends
from model.userCourse import UserCourse
from schema.userCourseSch import UserCourseResp
from fastapi import HTTPException, status


class UserCourseServ():
    def __init__(self,db: Annotated[Session,Depends(get_db)]) -> None:
        self.db = db
        
    # get user courses by id
    def get_user_courses(self, user_id: int) -> List[UserCourseResp]:
        _courses = self.db.query(UserCourse).filter(UserCourse.user_id == user_id).all()
        if not _courses:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Data not found")
        return [UserCourseResp.model_validate(userCourse) for userCourse in _courses]
    
    
    # get all user courses
    def get_all(self) -> List[UserCourseResp]:
        _courses = self.db.query(UserCourse).all()
        return [UserCourseResp.model_validate(userCourse) for userCourse in _courses]
    
    
    def count_user_courses(self, user_id: int) -> int:
        _user_course = self.db.query(UserCourse).filter(UserCourse.user_id == user_id).count()
        return _user_course