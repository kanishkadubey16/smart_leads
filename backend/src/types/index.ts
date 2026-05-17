// ─── Enums ──────────────────────────────────────────────────────────────────

export enum Role {
  ADMIN = 'ADMIN',
  SALES = 'SALES_USER',
}

export enum LeadStatus {
  NEW = 'New',
  CONTACTED = 'Contacted',
  QUALIFIED = 'Qualified',
  LOST = 'Lost',
}

export enum LeadSource {
  WEBSITE = 'Website',
  EMAIL_CAMPAIGN = 'Email Campaign',
  COLD_CALL = 'Cold Call',
  LINKEDIN = 'LinkedIn',
  REFERRAL = 'Referral',
}

export enum SortOrder {
  LATEST = 'latest',
  OLDEST = 'oldest',
}
