import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface PaymentDetails {
  id: string;
  course_id: number;
  amount: number;
  payment_date: string;
}

interface CourseDetails {
  id: number;
  title: string;
}

const PaymentSuccess: React.FC = () => {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchPaymentAndCourseDetails = async () => {
      const searchParams = new URLSearchParams(location.search);
      const paymentId = searchParams.get('paymentId');

      if (!paymentId) {
        setError('No payment ID provided');
        setLoading(false);
        return;
      }

      try {
        // Fetch payment details
        const paymentResponse = await fetch(`http://localhost:8000/payment/${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!paymentResponse.ok) {
          throw new Error('Failed to fetch payment details');
        }

        const paymentData: PaymentDetails = await paymentResponse.json();
        setPaymentDetails(paymentData);

        // Fetch course details
        const courseResponse = await fetch(`http://localhost:8000/course/${paymentData.course_id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!courseResponse.ok) {
          throw new Error('Failed to fetch course details');
        }

        const courseData: CourseDetails = await courseResponse.json();
        setCourseDetails(courseData);
      } catch (err) {
        setError('Failed to load payment or course details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentAndCourseDetails();
  }, [location.search]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <p>Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-content">
          <p className="error-message">{error}</p>
          <Link to="/home" className="button">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="success-container">
      <div className="success-content">
        <h1 className="success-title">Payment Successful!</h1>
        {paymentDetails && courseDetails && (
          <div className="details-container">
            <div className="course-info">
              <p>You have successfully enrolled in:</p>
              <h2 className="course-title">{courseDetails.title}</h2>
            </div>
            <div className="payment-info">
              <p><span className="label">Amount paid:</span> ${paymentDetails.amount.toFixed(2)}</p>
              <p><span className="label">Payment ID:</span> {paymentDetails.id}</p>
              <p><span className="label">Payment Date:</span> {new Date(paymentDetails.payment_date).toLocaleString()}</p>
            </div>
          </div>
        )}
        <div className="button-container">
          <Link to="/my-courses" className="button primary-button">
            Go to My Courses
          </Link>
          <Link to="/home" className="button secondary-button">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = `
  .success-container {
    width: 100vw;
    min-height: 100vh;
    background-color: #f0f4f8;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .success-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 500px;
    width: 100%;
  }

  .success-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    text-align: center;
    color: #2c3e50;
  }

  .details-container {
    margin-bottom: 1.5rem;
  }

  .course-info {
    text-align: center;
    margin-bottom: 1rem;
  }

  .course-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
    margin-top: 0.5rem;
  }

  .payment-info {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 4px;
  }

  .label {
    font-weight: 600;
  }

  .button-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .button {
    display: inline-block;
    padding: 0.75rem 1rem;
    border-radius: 4px;
    text-decoration: none;
    font-size: 1rem;
    text-align: center;
    transition: background-color 0.3s ease;
  }

  .primary-button {
    background-color: #006994;
    color: white;
  }

  .primary-button:hover {
    background-color: #005577;
  }

  .secondary-button {
    background-color: #e9ecef;
    color: #2c3e50;
  }

  .secondary-button:hover {
    background-color: #dee2e6;
  }

  .loading-container, .error-container {
    min-height: 100vh;
    background-color: #f0f4f8;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loading-content, .error-content {
    background-color: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .error-message {
    color: #e74c3c;
    margin-bottom: 1rem;
  }

  @media (min-width: 640px) {
    .button-container {
      flex-direction: row;
      justify-content: center;
    }
  }
`;

const PaymentSuccessWithStyles: React.FC = () => (
  <>
    <style>{styles}</style>
    <PaymentSuccess />
  </>
);

export default PaymentSuccessWithStyles;