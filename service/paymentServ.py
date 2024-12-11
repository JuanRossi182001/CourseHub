import stripe
from sqlalchemy.orm import Session
from model.payment import Payment, PaymentStatus, PaymentMethod
from schema.paymentSch import PaymentSch, PaymentResp
from datetime import datetime
from typing import Optional,Annotated
from config.db.connection import get_db
from fastapi.param_functions import Depends
from dotenv import load_dotenv
import os

load_dotenv('variables.env')

api_key = os.getenv("STRIPE_API_KEY")


stripe.api_key = api_key

class PaymentService:
    
    def __init__(self,db: Annotated[Session,Depends(get_db)]) -> None:
        self.db = db
    
    def create_payment(self, payment_data: PaymentSch) -> PaymentResp:
        # Crea un intento de pago con Stripe
        try:
            payment_intent = stripe.PaymentIntent.create(
                amount=int(payment_data.amount * 100),  # Convertir a centavos
                currency="usd",  
                payment_method_types=["card"],
                metadata={
                    "user_id": payment_data.user_id,
                    "course_id": payment_data.course_id
                }
            )

            # Crea el pago en la base de datos
            payment = Payment(
                user_id=payment_data.user_id,
                course_id=payment_data.course_id,
                amount=payment_data.amount,
                payment_method=PaymentMethod.stripe,
                status=PaymentStatus.pending,
                payment_date=datetime.now()
            )
            self.db.add(payment)
            self.db.commit()
            self.db.refresh(payment)

            return PaymentResp.model_validate(payment)

        except stripe.error.StripeError as e:
            self.db.rollback()
            raise Exception(f"Stripe error: {e.user_message}")

    
    def update_payment_status(self, payment_id: int, status: PaymentStatus) -> Optional[Payment]:
        payment = self.db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            return None
        
        payment.status = status
        self.db.commit()
        self.db.refresh(payment)
        return payment


    def get_payment(self, payment_id: int) -> PaymentResp:
        payment = self.db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            raise Exception("Payment not found")
        return PaymentResp.model_validate(payment)
    
