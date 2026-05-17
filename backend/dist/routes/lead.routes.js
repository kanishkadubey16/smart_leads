"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lead_controller_1 = require("../controllers/lead.controller");
const lead_validator_1 = require("../validators/lead.validator");
const validateMiddleware_1 = require("../middlewares/validateMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Apply auth protection to all routes in this router
router.use(authMiddleware_1.authMiddleware);
// Leads CRUD Endpoints
router.get('/', lead_controller_1.LeadController.getAllLeads);
router.get('/export/csv', lead_controller_1.LeadController.exportLeads);
router.get('/:id', lead_controller_1.LeadController.getLeadById);
router.post('/', (0, validateMiddleware_1.validate)(lead_validator_1.createLeadValidator), lead_controller_1.LeadController.createLead);
router.put('/:id', (0, validateMiddleware_1.validate)(lead_validator_1.updateLeadValidator), lead_controller_1.LeadController.updateLead);
// DELETE lead is strictly restricted to ADMIN role (sales users blocked!)
router.delete('/:id', (0, roleMiddleware_1.restrictTo)('admin'), lead_controller_1.LeadController.deleteLead);
exports.default = router;
