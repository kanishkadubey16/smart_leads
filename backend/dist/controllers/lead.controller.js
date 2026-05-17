"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadController = void 0;
const lead_service_1 = require("../services/lead.service");
const lead_validator_1 = require("../validators/lead.validator");
const response_1 = require("../utils/response");
const customError_1 = require("../utils/customError");
class LeadController {
    /**
     * GET /api/leads
     * Retrieves paginated, sorted, and filtered leads matching pipeline tallies
     */
    static getAllLeads = async (req, res, next) => {
        try {
            const { page, limit, status, source, search, sort } = req.query;
            const result = await lead_service_1.LeadService.getLeadsList({
                page: page,
                limit: limit,
                status: status,
                source: source,
                search: search,
                sort: sort,
            });
            return (0, response_1.sendSuccess)(res, 200, 'Leads list retrieved successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /api/leads/export/csv
     * Compiles leads into raw CSV spreadsheets and attaches the download headers
     */
    static exportLeads = async (req, res, next) => {
        try {
            const { status, source, search, sort } = req.query;
            const csvContent = await lead_service_1.LeadService.exportLeadsToCSV({
                status: status,
                source: source,
                search: search,
                sort: sort,
            });
            // Attach file download HTTP headers
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename=smart_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
            return res.status(200).send(csvContent);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * GET /api/leads/:id
     * Retrieves details of a single lead by ID
     */
    static getLeadById = async (req, res, next) => {
        try {
            const { id } = req.params;
            const lead = await lead_service_1.LeadService.getLeadById(id);
            return (0, response_1.sendSuccess)(res, 200, 'Lead details retrieved successfully', lead);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * POST /api/leads
     * Creates a new lead record linked to the authenticated creator
     */
    static createLead = async (req, res, next) => {
        try {
            if (!req.user) {
                throw new customError_1.BadRequestError('User authentication context required');
            }
            const validatedInput = lead_validator_1.createLeadValidator.parse(req.body);
            const newLead = await lead_service_1.LeadService.createLeadRecord(validatedInput, req.user.id);
            return (0, response_1.sendSuccess)(res, 201, 'Lead record created successfully', newLead);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * PUT /api/leads/:id
     * Updates fields on a lead record
     */
    static updateLead = async (req, res, next) => {
        try {
            const { id } = req.params;
            const validatedInput = lead_validator_1.updateLeadValidator.parse(req.body);
            const updatedLead = await lead_service_1.LeadService.updateLeadRecord(id, validatedInput);
            return (0, response_1.sendSuccess)(res, 200, 'Lead record updated successfully', updatedLead);
        }
        catch (error) {
            next(error);
        }
    };
    /**
     * DELETE /api/leads/:id
     * Deletes a lead record (Access restricted to admin role at router level)
     */
    static deleteLead = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await lead_service_1.LeadService.deleteLeadRecord(id);
            return (0, response_1.sendSuccess)(res, 200, 'Lead record deleted successfully', result);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.LeadController = LeadController;
exports.default = LeadController;
