import type { Document, Types } from 'mongoose';
import type { Role } from '../types';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  /** Instance method to compare a plain-text password against the stored hash */
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface IUserPublic {
  _id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: Date;
}
