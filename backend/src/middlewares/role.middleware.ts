import type { Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import type { AuthRequest } from './auth.middleware';
import type { Role } from '../types';

/**
 * Middleware to restrict access to specific roles.
 * Must be used AFTER the `protect` middleware.
 */
export const authorize = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `User role ${req.user.role} is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};
