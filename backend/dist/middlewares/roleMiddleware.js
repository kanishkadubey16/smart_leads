"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = void 0;
const customError_1 = require("../utils/customError");
const restrictTo = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new customError_1.ForbiddenError('User identity context missing'));
        }
        if (!allowedRoles.includes(req.user.role)) {
            return next(new customError_1.ForbiddenError('You do not have permission to perform this action'));
        }
        next();
    };
};
exports.restrictTo = restrictTo;
exports.default = exports.restrictTo;
