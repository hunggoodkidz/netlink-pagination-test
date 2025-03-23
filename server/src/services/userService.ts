import prisma from '../db/prisma';

const PAGE_SIZE = 20;

export const getUsers = async (cursor?: number) => {
  const users = await prisma.user.findMany({
    take: PAGE_SIZE,
    ...(cursor ? { skip: 1, cursor: { user_id: cursor } } : {}),
    orderBy: { user_id: 'asc' },
  });
  const nextCursor = users.length > 0 ? users[users.length - 1].user_id : null;
  return { data: users, nextCursor };
};

export const getUserById = async (userId: number) => {
  return prisma.user.findUnique({
    where: { user_id: userId },
  });
};

export const createUser = async (name: string, email: string) => {
  return prisma.user.create({
    data: { name, email },
  });
};

export const updateUser = async (userId: number, name?: string, email?: string) => {
  return prisma.user.update({
    where: { user_id: userId },
    data: { name, email },
  });
};

export const deleteUser = async (userId: number) => {
  return prisma.user.delete({
    where: { user_id: userId },
  });
};
