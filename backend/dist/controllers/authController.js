"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = exports.loginSchema = exports.registerSchema = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const db_1 = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || 'smart_leads_super_secret_jwt_key_12345';
const JWT_EXPIRES_IN = '7d';
// Validation Schemas
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Please enter a valid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['ADMIN', 'SALES_USER'])
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email('Please enter a valid email address'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters')
});
const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const db = (0, db_1.loadDB)();
        // Check if user already exists
        if (db.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
            return res.status(400).json({ message: 'Email already registered' });
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        // Dynamic professional avatar assignment
        const avatarUrl = role === 'ADMIN'
            ? 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120&h=120'
            : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120&h=120';
        const newUser = {
            id: `user-${Date.now()}`,
            name,
            email: email.toLowerCase(),
            role: role,
            avatarUrl,
            password: hashedPassword
        };
        db.users.push(newUser);
        (0, db_1.saveDB)(db);
        // Sign JWT
        const token = jsonwebtoken_1.default.sign({ id: newUser.id, email: newUser.email, role: newUser.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const { password: _, ...userWithoutPassword } = newUser;
        return res.status(201).json({
            token,
            user: userWithoutPassword
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const db = (0, db_1.loadDB)();
        const user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
        if (!user || !user.password) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare passwords
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Sign JWT
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({
            token,
            user: userWithoutPassword
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Server error during login' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const db = (0, db_1.loadDB)();
        const user = db.users.find(u => u.id === req.user?.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({ user: userWithoutPassword });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error retrieving user data' });
    }
};
exports.getMe = getMe;
