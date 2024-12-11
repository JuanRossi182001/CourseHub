import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Course {
  id: number;
  title: string;
  description: string;
}

interface DecodedToken {
  id: number;
}

const Home: React.FC = () => {
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [userCoursesCount, setUserCoursesCount] = useState<number | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();


  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirigir a la página de inicio
  };


  useEffect(() => {
    // Decodificar el token y obtener user_id
    const token = localStorage.getItem('token');
    if (!token) {
      setError("No authentication token found");
      return;
    }
    
    const decodedToken = jwtDecode<DecodedToken>(token);
    const userId = decodedToken.id;

    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/course/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch courses');

        const courses: Course[] = await response.json();
        setFeaturedCourses(courses.slice(0, 3));
      } catch (err: any) {
        setError(err.message);
      }
    };

    const fetchUserCoursesCount = async () => {
      try {
        const response = await fetch(`http://localhost:8000/userCourse/my-courses/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch user courses count');

        const coursesCount: number = await response.json();
        setUserCoursesCount(coursesCount);
      } catch (err: any) {
        setError(err.message);
      }
    };

    const fetchRecommendedCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/course/random-courses/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch recommended courses');

        const courses: Course[] = await response.json();
        setRecommendedCourses(courses); 
      } catch (err: any) {
        setError(err.message);
      }
    };










    fetchCourses();
    fetchUserCoursesCount();
    fetchRecommendedCourses();
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f0f4f8',
      margin: 0,
      padding: '1rem',
      boxSizing: 'border-box',
    }}>
      <header style={{
        width: '100%',
        textAlign: 'center',
        padding: '2rem',
        backgroundColor: '#006994',
        color: 'white',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          marginBottom: '0.5rem',
        }}>
          Welcome to CourseHub
        </h1>
        <p style={{
          fontSize: '1.2rem',
        }}>
          Discover and enroll in courses to boost your skills
        </p>
        <button
          onClick={handleLogout}
          style={{
            position: 'absolute',
            top: '2rem',
            right: '1rem',
            padding: '0.6rem 1rem',
            backgroundColor: 'transparent',
            color: 'white',
            border: '2px solid white',
            borderRadius: '20px',
            fontSize: '0.9rem',
            cursor: 'pointer',
            transition: 'all 0.5s ease',
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
            e.currentTarget.style.color = '#006994';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'white';
          }}
        >
          Cerrar Sesión
        </button>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        padding: '2rem',
        boxSizing: 'border-box',
      }}>
        <div style={{
          maxWidth: '1200px',
          width: '100%',
        }}>
          <section style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '2rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginBottom: '2rem',
          }}>
            <h2 style={{
              color: '#2c3e50',
              fontSize: '1.8rem',
              marginBottom: '1rem',
            }}>
              Featured Courses
            </h2>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem',
            }}>
              {error ? (
                <p style={{ color: 'red' }}>{error}</p>
              ) : (
                featuredCourses.map((course) => (
                  <div key={course.id} style={{
                    backgroundColor: '#ecf0f1',
                    borderRadius: '8px',
                    padding: '1rem',
                  }}>
                    <h3 style={{
                      color: '#3498db',
                      marginBottom: '0.5rem',
                    }}>{course.title}</h3>
                    <p style={{ marginBottom: '1rem' }}>{course.description}</p>
                    <Link to={`/course/${course.id}`} style={{
                      color: '#3498db',
                      textDecoration: 'none',
                    }}>
                      View Course
                    </Link>
                  </div>
                ))
              )}
            </div>
            <Link to="/courses" style={{
              display: 'inline-block',
              backgroundColor: '#3498db',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              textDecoration: 'none',
              marginTop: '1rem',
            }}>
              View All Courses
            </Link>
          </section>

          <section style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem',
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
              <h2 style={{
                color: '#2c3e50',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}>
                Your Progress
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                You are currently enrolled in {userCoursesCount !== null ? userCoursesCount : '...'} courses.
              </p>
              <Link to="/my-courses" style={{
                color: '#3498db',
                textDecoration: 'none',
              }}>
                View My Courses
              </Link>
            </div>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '1.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}>
              <h2 style={{
                color: '#2c3e50',
                fontSize: '1.5rem',
                marginBottom: '1rem',
              }}>
                Recommended for You
              </h2>
              <ul style={{
                listStyleType: 'none',
                padding: 0,
              }}>
                {recommendedCourses.length > 0 ? (
                  recommendedCourses.map((course) => (
                    <li key={course.id} style={{ marginBottom: '0.5rem' }}>
                      <Link to={`/course/${course.id}`} style={{
                        color: '#3498db',
                        textDecoration: 'none',
                      }}>
                        {course.title}
                      </Link>
                    </li>
                  ))
                ) : (
                  <p>Loading recommended courses...</p>
                )}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Home;
