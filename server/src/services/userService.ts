import prisma from '../db/prisma';

const PAGE_SIZE = 10;

export interface User {
  user_id: number;
  name: string;
  email: string;
  created_at: Date; // Updated from string to Date
}

export interface PaginatedUsers {
  data: User[];
  nextCursor?: number | null;
  prevCursor?: number | null;
}

/**
 * Fetch a paginated list of users using cursor-based pagination.
 * 
 * For "next" (default):
 *   - If a cursor (user_id) is provided, it skips that record and fetches the next PAGE_SIZE users,
 *     ordered ascending.
 *   - Returns the data and a nextCursor for the next page.
 * 
 * For "prev":
 *   - Fetches users with user_id less than the provided cursor, ordered descending.
 *   - Reverses the result to return it in ascending order.
 *   - Returns the data and a prevCursor for the previous page.
 */
export const getUsers = async (
  cursor?: number,
  direction: 'next' | 'prev' = 'next'
): Promise<PaginatedUsers> => {
  if (direction === 'next') {
    const users = await prisma.user.findMany({
      take: PAGE_SIZE,
      ...(cursor ? { skip: 1, cursor: { user_id: cursor } } : {}),
      orderBy: { user_id: 'asc' },
    });
    const nextCursor = users.length > 0 ? users[users.length - 1].user_id : null;
    return { data: users, nextCursor };
  } else {
    // direction === 'prev'
    const users = await prisma.user.findMany({
      take: PAGE_SIZE,
      where: cursor ? { user_id: { lt: cursor } } : {},
      orderBy: { user_id: 'desc' },
    });
    const prevCursor = users.length > 0 ? users[users.length - 1].user_id : null;
    return { data: users.reverse(), prevCursor };
  }
};

// Fetch a single user by ID.
export const getUserById = async (userId: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { user_id: userId },
  });
};

// Create a new user with the provided name and email.
export const createUser = async (name: string, email: string): Promise<User> => {
  return prisma.user.create({
    data: { name, email },
  });
};

// Update an existing user's name and/or email.
export const updateUser = async (userId: number, name?: string, email?: string): Promise<User> => {
  return prisma.user.update({
    where: { user_id: userId },
    data: { name, email },
  });
};

// Delete a user by ID.
export const deleteUser = async (userId: number): Promise<User> => {
  return prisma.user.delete({
    where: { user_id: userId },
  });
};
