from config.config import base
from sqlalchemy import Column, Integer, ForeignKey, Float, DateTime, String, Enum
from datetime import datetime
import enum
from sqlalchemy.orm import relationship


class PaymentMethod(enum.Enum):
    stripe = "stripe"
    paypal = "paypal"
    

class PaymentStatus(enum.Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"





class Payment(base):
    __tablename__ = "payment"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    course_id = Column(Integer, ForeignKey('courses.id'))
    amount = Column(Float, nullable = False)
    payment_date = Column(DateTime, default = datetime.now())
    payment_method = Column(Enum(PaymentMethod), default = PaymentMethod.stripe)
    status = Column(Enum(PaymentStatus), default = PaymentStatus.pending)
    
    user = relationship("User", back_populates="payments")
    course = relationship("Course", back_populates="payments")