from fastapi import APIRouter, HTTPException, Depends
from service.paymentServ import PaymentService
from schema.paymentSch import PaymentSch, PaymentResp
from typing import Annotated
from model.payment import PaymentStatus
from service.tokenHandler import TokenHandler
from model.role import Role
from model.user import User
from service.userServ import get_current_user

router = APIRouter()

service_dependency = Annotated[PaymentService,Depends()]
user_dependency = Annotated[User,Depends(get_current_user)]

@router.post("/create", response_model=PaymentResp)
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER,Role.USER])
async def create_payment(user: user_dependency,payment_data: PaymentSch,service: service_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed")
    try:
        payment = service.create_payment(payment_data=payment_data)
        return payment
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/update/{payment_id}/status", response_model=PaymentResp)
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER,Role.USER])
async def update_payment_status(user:user_dependency,payment_id: int, status: str,service: service_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed")
    payment_status = PaymentStatus[status]  # Convertir el string en un enum de PaymentStatus
    payment = service.update_payment_status(payment_id, payment_status)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment


@router.get("/{payment_id}", response_model=PaymentResp)
@TokenHandler.role_required([Role.ADMIN,Role.TEACHER,Role.USER])
async def get_payment(user:user_dependency,payment_id: int,service: service_dependency):
    if user is None:
        raise HTTPException(status_code=401, detail="Authentication failed")
    payment = service.get_payment(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    return payment

