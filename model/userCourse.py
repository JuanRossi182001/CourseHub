from sqlalchemy import Column, Integer, ForeignKey
from sqlalchemy.orm import relationship
from config.config import base  

class UserCourse(base):
    __tablename__ = 'usercourse'
    
    user_id = Column(Integer, ForeignKey('users.id'), primary_key=True)
    course_id = Column(Integer, ForeignKey('courses.id'), primary_key=True)
    
    
    
