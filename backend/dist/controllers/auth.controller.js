"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const auth_validator_1 = require("../validators/auth.validator");
const response_1 = require("../utils/response");
class AuthController {
    /**
     * POST /api/auth/register
     * Registers a new user account, signs JWT, and returns user details
     */
    static register = async (req, res, next) => {
        try {
            // 1. Validate payload inputs (validate middleware executes this automatically, 
            // but we parse directly as fallback/type-assurance)
            const validatedInput = auth_validator_1.registerValidator.parse(req.body);
            // 2. Delegate to Auth Service
            const result = await auth_service_1.AuthService.registerUser(validatedInput);
            // 3. Save JWT inside secure HTTP cookies
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching token expiration
            });
            return (0, response_1.sendSuccess)(res, 201, 'Registration successful', result);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * POST /api/auth/login
     * Validates credentials, saves token in cookies, and returns user session
     */
    static login = async (req, res, next) => {
        try {
            const validatedInput = auth_validator_1.loginValidator.parse(req.body);
            const result = await auth_service_1.AuthService.loginUser(validatedInput);
            // Save JWT in cookies
            res.cookie('token', result.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            });
            return (0, response_1.sendSuccess)(res, 200, 'Login successful', result);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /api/auth/me
     * Resolves the active user session based on validated tokens
     */
    static me = async (req, res, next) => {
        try {
            if (!req.user) {
                return (0, response_1.sendSuccess)(res, 200, 'Guest session active', { user: null });
            }
            const userProfile = await auth_service_1.AuthService.getUserProfile(req.user.id);
            return (0, response_1.sendSuccess)(res, 200, 'Profile retrieved successfully', {
                user: {
                    id: userProfile.id,
                    name: userProfile.name,
                    email: userProfile.email,
                    role: userProfile.role,
                    avatarUrl: userProfile.avatarUrl,
                    createdAt: userProfile.createdAt,
                },
            });
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * POST /api/auth/logout
     * Destroys active session cookies
     */
    static logout = async (req, res, next) => {
        try {
            res.clearCookie('token');
            return (0, response_1.sendSuccess)(res, 200, 'Logged out successfully', {});
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
exports.default = AuthController;
