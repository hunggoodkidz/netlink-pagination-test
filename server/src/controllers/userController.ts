import { RequestHandler } from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from '../services/userService';

// GET /api/users?cursor=<cursor>
export const getUsersController: RequestHandler = async (req, res, next) => {
    try {
      const { cursor, direction } = req.query;
      const parsedCursor = cursor ? Number(cursor) : undefined;
      // Default to 'next' if no direction provided
      const dir = direction === 'prev' ? 'prev' : 'next';
      const result = await getUsers(parsedCursor, dir);
      res.json(result);
    } catch (error) {
      console.error('Error fetching users:', error);
      next(error);
    }
  };
  

// GET /api/users/:id
export const getUserByIdController: RequestHandler = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const user = await getUserById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        next(error);
    }
};

// POST /api/users
export const createUserController: RequestHandler = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const newUser = await createUser(name, email);
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error);
        next(error);
    }
};

// PUT /api/users/:id
export const updateUserController: RequestHandler = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const { name, email } = req.body;
        const updatedUser = await updateUser(userId, name, email);
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        next(error);
    }
};

// DELETE /api/users/:id
export const deleteUserController: RequestHandler = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const deletedUser = await deleteUser(userId);
        res.json({ message: 'User deleted successfully', deletedUser });
    } catch (error) {
        console.error('Error deleting user:', error);
        next(error);
    }
};
