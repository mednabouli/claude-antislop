import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

export function validateRequest<T extends z.ZodType>(schema: T) {
  return function validationMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        });
        return;
      }
      next(error);
    }
  };
}
