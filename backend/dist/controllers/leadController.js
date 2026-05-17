"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLead = exports.updateLead = exports.createLead = exports.getLeads = exports.updateLeadSchema = exports.createLeadSchema = void 0;
const zod_1 = require("zod");
const db_1 = require("../config/db");
// Validation Schemas
exports.createLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Name must be at least 2 characters'),
    email: zod_1.z.string().email('Please enter a valid email address'),
    status: zod_1.z.enum(['New', 'Qualified', 'Contacted', 'Lost']),
    source: zod_1.z.enum(['Email Campaign', 'Cold Call', 'LinkedIn', 'Referral', 'Website'])
});
exports.updateLeadSchema = exports.createLeadSchema.partial();
const getLeads = async (req, res) => {
    try {
        const db = (0, db_1.loadDB)();
        const allLeads = db.leads;
        // 1. Calculate dashboard metrics
        const stats = {
            totalLeads: allLeads.length,
            qualified: allLeads.filter(l => l.status === 'Qualified').length,
            contacted: allLeads.filter(l => l.status === 'Contacted').length,
            lost: allLeads.filter(l => l.status === 'Lost').length
        };
        let filteredLeads = [...allLeads];
        const { q, status, source, sort, page = '1', limit = '6' } = req.query;
        // 2. Search filter (name, email)
        if (q) {
            const query = q.toLowerCase();
            filteredLeads = filteredLeads.filter(l => l.name.toLowerCase().includes(query) || l.email.toLowerCase().includes(query));
        }
        // 3. Status filter
        if (status && status !== 'All Statuses') {
            filteredLeads = filteredLeads.filter(l => l.status === status);
        }
        // 4. Source filter
        if (source && source !== 'All Sources') {
            filteredLeads = filteredLeads.filter(l => l.source === source);
        }
        // 5. Sorting
        if (sort === 'Newest') {
            filteredLeads.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
        else if (sort === 'Oldest') {
            filteredLeads.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        }
        // 6. Pagination
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 6;
        const totalCount = filteredLeads.length;
        const totalPages = Math.ceil(totalCount / limitNum);
        const offset = (pageNum - 1) * limitNum;
        const paginatedLeads = filteredLeads.slice(offset, offset + limitNum);
        return res.status(200).json({
            leads: paginatedLeads,
            stats,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalCount,
                totalPages
            }
        });
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Server error retrieving leads' });
    }
};
exports.getLeads = getLeads;
const createLead = async (req, res) => {
    const { name, email, status, source } = req.body;
    const creatorId = req.user?.id || 'unknown';
    try {
        const db = (0, db_1.loadDB)();
        const newLead = {
            id: `lead-${Date.now()}`,
            name,
            email,
            status: status,
            source: source,
            createdAt: new Date().toISOString(),
            createdBy: creatorId
        };
        db.leads.unshift(newLead); // Prepend to lists
        (0, db_1.saveDB)(db);
        return res.status(201).json(newLead);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error creating lead record' });
    }
};
exports.createLead = createLead;
const updateLead = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const db = (0, db_1.loadDB)();
        const leadIndex = db.leads.findIndex(l => l.id === id);
        if (leadIndex === -1) {
            return res.status(404).json({ message: 'Lead record not found' });
        }
        const updatedLead = {
            ...db.leads[leadIndex],
            ...updates
        };
        db.leads[leadIndex] = updatedLead;
        (0, db_1.saveDB)(db);
        return res.status(200).json(updatedLead);
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error modifying lead record' });
    }
};
exports.updateLead = updateLead;
const deleteLead = async (req, res) => {
    const { id } = req.params;
    try {
        const db = (0, db_1.loadDB)();
        const leadExists = db.leads.some(l => l.id === id);
        if (!leadExists) {
            return res.status(404).json({ message: 'Lead record not found' });
        }
        db.leads = db.leads.filter(l => l.id !== id);
        (0, db_1.saveDB)(db);
        return res.status(200).json({ success: true, message: 'Lead deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: 'Server error deleting lead record' });
    }
};
exports.deleteLead = deleteLead;
