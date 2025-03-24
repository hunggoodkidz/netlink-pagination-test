// src/components/UserList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { fetchUsers, PaginatedUsers, User } from '../services/userService';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async (cursor?: number) => {
    setLoading(true);
    setError(null);
    try {
      const data: PaginatedUsers = await fetchUsers(cursor);
      setUsers(prev => [...prev, ...data.data]);
      setNextCursor(data.nextCursor);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load on mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      {users.length === 0 && !loading && <p>No users found.</p>}
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.user_id} className="border rounded p-4 shadow">
            <p><strong>ID:</strong> {user.user_id}</p>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {nextCursor && !loading && (
        <button
          onClick={() => loadUsers(nextCursor)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Load More
        </button>
      )}
    </div>
  );
};

export default UserList;
