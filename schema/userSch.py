from pydantic import BaseModel
from typing import List,Optional

class UserSch(BaseModel):
    name: str
    password: str
    email: str
    role_id: List[int]
    
    class Config:
        from_attributes = True
    
    
class UserResp(BaseModel):
    id: Optional[int]
    name: str
    email: str
    role_id: List[int]
    
    
    class Config:
        from_attributes = True
        

class RequestUser(UserSch):
    pass