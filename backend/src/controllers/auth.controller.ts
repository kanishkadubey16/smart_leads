import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import * as authService from '../services/auth.service';
import { sendSuccessResponse } from '../utils/response';
import type { AuthRequest } from '../middlewares/auth.middleware';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.registerUser(req.body);

  sendSuccessResponse({
    res,
    statusCode: 201,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);

  sendSuccessResponse({
    res,
    statusCode: 200,
    message: 'Logged in successfully',
    data: result,
  });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = req.user;

  sendSuccessResponse({
    res,
    statusCode: 200,
    message: 'User fetched successfully',
    data: { user },
  });
});
