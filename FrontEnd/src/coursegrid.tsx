/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface Teacher {
  id: number;
  name: string;
}

const CourseCard: React.FC<{ course: Course; teacher: Teacher | null }> = ({ course, teacher }) => {
  const navigate = useNavigate();

  const getYoutubeVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch {
      return null;
    }
  };

  const videoId = getYoutubeVideoId(course.video_url);
  const thumbnailUrl = videoId
    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    : 'https://via.placeholder.com/300x200?text=No+Thumbnail';

  const handleClick = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <div
      onClick={handleClick}
      css={css`
        width: 300px;
        margin: 1rem;
        padding: 1rem;
        background-color: #fff;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        cursor: pointer;
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
      `}
    >
      <img src={thumbnailUrl} alt={course.title} style={{ width: '100%', borderRadius: '8px' }} />
      <h3 style={{ color: '#3498db', marginTop: '1rem' }}>{course.title}</h3>
      <p>{course.description}</p>
      <p><strong>Price:</strong> ${course.price.toFixed(2)}</p>
      <p><strong>Category:</strong> {course.category}</p>
      <p><strong>Start Date:</strong> {new Date(course.start_date).toLocaleDateString()}</p>
      <p><strong>End Date:</strong> {new Date(course.end_date).toLocaleDateString()}</p>
      <p><strong>Teacher:</strong> {teacher ? teacher.name : 'Loading...'}</p>
    </div>
  );
};

const CoursesGrid: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<{ [key: number]: Teacher }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/course/', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }

        const data: Course[] = await response.json();
        setCourses(data);
        setFilteredCourses(data);
        setLoading(false);

        // Fetch teacher information for each course
        const teacherIds = [...new Set(data.map(course => course.teacher_id))];
        const teacherPromises = teacherIds.map(id => fetchTeacher(id));
        const teacherResults = await Promise.all(teacherPromises);
        const teacherMap = teacherResults.reduce((acc, teacher) => {
          if (teacher) {
            acc[teacher.id] = teacher;
          }
          return acc;
        }, {} as { [key: number]: Teacher });
        setTeachers(teacherMap);
      } catch (err) {
        setError('Failed to fetch courses. Please try again later.');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const fetchTeacher = async (teacherId: number): Promise<Teacher | null> => {
    try {
      const response = await fetch(`http://localhost:8000/user/${teacherId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch teacher');
      }

      const data = await response.json();
      return { id: data.id, name: data.name };
    } catch (err) {
      console.error(`Failed to fetch teacher with ID ${teacherId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (loading) {
    return <div>Loading courses...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{
      backgroundColor: '#f0f4f8',
      minHeight: '100vh',
      padding: '2rem',
      width: '100vw',
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '2rem',
      }}>
        Available Courses
      </h1>
      <div css={css`
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;
      `}>
        <input
          type="text"
          placeholder="Search courses..."
          value={searchTerm}
          onChange={handleSearchChange}
          css={css`
            width: 100%;
            max-width: 400px;
            padding: 0.5rem 1rem;
            font-size: 1rem;
            border: 1px solid #ccc;
            border-radius: 4px;
            &:focus {
              outline: none;
              border-color: #3498db;
              box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
            }
          `}
        />
      </div>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {filteredCourses.map((course) => (
          <CourseCard key={course.id} course={course} teacher={teachers[course.teacher_id] || null} />
        ))}
      </div>
      {filteredCourses.length === 0 && (
        <p css={css`
          text-align: center;
          color: #7f8c8d;
          font-size: 1.2rem;
          margin-top: 2rem;
        `}>
          No courses found matching your search.
        </p>
      )}
    </div>
  );
};

export default CoursesGrid;