"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_validator_1 = require("../validators/auth.validator");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Public Auth Endpoints
router.post('/register', (0, validateMiddleware_1.validate)(auth_validator_1.registerValidator), auth_controller_1.AuthController.register);
router.post('/login', (0, validateMiddleware_1.validate)(auth_validator_1.loginValidator), auth_controller_1.AuthController.login);
router.post('/logout', auth_controller_1.AuthController.logout);
// Protected Identity Endpoint
router.get('/me', authMiddleware_1.authMiddleware, auth_controller_1.AuthController.me);
exports.default = router;
