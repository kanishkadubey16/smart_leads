"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const customError_1 = require("../utils/customError");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const errorsList = error.errors.map((err) => ({
                    message: err.message,
                    field: err.path.join('.'),
                }));
                return next(new customError_1.ValidationError('Validation failed', errorsList));
            }
            next(error);
        }
    };
};
exports.validate = validate;
exports.default = exports.validate;
