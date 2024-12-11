from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum

class PaymentMethodEnum(str, Enum):
    stripe = "stripe"
    paypal = "paypal"

class PaymentStatusEnum(str, Enum):
    pending = "pending"
    completed = "completed"
    failed = "failed"
    

class PaymentSch(BaseModel):
    user_id: int
    course_id: int
    amount: float
    payment_method: PaymentMethodEnum = PaymentMethodEnum.stripe
    status: PaymentStatusEnum = PaymentStatusEnum.pending
    payment_date: Optional[datetime]
    
    class Config:
        from_attributes = True
        
        
class PaymentResp(BaseModel):
    id:int
    user_id: int
    course_id: int
    amount: float
    payment_method: PaymentMethodEnum = PaymentMethodEnum.stripe
    status: PaymentStatusEnum = PaymentStatusEnum.pending
    payment_date: Optional[datetime]
    
    class Config:
        from_attributes = True
        

class RequestPayment(PaymentSch):
    pass