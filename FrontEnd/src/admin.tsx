import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();

  // Verifica si el usuario está autenticado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      handleLogout(); // Si no hay token, cierra sesión y redirige al login
    }
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Eliminar el token
    window.location.href = '/'; // Redirigir a la página de inicio
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      backgroundColor: '#f0f8ff',
      margin: 0,
      padding: 0,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2.5rem',
        borderRadius: '20px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#333',
          fontSize: '28px',
          fontWeight: 'bold',
        }}>Panel de Administración</h1>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
        }}>
          <button
            onClick={() => handleNavigation('/admin/courses')}
            style={{
              ...buttonStyle,
              backgroundColor: '#4a90e2',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#357abd';
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#4a90e2';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            Ver Cursos
          </button>
          <button
            onClick={() => handleNavigation('/admin/users')}
            style={{
              ...buttonStyle,
              backgroundColor: '#50c878',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#3cb371';
              e.currentTarget.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#50c878';
              e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            }}
          >
            Ver Usuarios
          </button>
        </div>
        <div style={{
          marginTop: '2.5rem',
          textAlign: 'center',
        }}>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1.5rem',
              backgroundColor: 'transparent',
              color: '#e74c3c',
              border: '2px solid #e74c3c',
              borderRadius: '20px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#e74c3c';
              e.currentTarget.style.color = 'white';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#e74c3c';
            }}
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;