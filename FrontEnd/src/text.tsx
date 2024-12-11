import React from 'react';

const BlankPage: React.FC = () => {
  const token = localStorage.getItem('token');
  return (
    <div style={{
      height: '100vh',
      width: '100vw',
      backgroundColor: 'white',
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '800px',
        overflowWrap: 'break-word',  // Asegura que el texto largo se ajuste en la pantalla
      }}>
        <h2>Token del Usuario</h2>
        <pre>{token}</pre>
      </div>
    </div>
  );
};

export default BlankPage;