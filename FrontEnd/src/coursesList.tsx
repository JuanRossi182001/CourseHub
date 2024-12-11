import React, { useEffect, useState } from 'react';

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

const CoursesList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [creatingCourse, setCreatingCourse] = useState<Course | null>(null);

  const handleCreateCourse = async () => {
    if (!creatingCourse) return;

    try {
      const response = await fetch('http://localhost:8000/course/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(creatingCourse),
      });

      if (!response.ok) {
        throw new Error('Error al crear el curso');
      }

      const newCourse = await response.json();
      setCourses((prevCourses) => [...prevCourses, newCourse]);
      setFilteredCourses((prevCourses) => [...prevCourses, newCourse]);
      setCreatingCourse(null); // Cerrar el formulario de creación después de crear el curso
    } catch (error) {
      console.error('Error al crear curso:', error);
    }
  };

  const handleNewCourseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (creatingCourse) {
      const { name, value } = event.target;
      setCreatingCourse({
        ...creatingCourse,
        [name]: name === 'price' || name === 'teacher_id' ? parseFloat(value) : value,
      });
    }
  };


  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/course/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar los cursos');
        }

        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error: any) {
        setError('Error al obtener cursos.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const handleDelete = async (courseId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/course/delete/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el curso');
      }

      setCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
      setFilteredCourses(prevCourses => prevCourses.filter(course => course.id !== courseId));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) {
      setError('No se puede actualizar. Curso no encontrado.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/course/update/${editingCourse.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(editingCourse),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar curso');
      }

      const updatedCourse = await response.json();
      setCourses((prevCourses) =>
        prevCourses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
      );
      setFilteredCourses((prevCourses) =>
        prevCourses.map((course) => (course.id === updatedCourse.id ? updatedCourse : course))
      );

      console.log('Curso actualizado:', updatedCourse);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error al actualizar curso:', error);
    }
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
  };

  const handleCourseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingCourse) {
      const { name, value } = event.target;
      setEditingCourse({
        ...editingCourse,
        [name]: name === 'price' || name === 'teacher_id' ? parseFloat(value) : value,
      });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#006994', 
      margin: 0,
      padding: '1rem',
      boxSizing: 'border-box',
    }}>
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        margin: '2rem',
      }}>
        <h2 style={{
          fontSize: '2rem',
          color: '#2c3e50',
          marginBottom: '2rem',
          textAlign: 'center',
        }}>Lista de Cursos</h2>

<button onClick={() => setCreatingCourse({ id: 0, title: '', description: '', price: 0, category: '', start_date: '', end_date: '', teacher_id: 0, video_url: ''})} style={{ ...buttonStyle, backgroundColor: '#2ecc71', marginBottom: '1rem', width: '100%' }}>
          Crear Curso
        </button>

        
        {creatingCourse && (
  <div style={{ backgroundColor: '#f0f0f0', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
    <h3 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '1rem' }}>Nuevo Curso</h3>
    <form onSubmit={(e) => { e.preventDefault(); handleCreateCourse(); }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>Título:</label>
        <input type="text" name="title" value={creatingCourse.title} onChange={handleNewCourseChange} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Descripción:</label>
        <input type="text" name="description" value={creatingCourse.description} onChange={handleNewCourseChange} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Precio:</label>
        <input type="number" name="price" value={creatingCourse.price} onChange={handleNewCourseChange} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Categoría:</label>
        <input type="text" name="category" value={creatingCourse.category} onChange={handleNewCourseChange} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Fecha de Inicio:</label>
        <input type="date" name="start_date" value={creatingCourse.start_date} onChange={handleNewCourseChange} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>Fecha de Fin:</label>
        <input type="date" name="end_date" value={creatingCourse.end_date} onChange={handleNewCourseChange} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>ID del Profesor:</label>
        <input type="number" name="teacher_id" value={creatingCourse.teacher_id} onChange={handleNewCourseChange} style={inputStyle} />
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <label>URL del Video:</label>
        <input type="text" name="video_url" value={creatingCourse.video_url} onChange={handleNewCourseChange} style={inputStyle} />
      </div>
      <button type="submit" style={{ ...buttonStyle, backgroundColor: '#3498db', width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
        Crear Curso
      </button>
    </form>
  </div>
)}
        <div style={{ marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Buscar cursos por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
              backgroundColor: '#f7f5f5',
              color: '#050505',
            }}
          />
        </div>

        {loading ? (
          <p style={{ fontSize: '1.2rem', color: '#3498db', textAlign: 'center' }}>Cargando...</p>
        ) : error ? (
          <p style={{ color: '#e74c3c', fontSize: '1.2rem', textAlign: 'center' }}>{error}</p>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}> 
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
            }}>
              <thead>
                <tr style={{ backgroundColor: '#3498db', color: 'white' }}>
                  <th style={tableHeaderStyle}>Título</th>
                  <th style={tableHeaderStyle}>Descripción</th>
                  <th style={tableHeaderStyle}>Precio</th>
                  <th style={tableHeaderStyle}>Categoría</th>
                  <th style={tableHeaderStyle}>Fecha de Inicio</th>
                  <th style={tableHeaderStyle}>Fecha de Fin</th>
                  <th style={tableHeaderStyle}>ID del Profesor</th>
                  <th style={tableHeaderStyle}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.map((course, index) => (
                  <tr key={course.id} style={{
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  }}>
                    <td style={tableCellStyle}>{course.title}</td>
                    <td style={tableCellStyle}>{course.description}</td>
                    <td style={tableCellStyle}>${course.price.toFixed(2)}</td>
                    <td style={tableCellStyle}>{course.category}</td>
                    <td style={tableCellStyle}>{new Date(course.start_date).toLocaleDateString()}</td>
                    <td style={tableCellStyle}>{new Date(course.end_date).toLocaleDateString()}</td>
                    <td style={tableCellStyle}>{course.teacher_id}</td>
                    <td style={tableCellStyle}>
                      <button
                        onClick={() => handleEditCourse(course)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: '#3498db',
                          marginRight: '0.5rem',
                        }}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        style={{
                          ...buttonStyle,
                          backgroundColor: '#e74c3c',
                        }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {editingCourse && (
          <div style={{
            backgroundColor: '#f0f0f0',
            padding: '2rem',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            marginTop: '2rem',
          }}>
            <h3 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '1rem' }}>Editar Curso</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleUpdateCourse();
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <label>Título:</label>
                <input
                  type="text"
                  name="title"
                  value={editingCourse.title}
                  onChange={handleCourseChange}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Descripción:</label>
                <input
                  type="text"
                  name="description"
                  value={editingCourse.description}
                  onChange={handleCourseChange}
                  style={inputStyle}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label>Precio:</label>
                <input
                  type="number"
                  name="price"
                  value={editingCourse.price}
                  onChange={handleCourseChange}
                  style={inputStyle}
                />
              </div>
              <button type="submit" style={{ ...buttonStyle, width: '100%', backgroundColor: '#3498db' }}>
                Guardar Cambios
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const tableHeaderStyle = {
  padding: '0.75rem',
  textAlign: 'left' as const,
  fontWeight: 'bold' as const,
};

const tableCellStyle = {
  padding: '0.75rem',
};

const buttonStyle = {
  padding: '0.5rem 0.75rem',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #ccc',
  borderRadius: '4px',
  fontSize: '1rem',
  backgroundColor: 'white',
  color: 'black',
};

export default CoursesList;
