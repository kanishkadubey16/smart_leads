"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendError = exports.sendSuccess = void 0;
const sendSuccess = (res, statusCode, message, data) => {
    const payload = {
        success: true,
        message,
        data,
    };
    return res.status(statusCode).json(payload);
};
exports.sendSuccess = sendSuccess;
const sendError = (res, statusCode, message, errors = []) => {
    const payload = {
        success: false,
        message,
        errors,
    };
    return res.status(statusCode).json(payload);
};
exports.sendError = sendError;
