import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  start_date: string;
  end_date: string;
  teacher_id: number;
  video_url: string;
}

interface DecodedToken {
  sub: string;
  id: number;
  exp: number;
}

const MyCourses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 

  const getYoutubeVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.id;

        const response = await fetch(`http://localhost:8000/course/my-courses/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const coursesData: Course[] = await response.json();
        setCourses(coursesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching your courses');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, []);

  if (loading) {
    return <div className="loading">Loading your courses...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-courses">
      <h1>My Courses</h1>
      {courses.length === 0 ? (
        <p>You haven't enrolled in any courses yet.</p>
      ) : (
        <div className="course-grid">
          {courses.map((course) => {
            const videoId = getYoutubeVideoId(course.video_url);
            const thumbnailUrl = videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : 'https://via.placeholder.com/300x200?text=No+Thumbnail';

            return (
              <div key={course.id} className="course-card">
                <img src={thumbnailUrl} alt={course.title} className="course-image" />
                <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
                  <p>Category: {course.category}</p>
                  <p>Start Date: {new Date(course.start_date).toLocaleDateString()}</p>
                  <p>End Date: {new Date(course.end_date).toLocaleDateString()}</p>
                  <Link to={`/course/${course.id}`} className="view-course-btn">
                    View Course
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const styles = `
  .my-courses {
    width: 100vw;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 20px;
  }

  .course-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .course-card {
    border: 1px solid #ddd;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s ease;
    background-color: #fff;
  }

  .course-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }

  .course-image {
    width: 100%;
    height: 150px;
    object-fit: cover;
  }

  .course-info {
    padding: 15px;
  }

  .course-info h2 {
    font-size: 1.2rem;
    margin-bottom: 10px;
    color: #333;
  }

  .course-info p {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 5px;
  }

  .view-course-btn {
    display: inline-block;
    background-color: #006994;
    color: white;
    padding: 8px 15px;
    border-radius: 4px;
    text-decoration: none;
    transition: background-color 0.3s ease;
    margin-top: 10px;
  }

  .view-course-btn:hover {
    background-color: #005577;
  }

  .loading, .error {
    text-align: center;
    font-size: 1.2rem;
    color: #666;
    margin-top: 50px;
  }

  .error {
    color: #e74c3c;
  }

  @media (max-width: 768px) {
    .course-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    }
  }
`;

const MyCoursesWithStyles: React.FC = () => (
  <>
    <style>{styles}</style>
    <MyCourses />
  </>
);

export default MyCoursesWithStyles;