import { User } from '../models/user.model';
import { AppError } from '../utils/AppError';
import { generateToken } from '../utils/jwt';
import type { IUser } from '../interfaces/user.interface';

export const registerUser = async (userData: Partial<IUser>) => {
  const { name, email, password, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email is already registered', 400);
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = generateToken(user._id.toString());

  const userWithoutPassword = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  return { user: userWithoutPassword, token };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    throw new AppError('Invalid email or password', 401);
  }

  const token = generateToken(user._id.toString());

  const userWithoutPassword = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  return { user: userWithoutPassword, token };
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new AppError('User not found', 404);
  }
  return user;
};
