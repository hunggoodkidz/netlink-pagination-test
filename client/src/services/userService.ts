import api from '../utils/api';

export interface User {
  user_id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface PaginatedUsers {
  data: User[];
  nextCursor: number | null;
}

// Fetch paginated users with optional cursor-based pagination
export const fetchUsers = async (cursor?: number): Promise<PaginatedUsers> => {
  const response = await api.get<PaginatedUsers>('/api/users', { params: { cursor } });
  return response.data;
};

// Fetch a single user by id
export const fetchUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/api/users/${id}`);
  return response.data;
};

// Create a new user
export const createUser = async (name: string, email: string): Promise<User> => {
  const response = await api.post<User>('/api/users', { name, email });
  return response.data;
};

// Update an existing user without sending undefined values
export const updateUser = async (id: number, name?: string, email?: string): Promise<User> => {
  const payload: { name?: string; email?: string } = {};
  if (name !== undefined) payload.name = name;
  if (email !== undefined) payload.email = email;
  
  const response = await api.put<User>(`/api/users/${id}`, payload);
  return response.data;
};

// Delete a user
export const deleteUser = async (id: number): Promise<{ message: string }> => {
  const response = await api.delete<{ message: string }>(`/api/users/${id}`);
  return response.data;
};
