import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUserHandler,
  updateUserHandler,
  deleteUserHandler,
} from '../controllers/user.controller.js';
import { validateRequest } from '../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']).optional(),
});

const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  role: z.enum(['user', 'admin']).optional(),
  active: z.boolean().optional(),
});

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', validateRequest(createUserSchema), createUserHandler);
router.put('/:id', validateRequest(updateUserSchema), updateUserHandler);
router.delete('/:id', deleteUserHandler);

export { router as userRoutes };
