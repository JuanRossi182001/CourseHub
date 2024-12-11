from config.config import base
from sqlalchemy import Column, Integer, String, Date, Float,ForeignKey
from sqlalchemy.orm import relationship


class Course(base):
    __tablename__ = 'courses'
    
    id = Column(Integer, primary_key=True)
    title = Column(String)
    description = Column(String)
    price = Column(Float)
    category = Column(String)
    start_date = Column(Date)
    end_date = Column(Date)
    teacher_id = Column(Integer,ForeignKey("users.id"))
    video_url = Column(String)
    
    user = relationship("User", back_populates="courses")
    payments = relationship("Payment", back_populates="course")
    