"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
// Public auth routes
router.post('/login', (0, validate_1.validateBody)(authController_1.loginSchema), authController_1.login);
router.post('/register', (0, validate_1.validateBody)(authController_1.registerSchema), authController_1.register);
// Protected token identity route
router.get('/me', auth_1.authenticateToken, authController_1.getMe);
exports.default = router;
