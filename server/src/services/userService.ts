import prisma from '../db/prisma';

const PAGE_SIZE = 20;

// Fetch a paginated list of users using cursor-based pagination.
// If a cursor (user_id) is provided, it skips that record and fetches the next PAGE_SIZE users.
export const getUsers = async (cursor?: number) => {
  const users = await prisma.user.findMany({
    take: PAGE_SIZE,
    ...(cursor ? { skip: 1, cursor: { user_id: cursor } } : {}),
    orderBy: { user_id: 'asc' },
  });
  const nextCursor = users.length > 0 ? users[users.length - 1].user_id : null;
  return { data: users, nextCursor };
};

// Fetch a single user by ID.
export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { user_id: userId },
  });
};

// Create a new user with the provided name and email.
export const createUser = async (name: string, email: string) => {
  return prisma.user.create({
    data: { name, email },
  });
};

// Update an existing user's name and/or email.
export const updateUser = async (userId: number, name?: string, email?: string) => {
  return prisma.user.update({
    where: { user_id: userId },
    data: { name, email },
  });
};

// Delete a user by ID.
export const deleteUser = async (userId: number) => {
  return prisma.user.delete({
    where: { user_id: userId },
  });
};
