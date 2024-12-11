import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number[];
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8000/user/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }

      const data = await response.json();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      setError('Error al obtener usuarios.');
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) {
        setError('No se puede actualizar. Usuario no encontrado.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/user/update/${editingUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: editingUser.id,
                name: editingUser.name,
                email: editingUser.email,
                role_id: editingUser.role_id,
            }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar usuario');
        }

        const updatedUser = await response.json();
        setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
        setFilteredUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );

        console.log('Usuario actualizado:', updatedUser);
        setEditingUser(null);
    } catch (error) {
        console.error(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleEdit = (user: User) => {
    setEditingUser(user);
  };

  const handleDelete = async (id: number) => {
    try {
        const response = await fetch(`http://localhost:8000/user/delete/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
    
        if (!response.ok) {
          throw new Error('Error al eliminar usuario');
        }
    
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        setFilteredUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        console.log('Usuario eliminado:', id);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        setError('Error al eliminar usuario.');
      }
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleUpdate();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editingUser) {
      const { name, value } = event.target;
      setEditingUser({
        ...editingUser,
        [name]: name === 'role_id' ? value.split(',').map(Number) : value,
      });
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#006994', // Azul mediterráneo
      margin: 0,
      padding: '1rem',
      boxSizing: 'border-box',
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '1200px',
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
          color: '#333',
          fontSize: '2rem',
        }}>Lista de Usuarios</h1>
        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Buscar usuarios por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '4px',
              fontSize: '1rem',
            }}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            backgroundColor: '#ffffff',
            color: '#000000',
          }}>
            <thead>
              <tr>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #3498db', textAlign: 'left', backgroundColor: '#3498db', color: '#fff' }}>Nombre</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #3498db', textAlign: 'left', backgroundColor: '#3498db', color: '#fff' }}>Email</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #3498db', textAlign: 'left', backgroundColor: '#3498db', color: '#fff' }}>Roles</th>
                <th style={{ padding: '0.75rem', borderBottom: '1px solid #3498db', textAlign: 'left', backgroundColor: '#3498db', color: '#fff' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f2f2f2' }}>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0', color: '#000000' }}>{user.name}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0', color: '#000000' }}>{user.email}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0', color: '#000000' }}>{user.role_id.join(', ')}</td>
                  <td style={{ padding: '0.75rem', borderBottom: '1px solid #e0e0e0', color: '#000000' }}>
                    <button
                      onClick={() => handleEdit(user)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        marginRight: '0.5rem',
                        cursor: 'pointer',
                        borderRadius: '4px',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        borderRadius: '4px',
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

        {editingUser && (
          <form onSubmit={handleSave} style={{ marginTop: '2rem', backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '8px' }}>
            <h2 style={{
              fontSize: '1.5rem',
              marginBottom: '1rem',
              color: '#333',
            }}>Editar Usuario</h2>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Nombre:</label>
              <input
                type="text"
                name="name"
                value={editingUser.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#fff',
                  color: '#000',
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Email:</label>
              <input
                type="email"
                name="email"
                value={editingUser.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#fff',
                  color: '#000',
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>Roles (separados por coma):</label>
              <input
                type="text"
                name="role_id"
                value={editingUser.role_id.join(',')}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  fontSize: '1rem',
                  backgroundColor: '#fff',
                  color: '#000',
                }}
              />
            </div>
            <button type="submit" style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginTop: '1rem',
            }}>
              Guardar
            </button>
          </form>
        )}
      </div>
    </div>
  );
}