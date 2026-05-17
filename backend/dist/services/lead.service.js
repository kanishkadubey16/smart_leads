"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadService = void 0;
const mongoose_1 = require("mongoose");
const Lead_1 = require("../models/Lead");
const customError_1 = require("../utils/customError");
class LeadService {
    /**
     * Fetches matching leads with pagination, filters, sorting, and dynamic statistics tallies
     */
    static async getLeadsList(params) {
        const page = parseInt(params.page || '1', 10) || 1;
        const limit = parseInt(params.limit || '10', 10) || 10;
        const skip = (page - 1) * limit;
        // 1. Build dynamic MongoDB query filters
        const filterQuery = {};
        if (params.status && params.status !== 'All Statuses') {
            filterQuery.status = params.status;
        }
        if (params.source && params.source !== 'All Sources') {
            filterQuery.source = params.source;
        }
        if (params.search) {
            const searchRegex = new RegExp(params.search, 'i');
            filterQuery.$or = [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
            ];
        }
        // 2. Build sorting criteria
        let sortQuery = { createdAt: -1 }; // Default: Latest
        if (params.sort === 'oldest') {
            sortQuery = { createdAt: 1 };
        }
        // 3. Query leads list with pagination in parallel with total count
        const [leads, totalLeads] = await Promise.all([
            Lead_1.Lead.find(filterQuery)
                .sort(sortQuery)
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'name email role avatarUrl'),
            Lead_1.Lead.countDocuments(filterQuery),
        ]);
        // 4. Calculate pipeline tallies based on database matching records
        const [totalQualified, totalContacted, totalLost] = await Promise.all([
            Lead_1.Lead.countDocuments({ status: 'Qualified' }),
            Lead_1.Lead.countDocuments({ status: 'Contacted' }),
            Lead_1.Lead.countDocuments({ status: 'Lost' }),
        ]);
        const stats = {
            totalLeads: await Lead_1.Lead.countDocuments({}),
            qualified: totalQualified,
            contacted: totalContacted,
            lost: totalLost,
        };
        const totalPages = Math.ceil(totalLeads / limit);
        return {
            leads,
            stats,
            pagination: {
                currentPage: page,
                totalPages,
                totalLeads,
                limit,
            },
        };
    }
    /**
     * Fetches a single lead record by ID
     */
    static async getLeadById(id) {
        const lead = await Lead_1.Lead.findById(id).populate('createdBy', 'name email role avatarUrl');
        if (!lead) {
            throw new customError_1.NotFoundError('Lead record not found');
        }
        return lead;
    }
    /**
     * Inserts a brand new lead record
     */
    static async createLeadRecord(input, creatorId) {
        const newLead = await Lead_1.Lead.create({
            ...input,
            createdBy: new mongoose_1.Types.ObjectId(creatorId),
        });
        return Lead_1.Lead.findById(newLead.id).populate('createdBy', 'name email role avatarUrl');
    }
    /**
     * Updates an existing lead record
     */
    static async updateLeadRecord(id, updates) {
        const lead = await Lead_1.Lead.findById(id);
        if (!lead) {
            throw new customError_1.NotFoundError('Lead record not found');
        }
        const updatedLead = await Lead_1.Lead.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        }).populate('createdBy', 'name email role avatarUrl');
        return updatedLead;
    }
    /**
     * Deletes a lead record by ID (Admin-only restriction evaluated at middleware level)
     */
    static async deleteLeadRecord(id) {
        const lead = await Lead_1.Lead.findById(id);
        if (!lead) {
            throw new customError_1.NotFoundError('Lead record not found');
        }
        await Lead_1.Lead.findByIdAndDelete(id);
        return { success: true, message: 'Lead deleted successfully' };
    }
    /**
     * Builds and compiles a CSV file matching currently active search/filtering combinations
     */
    static async exportLeadsToCSV(params) {
        // Re-use dynamic filter queries without pagination
        const filterQuery = {};
        if (params.status && params.status !== 'All Statuses') {
            filterQuery.status = params.status;
        }
        if (params.source && params.source !== 'All Sources') {
            filterQuery.source = params.source;
        }
        if (params.search) {
            const searchRegex = new RegExp(params.search, 'i');
            filterQuery.$or = [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
            ];
        }
        let sortQuery = { createdAt: -1 };
        if (params.sort === 'oldest') {
            sortQuery = { createdAt: 1 };
        }
        const leads = await Lead_1.Lead.find(filterQuery)
            .sort(sortQuery)
            .populate('createdBy', 'name email');
        // Build standard CSV file format output
        const headers = ['Lead ID', 'Name', 'Email', 'Status', 'Source', 'Created At', 'Creator Name', 'Creator Email'];
        const rows = leads.map((lead) => [
            lead._id.toString(),
            lead.name,
            lead.email,
            lead.status,
            lead.source,
            lead.createdAt.toISOString(),
            lead.createdBy?.name || 'N/A',
            lead.createdBy?.email || 'N/A',
        ]);
        // CSV format escape sequences
        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row
                .map((val) => `"${val.replace(/"/g, '""')}"`)
                .join(',')),
        ].join('\n');
        return csvContent;
    }
}
exports.LeadService = LeadService;
