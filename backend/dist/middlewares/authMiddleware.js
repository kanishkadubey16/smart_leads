"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const customError_1 = require("../utils/customError");
const authMiddleware = (req, res, next) => {
    let token;
    // 1. Check Authorization header (Bearer style)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }
    // 2. Fallback check request cookies
    else if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }
    if (!token) {
        return next(new customError_1.UnauthorizedError('Access denied. No token provided.'));
    }
    try {
        const secret = process.env.JWT_SECRET || 'smart_leads_super_secret_jwt_key_12345';
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        // Attach user payload to Express request context
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new customError_1.UnauthorizedError('Access denied. Invalid or expired token.'));
    }
};
exports.authMiddleware = authMiddleware;
exports.default = exports.authMiddleware;
