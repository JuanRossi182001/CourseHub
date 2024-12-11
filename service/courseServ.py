from typing import Annotated,List
from fastapi.param_functions import Depends
from fastapi import HTTPException, status
from model.course import Course
from sqlalchemy.orm import Session
from config.db.connection import get_db
from schema.CourseSch import CourseSch,CourseResp
from model.payment import Payment
from sqlalchemy import func



class CourseServ():
     def __init__(self,db: Annotated[Session,Depends(get_db)]) -> None:
        self.db = db
        
    # get all courses
     def get_all(self) -> List[Course]:
        course_list = self.db.query(Course).all()
        return [CourseResp.model_validate(course) for course in course_list]
   
    # get course by id
     def get_course(self, course_id: int) -> CourseResp:
        _course = self.db.query(Course).filter(course_id == Course.id).first()
        return CourseResp.model_validate(_course)
    
    
    # create course
     def create_course(self, course: CourseSch) -> CourseResp:
         _course = Course(**course.model_dump())
         self.db.add(_course)
         self.db.commit()
         self.db.refresh(_course)
         return CourseResp.model_validate(_course)
     

    # update course
     def update_course(self, course_id: int, course: CourseSch) -> CourseResp:
         _course = self.db.query(Course).filter(Course.id == course_id).first()
         if not _course:
             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
         _course.title = course.title
         _course.description = course.description
         _course.price = course.price
         _course.category = course.category
         _course.start_date = course.start_date
         _course.end_date = course.end_date
         _course.teacher_id = course.teacher_id
         _course.video_url = course.video_url
         self.db.commit()
         self.db.refresh(_course)
         return CourseResp.model_validate(_course)
     
     # delete course
     def delete_course(self, course_id: int) -> str:
         _course = self.db.query(Course).filter(Course.id == course_id).first()
         if not _course:
             raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Course not found")
         self.db.delete(_course)
         self.db.commit()
         return f" Course id {course_id} deleted"
     
     
     def get_user_courses(self, user_id: int) -> list[CourseResp]:
         _payments = self.db.query(Payment).filter(Payment.user_id == user_id).all()
    
         course_ids = [payment.course_id for payment in _payments]

         user_courses = [self.get_course(course_id) for course_id in course_ids]

         return [CourseResp.model_validate(course) for course in user_courses]
     
     def get_random_courses(self, limit: int = 2) -> list[CourseResp]:
        random_courses = self.db.query(Course).order_by(func.random()).limit(limit).all()
        return [CourseResp.model_validate(course) for course in random_courses]
