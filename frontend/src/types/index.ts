export type Role = 'ADMIN' | 'SALES_USER';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl: string;
}

export type LeadStatus = 'New' | 'Qualified' | 'Contacted' | 'Lost';

export type LeadSource = 'Email Campaign' | 'Cold Call' | 'LinkedIn' | 'Referral' | 'Website';

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: string; // ISO or human-readable date
}

export interface DashboardStats {
  totalLeads: number;
  qualified: number;
  contacted: number;
  lost: number;
}
