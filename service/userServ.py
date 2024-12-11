from typing import Annotated
from sqlalchemy.orm import Session
from fastapi.param_functions import Depends
from fastapi import HTTPException, status
from passlib.context import CryptContext
from model.user import User
from config.db.connection import get_db
from schema.userSch import UserSch,UserResp
from typing import List
from sqlalchemy.orm.exc import NoResultFound
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timedelta
from jose import jwt
from dotenv import load_dotenv
import os

load_dotenv('variables.env')

secret = os.getenv("SECRET_KEY")
algo = os.getenv("ALGORITH")

bcryptContext = CryptContext(schemes=['bcrypt'], deprecated ='auto')
SECRET_KEY = secret
ALGORITH = algo
oauth_bearer = OAuth2PasswordBearer(tokenUrl='user/token')


class UserServ():
    
    def __init__(self,db: Annotated[Session,Depends(get_db)]) -> None:
        self.db = db
        
    # Get all users   
    def get_all(self) -> List[UserResp]:
        user_list = self.db.query(User).all()
        return [UserResp.model_validate(user) for user in user_list]	
        
    # Get user by id
    def get_user(self, user_id: int) -> UserResp:
        _user = self.db.query(User).filter(User.id == user_id).first()
        if not _user:
            raise NoResultFound
        return UserResp.model_validate(_user)
    
    
    # Create new user
    def create_user(self,user:UserSch) -> UserResp:
        hashed_password = bcryptContext.hash(user.password)
        _user = User(name=user.name,
                     email=user.email,
                     role_id=user.role_id,
                     password=hashed_password)
        self.db.add(_user)
        self.db.commit()
        self.db.refresh(_user)
        return UserResp.model_validate(_user)
    
    
    # changue password
    def change_password(self, user_id: int, password: str) -> UserResp:
        _user = self.db.query(User).filter(User.id == user_id).first()
        if not _user:
            raise NoResultFound
        _user.password = bcryptContext.hash(password)
        self.db.commit()
        self.db.refresh(_user)
        return UserResp.model_validate(_user)
    
    
    # changue email
    def change_email(self, user_id: int, email: str) -> UserResp:
        _user = self.db.query(User).filter(User.id == user_id).first()
        if not _user:
            raise NoResultFound
        _user.email = email
        self.db.commit()
        self.db.refresh(_user)
        return UserResp.model_validate(_user)
        
        
    # delete user
    def delete_user(self, user_id: int) -> str:
        _user = self.db.query(User).filter(User.id == user_id).first()
        if not _user:
            raise NoResultFound
        self.db.delete(_user)
        self.db.commit()
        return f"User with id {user_id} deleted"
    
    # update user
    def update_user(self, user_id: int, user: UserResp) -> UserResp:
        _user = self.db.query(User).filter(User.id == user_id).first()
        if not _user:
            raise NoResultFound
        _user.name = user.name
        _user.email = user.email
        _user.role_id = user.role_id
        self.db.commit()
        self.db.refresh(_user)
        return UserResp.model_validate(_user)
    
    
    # authenticate user
    def auth_user(self, password: str, username: str) -> UserResp: 
        _user = self.db.query(User).filter(User.name == username).first()
        if not _user:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password"
        )
        if not bcryptContext.verify(password, _user.password):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials")
        return UserResp.model_validate(_user)
        
    
    
    # create acces token
    def create_token(self, user_id: int, username: str, roles: List[int], email: str,expires_delta: timedelta) -> str:
        to_encode = {'sub': username, 'id': user_id,'roles': roles, 'email': email}
        expire = datetime.utcnow() + expires_delta
        to_encode.update({'exp': expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITH)
        return encoded_jwt
    

# get current user
def get_current_user(user_service:Annotated[UserServ,Depends()],token: Annotated[str,Depends(oauth_bearer)]) -> UserResp:
        payload = jwt.decode(token,SECRET_KEY)
        user_id: int = payload.get('id')
        user = user_service.get_user(user_id=user_id)
        if user is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                    detail="Could not validate user.")
        return UserResp.model_validate(user)