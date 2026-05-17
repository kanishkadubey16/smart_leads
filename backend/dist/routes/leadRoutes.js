"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leadController_1 = require("../controllers/leadController");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const router = (0, express_1.Router)();
// Secure all endpoints below with JWT
router.use(auth_1.authenticateToken);
// CRUD routes
router.get('/', leadController_1.getLeads);
router.post('/', (0, validate_1.validateBody)(leadController_1.createLeadSchema), leadController_1.createLead);
router.put('/:id', (0, validate_1.validateBody)(leadController_1.updateLeadSchema), leadController_1.updateLead);
router.delete('/:id', leadController_1.deleteLead);
exports.default = router;
