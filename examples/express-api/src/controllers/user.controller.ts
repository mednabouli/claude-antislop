import type { Request, Response, NextFunction } from 'express';
import {
  findAllUsers,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllUserResponses,
  getUserResponseById,
} from '../services/user.service.js';
import type { CreateUserInput, UpdateUserInput } from '../models/user.js';

export async function getUsers(_req: Request, res: Response, _next: NextFunction) {
  try {
    const users = await getAllUserResponses();
    res.json({ data: users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id;
    const user = await getUserResponseById(userId);
    
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    
    res.json({ data: user });
  } catch (error) {
    next(error);
  }
}

export async function createUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const input: CreateUserInput = req.body;
    
    if (!input.name || !input.email || !input.password) {
      res.status(400).json({ error: 'Missing required fields' });
      return;
    }
    
    const user = await createUser(input);
    res.status(201).json({ data: toUserResponse(user) });
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      res.status(409).json({ error: error.message });
      return;
    }
    next(error);
  }
}

export async function updateUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id;
    const input: UpdateUserInput = req.body;
    
    const user = await updateUser(userId, input);
    res.json({ data: toUserResponse(user) });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        res.status(404).json({ error: error.message });
        return;
      }
      if (error.message.includes('already exists')) {
        res.status(409).json({ error: error.message });
        return;
      }
    }
    next(error);
  }
}

export async function deleteUserHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.params.id;
    await deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    if (error instanceof Error && error.message === 'User not found') {
      res.status(404).json({ error: error.message });
      return;
    }
    next(error);
  }
}
