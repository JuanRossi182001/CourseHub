import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  start_date: string;
  end_date: string;
  teacher: number;
  video_url: string;
}

const getYoutubeVideoId = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('v');
  } catch {
    return null;
  }
};

const CourseDetail: React.FC = () => {
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();


  const handleEnrollClick = () => {
    navigate(`/payment/${id}`);
  };
  

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8000/course/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch course');
        
        const data = await response.json();
        setCourse(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchCourse();
  }, [id]);

  if (error) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: 'red',
      }}>
        {error}
      </div>
    );
  }

  if (!course) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
        Loading...
      </div>
    );
  }

  const videoId = getYoutubeVideoId(course.video_url);
  const thumbnailUrl = videoId 
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : 'https://via.placeholder.com/300x200?text=No+Thumbnail';

  return (
    <div style={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
    }}>
      {/* Hero Section */}
      <div style={{
        width: '100%',
        height: '50vh',
        position: 'relative',
        backgroundColor: '#000',
      }}>
        <img 
          src={thumbnailUrl}
          alt={course.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: '0.7',
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '2rem',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          textAlign: 'center',
          width: '90%',
          maxWidth: '1200px',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
          }}>
            {course.title}
          </h1>
        </div>
      </div>

      {/* Course Details Section */}
      <div style={{
        width: '90%',
        maxWidth: '1200px',
        margin: '-3rem auto 0',
        position: 'relative',
        zIndex: 1,
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
            marginBottom: '2rem',
          }}>
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Price</h3>
              <p style={{ fontSize: '1.5rem', color: '#006994' }}>${course.price.toFixed(2)}</p>
            </div>
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Duration</h3>
              <p>
                From: {new Date(course.start_date).toLocaleDateString()}<br />
                To: {new Date(course.end_date).toLocaleDateString()}
              </p>
            </div>
            <div>
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Instructor</h3>
              <p>{course.teacher}</p>
            </div>
          </div>

          <div>
            <h2 style={{ 
              color: '#2c3e50', 
              marginBottom: '1rem',
              fontSize: '1.8rem',
            }}>
              Course Description
            </h2>
            <p style={{
              lineHeight: '1.6',
              color: '#34495e',
            }}>
              {course.description}
            </p>
          </div>

          <button 
             onClick={handleEnrollClick}
             style={{
               backgroundColor: '#006994',
               color: 'white',
               border: 'none',
               padding: '1rem 2rem',
               borderRadius: '4px',
               fontSize: '1.1rem',
               cursor: 'pointer',
               marginTop: '2rem',
               transition: 'background-color 0.3s ease',
             }}
             onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#005577'}
             onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#006994'}
           >
             Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;