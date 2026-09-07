import type { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = err.statusCode ?? 500;
  const message = err.message ?? 'Internal server error';

  console.error('Error:', {
    message,
    statusCode,
    stack: err.stack,
  });

  res.status(statusCode).json({
    error: message,
    statusCode,
  });
}

export function notFoundHandler(_req: Request, res: Response, _next: NextFunction) {
  res.status(404).json({
    error: 'Not found',
    statusCode: 404,
  });
}
