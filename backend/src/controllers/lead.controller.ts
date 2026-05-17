import type { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { Parser } from 'json2csv';
import * as leadService from '../services/lead.service';
import { sendSuccessResponse } from '../utils/response';
import type { AuthRequest } from '../middlewares/auth.middleware';

export const getLeads = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 10;
  const status = req.query.status as string;
  const source = req.query.source as string;
  const search = (req.query.q || req.query.search) as string;
  const sort = req.query.sort as string;

  const result = await leadService.getAllLeads({
    page,
    limit,
    status,
    source,
    search,
    sort,
  });

  sendSuccessResponse({
    res,
    statusCode: 200,
    message: 'Leads fetched successfully',
    data: result,
  });
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await leadService.getLeadById(req.params.id);

  sendSuccessResponse({
    res,
    statusCode: 200,
    message: 'Lead fetched successfully',
    data: lead,
  });
});

export const createLead = asyncHandler(async (req: AuthRequest, res: Response) => {
  const leadData = {
    ...req.body,
    createdBy: req.user?._id,
  };

  const newLead = await leadService.createLead(leadData);

  sendSuccessResponse({
    res,
    statusCode: 201,
    message: 'Lead created successfully',
    data: newLead,
  });
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const updatedLead = await leadService.updateLead(req.params.id, req.body);

  sendSuccessResponse({
    res,
    statusCode: 200,
    message: 'Lead updated successfully',
    data: updatedLead,
  });
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  await leadService.deleteLead(req.params.id);

  sendSuccessResponse({
    res,
    statusCode: 200,
    message: 'Lead deleted successfully',
    data: null,
  });
});

export const exportLeadsCsv = asyncHandler(async (req: Request, res: Response) => {
  // Get all leads for export (no pagination limit)
  const result = await leadService.getAllLeads({
    page: 1,
    limit: 1000000,
  });

  const fields = ['name', 'email', 'status', 'source', 'createdAt', 'createdBy.name'];
  const json2csvParser = new Parser({ fields });
  const csv = json2csvParser.parse(result.leads);

  res.header('Content-Type', 'text/csv');
  res.attachment('leads.csv');
  res.send(csv);
});
