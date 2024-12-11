from fastapi import APIRouter,HTTPException,Depends,status
from service.courseServ import CourseServ
from schema.CourseSch import RequestCourse,CourseResp
from typing import Annotated
from sqlalchemy.orm.exc import NoResultFound
from model.user import User
from service.userServ import get_current_user
from model.role import Role
from service.tokenHandler import TokenHandler


router = APIRouter()
user_dependency = Annotated[User,Depends(get_current_user)]
service_dependency = Annotated[CourseServ,Depends()]

# get all courses end point
@router.get("/")
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER])
async def get_all(user: user_dependency,service:service_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    try:
        _courses = service.get_all()
        return _courses
    except NoResultFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
# get course by id end point
@router.get("/{course_id}")
@TokenHandler.role_required([Role.ADMIN,Role.USER,Role.TEACHER])
async def get_course(user: user_dependency,service:service_dependency, course_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    try:
        _course = service.get_course(course_id=course_id)
        return _course
    except NoResultFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
# create course end point
@router.post("/create")
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER])
async def create(user: user_dependency,service:service_dependency, course: RequestCourse):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    _course = service.create_course(course=course)
    return _course
    
    
# update course end point
@router.patch("/update/{course_id}")
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER])
async def update(user: user_dependency,service:service_dependency, course_id: int, course: RequestCourse):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    _course = service.update_course(course_id=course_id, course=course)
    return _course
    
# delete course end point
@router.delete("/delete/{course_id}")
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER])
async def delete( user: user_dependency,service:service_dependency, course_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    _course = service.delete_course(course_id=course_id)
    return _course

@router.get("/my-courses/{user_id}", response_model=list[CourseResp])
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER,Role.USER])
async def get_user_courses(user: user_dependency,service:service_dependency, user_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    _courses = service.get_user_courses(user_id=user_id)
    return _courses

@router.get("/random-courses/", response_model=list[CourseResp])
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER,Role.USER])
async def get_random_courses(user: user_dependency,service:service_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    _courses = service.get_random_courses()
    return _courses