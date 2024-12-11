from config.config import base
from sqlalchemy import Integer,Column,ARRAY,String
from sqlalchemy.orm import Mapped
from model.role import Role
from sqlalchemy.orm import relationship

class User(base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    name = Column(String)
    email = Column(String)
    password = Column(String)
    role_id: Mapped[Role] = Column(ARRAY(Integer))
    
    courses = relationship("Course", back_populates="user")
    payments = relationship("Payment", back_populates="user")

    