"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const customError_1 = require("../utils/customError");
const JWT_SECRET = process.env.JWT_SECRET || 'smart_leads_super_secret_jwt_key_12345';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
class AuthService {
    /**
     * Registers a brand new user account
     */
    static async registerUser(input) {
        const { name, email, password, role } = input;
        // 1. Check if user already exists
        const existingUser = await User_1.User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            throw new customError_1.BadRequestError('Email is already registered');
        }
        // Assign generic premium user avatars based on role
        const avatarUrl = role === 'admin'
            ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120';
        // 2. Create the User Document (Mongoose hook hashes password automatically)
        const newUser = await User_1.User.create({
            name,
            email: email.toLowerCase(),
            password,
            role,
            avatarUrl,
        });
        // 3. Generate JWT access token
        const token = this.generateToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });
        const userResponse = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            avatarUrl: newUser.avatarUrl,
            createdAt: newUser.createdAt,
        };
        return { token, user: userResponse };
    }
    /**
     * Logs in a user by comparing email and hashed password
     */
    static async loginUser(input) {
        const { email, password } = input;
        // 1. Fetch user by email including select password
        const user = await User_1.User.findOne({ email: email.toLowerCase() }).select('+password');
        if (!user) {
            throw new customError_1.BadRequestError('Invalid email or password');
        }
        // 2. Verify hashed credentials
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new customError_1.BadRequestError('Invalid email or password');
        }
        // 3. Generate JWT token
        const token = this.generateToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatarUrl: user.avatarUrl,
            createdAt: user.createdAt,
        };
        return { token, user: userResponse };
    }
    /**
     * Retrieves active profile info for a user
     */
    static async getUserProfile(userId) {
        const user = await User_1.User.findById(userId);
        if (!user) {
            throw new customError_1.UnauthorizedError('User session invalid or expired');
        }
        return user;
    }
    /**
     * Internal helper: generates standard JWT token
     */
    static generateToken(payload) {
        return jsonwebtoken_1.default.sign({ ...payload }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
    }
}
exports.AuthService = AuthService;
