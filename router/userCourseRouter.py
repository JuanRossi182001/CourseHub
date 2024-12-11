from fastapi import APIRouter
from service.userCourseServ import UserCourseServ
from typing import Annotated
from fastapi.param_functions import Depends
from model.user import User
from service.userServ import get_current_user
from schema.userCourseSch import UserCourseResp
from fastapi import status
from service.tokenHandler import TokenHandler
from model.role import Role

service_dependency = Annotated[UserCourseServ,Depends()]
user_dependency = Annotated[User,Depends(get_current_user)]
router = APIRouter()

@router.get("/{user_id}", response_model=list[UserCourseResp])
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER,Role.USER])
async def get_user_courses(user: user_dependency,service: service_dependency,user_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    _userCourses = service.get_user_courses(user_id=user_id)
    return _userCourses


@router.get("/", response_model=list[UserCourseResp])
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER,Role.USER])
async def get_all(user: user_dependency,service: service_dependency):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    _userCourses = service.get_all()
    return _userCourses


@router.get("/my-courses/{user_id}", response_model=int)
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER,Role.USER])
async def get_user_courses(user: user_dependency,service: service_dependency,user_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    _userCourses = service.count_user_courses(user_id=user_id)
    return _userCourses