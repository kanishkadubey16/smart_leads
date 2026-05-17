"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const customError_1 = require("../utils/customError");
const notFoundMiddleware = (req, res, next) => {
    next(new customError_1.NotFoundError(`Route not found - ${req.originalUrl}`));
};
exports.notFoundMiddleware = notFoundMiddleware;
exports.default = exports.notFoundMiddleware;
