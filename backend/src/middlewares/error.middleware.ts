import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { sendErrorResponse } from '../utils/response';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for dev
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token is invalid. Please log in again.';
    error = new AppError(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token has expired. Please log in again.';
    error = new AppError(message, 401);
  }

  // Zod validation error handled in validation middleware, but catch if it reaches here
  if (err.name === 'ZodError') {
    const message = 'Validation Error';
    error = new AppError(message, 400, err.errors);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';

  sendErrorResponse({ res, statusCode, message, errors: error.errors });
};
