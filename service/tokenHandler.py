from typing import Annotated
from fastapi import HTTPException, status
from typing import List
from functools import wraps
from fastapi import Depends
from model.role import Role
from schema.userSch import UserResp
from service.userServ import get_current_user


user_dependency = Annotated[UserResp,Depends(get_current_user)]
class TokenHandler():

    @staticmethod
    def check_user_roles(role_id: List[int]  , required_roles: List[Role]) -> bool:  
         if any(role in required_roles for role in role_id):
            return True
         else:
             return False
    
    
    def role_required(required_roles: List[Role]): 
        def decorator(func):
            @wraps(func)
            async def wrapper(user: user_dependency,*args, **kwargs):
               if user is None:
                   raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Authentication failed")
               token: dict = user
               if token is None:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Token not provided",
                    )
               user_roles = user.role_id
               print(user_roles)
               print(required_roles)
               if not TokenHandler.check_user_roles(user_roles, required_roles):
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="Insufficient privileges",
                    )
               return await func(user,*args, **kwargs)
            return wrapper
        return decorator