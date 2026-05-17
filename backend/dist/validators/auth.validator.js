"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const zod_1 = require("zod");
exports.registerValidator = zod_1.z.object({
    name: zod_1.z
        .string({ required_error: 'Name is required' })
        .trim()
        .min(2, 'Name must be at least 2 characters'),
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Please enter a valid email address'),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters'),
    role: zod_1.z
        .enum(['admin', 'sales'], {
        errorMap: () => ({ message: 'Role must be either admin or sales' }),
    })
        .default('sales'),
});
exports.loginValidator = zod_1.z.object({
    email: zod_1.z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Please enter a valid email address'),
    password: zod_1.z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters'),
});
