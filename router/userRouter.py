from fastapi import APIRouter,HTTPException, Depends,status
from service.userServ import UserServ,get_current_user
from schema.userSch import RequestUser,UserResp
from model.token import Token
from sqlalchemy.orm.exc import NoResultFound
from typing import Annotated
from model.role import Role
from model.user import User
from service.tokenHandler import TokenHandler
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta


router = APIRouter()


service_dependency = Annotated[UserServ,Depends()]
user_dependency = Annotated[User,Depends(get_current_user)]

# get all users end point
@router.get("/")
@TokenHandler.role_required([Role.ADMIN])
async def get_all(user: user_dependency, service: service_dependency):    
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    _users = service.get_all()
    return _users

# get user by id end point
@router.get("/{user_id}")
@TokenHandler.role_required([Role.ADMIN,Role.USER,Role.TEACHER])
async def get(user: user_dependency, service: service_dependency, user_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Authentication failed")
    try:    
        _user = service.get_user(user_id=user_id)
        return _user
    except NoResultFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    

# create user end point
@router.post("/create")
async def create(service: service_dependency, user: RequestUser):
    _user = service.create_user(user=user)
    return _user


# delete user end point
@router.delete("/delete/{user_id}")
@TokenHandler.role_required([Role.ADMIN])
async def delete(user: user_dependency,service: service_dependency, user_id: int):
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,)
    try:
        _user = service.delete_user(user_id=user_id)
        return _user
    except NoResultFound as e:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    
    
# changue password end point
@router.patch("/change-password/{user_id}")
async def changue_password(service: service_dependency,user_id: int,password: str):
    try:
        _user = service.change_password(user_id=user_id,password=password)
        return _user
    except:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Something went wrong")
    
# changue email end point
@router.patch("/change-email/{user_id}")
async def changue_password(service: service_dependency,user_id: int,email: str):
    try:
        _user = service.change_email(user_id=user_id,email=email)
        return _user
    except:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail="Something went wrong")
    
    

    
@router.post("/token",response_model=Token)
async def login_for_token(form_data: OAuth2PasswordRequestForm = Depends(), service: UserServ = Depends()):
    _user = service.auth_user(password=form_data.password, username=form_data.username)
    if not _user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")
    token = service.create_token(user_id=_user.id, username=_user.name, roles=_user.role_id, email=_user.email,expires_delta=timedelta(minutes=30))
    return {'access_token': token, 'token_type': 'bearer'}
    
    
# update user end point
@router.patch("/update/{user_id}")
async def update(service: service_dependency,user_id: int,user: UserResp):
    _user = service.update_user(user_id=user_id,user=user)
    return _user
    