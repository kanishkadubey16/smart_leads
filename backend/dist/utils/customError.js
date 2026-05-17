"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.BadRequestError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
class BadRequestError extends CustomError {
    message;
    statusCode = 400;
    constructor(message) {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, BadRequestError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.BadRequestError = BadRequestError;
class ValidationError extends CustomError {
    message;
    errorsList;
    statusCode = 400;
    constructor(message = 'Validation failed', errorsList) {
        super(message);
        this.message = message;
        this.errorsList = errorsList;
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
    serializeErrors() {
        return this.errorsList;
    }
}
exports.ValidationError = ValidationError;
class UnauthorizedError extends CustomError {
    message;
    statusCode = 401;
    constructor(message = 'Not authorized to access this resource') {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends CustomError {
    message;
    statusCode = 403;
    constructor(message = 'Access denied for this resource') {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, ForbiddenError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.ForbiddenError = ForbiddenError;
class NotFoundError extends CustomError {
    message;
    statusCode = 404;
    constructor(message = 'Resource not found') {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.NotFoundError = NotFoundError;
class InternalServerError extends CustomError {
    message;
    statusCode = 500;
    constructor(message = 'Something went wrong') {
        super(message);
        this.message = message;
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
    serializeErrors() {
        return [{ message: this.message }];
    }
}
exports.InternalServerError = InternalServerError;
