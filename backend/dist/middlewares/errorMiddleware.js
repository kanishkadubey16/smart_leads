"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const customError_1 = require("../utils/customError");
const response_1 = require("../utils/response");
const errorMiddleware = (err, req, res, next) => {
    // 1. Handled custom error classes
    if (err instanceof customError_1.CustomError) {
        return (0, response_1.sendError)(res, err.statusCode, err.message, err.serializeErrors());
    }
    // 2. Mongoose Duplicate Key Error (Code 11000)
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const message = `A record with that ${field} already exists`;
        return (0, response_1.sendError)(res, 400, 'Duplicate field error', [{ message, field }]);
    }
    // 3. Mongoose Cast Error (Invalid ObjectId)
    if (err.name === 'CastError') {
        const field = err.path;
        const message = `Invalid value for field: ${field}`;
        return (0, response_1.sendError)(res, 400, 'Invalid parameter format', [{ message, field }]);
    }
    // 4. Mongoose ValidationError
    if (err.name === 'ValidationError') {
        const errorsList = Object.values(err.errors).map((val) => ({
            message: val.message,
            field: val.path,
        }));
        return (0, response_1.sendError)(res, 400, 'Validation failed', errorsList);
    }
    // 5. JWT Authorization Errors
    if (err.name === 'JsonWebTokenError') {
        return (0, response_1.sendError)(res, 401, 'Unauthorized access', [
            { message: 'Invalid authentication token signature' },
        ]);
    }
    if (err.name === 'TokenExpiredError') {
        return (0, response_1.sendError)(res, 401, 'Session expired', [
            { message: 'Authentication session expired, please login again' },
        ]);
    }
    // 6. Generic Unhandled Exceptions (500 Internal Server Error)
    console.error('Unhandled Server Exception:', err);
    return (0, response_1.sendError)(res, 500, 'Internal server error occurred', [
        { message: err.message || 'Something went wrong on the server' },
    ]);
};
exports.errorMiddleware = errorMiddleware;
exports.default = exports.errorMiddleware;
