import { Lead } from '../models/lead.model';
import { AppError } from '../utils/AppError';
import type { ILead } from '../interfaces/lead.interface';

import { LeadStatus } from '../types';

interface GetLeadsParams {
  page: number;
  limit: number;
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
}

export const getAllLeads = async ({ page, limit, status, source, search, sort }: GetLeadsParams) => {
  const query: any = {};

  const validStatuses = Object.values(LeadStatus) as string[];
  if (status && validStatuses.includes(status)) {
    query.status = status;
  }

  if (source && source !== 'All Sources') {
    query.source = source;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  let sortQuery: any = { createdAt: -1 }; // Default latest
  if (sort === 'Oldest' || sort === 'oldest') {
    sortQuery = { createdAt: 1 };
  }

  const skip = (page - 1) * limit;

  const [leads, totalCount, totalGlobalLeads, qualified, contacted, lost] = await Promise.all([
    Lead.find(query).sort(sortQuery).skip(skip).limit(limit).populate('createdBy', 'name email'),
    Lead.countDocuments(query),
    Lead.countDocuments(),
    Lead.countDocuments({ status: LeadStatus.QUALIFIED }),
    Lead.countDocuments({ status: LeadStatus.CONTACTED }),
    Lead.countDocuments({ status: LeadStatus.LOST }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return {
    leads,
    stats: {
      totalLeads: totalGlobalLeads,
      qualified,
      contacted,
      lost,
    },
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
    },
  };
};

export const getLeadById = async (id: string) => {
  const lead = await Lead.findById(id).populate('createdBy', 'name email');
  if (!lead) {
    throw new AppError('Lead not found', 404);
  }
  return lead;
};

export const createLead = async (leadData: Partial<ILead>) => {
  const lead = await Lead.create(leadData);
  return lead;
};

export const updateLead = async (id: string, updateData: Partial<ILead>) => {
  const lead = await Lead.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
};

export const deleteLead = async (id: string) => {
  const lead = await Lead.findByIdAndDelete(id);

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  return lead;
};
