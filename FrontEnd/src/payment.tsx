import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { jwtDecode } from 'jwt-decode';


interface PaymentData {
  user_id: number;
  course_id: number;
  amount: number;
  payment_method: string;
  status: string;
  payment_date: string;
}

interface Course {
  id: number;
  title: string;
  price: number;
}

interface DecodedToken {
  sub: string;
  id: number;
  roles: number[];
  email: string;
  exp: number;
}

const PaymentProcessor: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const stripe = useStripe();
  const elements = useElements();
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let userId: number | null = null;

  if (token) {
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      userId = decodedToken.id;
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }

  useEffect(() => {
    const fetchCourse = async () => {
      if (!token) {
        setError('No authentication token found');
        return;
      }

      try {
        const response = await fetch(`http://localhost:8000/course/${courseId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }

        const data = await response.json();
        setCourse(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCourse();
  }, [courseId, token]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !course || !userId) {
      setError('Unable to process payment. Please try again later.');
      return;
    }

    setProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentMethod) {
        throw new Error('Payment method creation failed');
      }

      const paymentData: PaymentData = {
        user_id: userId,
        course_id: course.id,
        amount: course.price,
        payment_method: 'stripe',
        status: 'pending',
        payment_date: new Date().toISOString(),
      };

      const response = await fetch('http://localhost:8000/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Payment failed');
      }

      const result = await response.json();
      // Payment successful
      navigate(`/payment-success?paymentId=${result.id}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!course) {
    return (
      <div style={{
        width: '100vw',
        minHeight: '100vh',
        backgroundColor: '#f0f4f8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#2c3e50',
      }}>
        {error ? error : 'Loading course details...'}
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '90%',
        maxWidth: '500px',
      }}>
        <h2 style={{
          color: '#2c3e50',
          fontSize: '1.8rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}>
          Process Payment
        </h2>
        <div style={{
          marginBottom: '1.5rem',
          textAlign: 'center',
          color: '#34495e',
        }}>
          <h3>{course.title}</h3>
          <p>Price: ${course.price.toFixed(2)}</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label 
              htmlFor="card-element"
              style={{
                display: 'block',
                marginBottom: '0.5rem',
                color: '#34495e',
              }}
            >
              Credit or debit card
            </label>
            <div id="card-element" style={{
              padding: '10px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}>
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>
          {error && (
            <div style={{
              color: '#e74c3c',
              marginBottom: '1rem',
            }}>
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={!stripe || processing || !userId}
            style={{
              backgroundColor: '#006994',
              color: 'white',
              border: 'none',
              padding: '0.75rem',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              width: '100%',
              transition: 'background-color 0.3s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005577'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#006994'}
          >
            {processing ? 'Processing...' : `Pay $${course.price.toFixed(2)}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentProcessor;