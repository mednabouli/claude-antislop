'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types/user';
import { UserList } from '@/components/UserList';
import { fetchUsers, createUser, deleteUser } from '@/lib/api';

export default function HomePage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setLoading(true);
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
      setError(null);
    } catch (err) {
      setError('Failed to load users');
      console.error('Error loading users:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser(id: string) {
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  }

  async function handleCreateUser() {
    try {
      const newUser = await createUser({
        name: `User ${users.length + 1}`,
        email: `user${users.length + 1}@example.com`,
      });
      setUsers([...users, newUser]);
    } catch (err) {
      setError('Failed to create user');
      console.error('Error creating user:', err);
    }
  }

  return (
    <div className="container">
      <header className="header">
        <h1>User Management</h1>
        <button
          onClick={handleCreateUser}
          className="btn btn-primary"
          type="button"
        >
          Add User
        </button>
      </header>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => setError(null)} type="button">
            Dismiss
          </button>
        </div>
      )}

      <UserList
        users={users}
        loading={loading}
        onDelete={handleDeleteUser}
      />
    </div>
  );
}
