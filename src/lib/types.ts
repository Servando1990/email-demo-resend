export interface Contact {
  id: string;
  name: string;
  email: string;
  industry: string[];
  lastContactDate: Date;
  status: 'active' | 'stale' | 'recent';
}

export interface Deal {
  id: string;
  companyName: string;
  industry: string;
  stage: string;
  description: string;
  createdAt: Date;
}

export interface EmailLog {
  id: string;
  contactId: string;
  dealId?: string;
  subject: string;
  status: 'sent' | 'delivered' | 'failed';
  sentAt: Date;
  type: 'deal_announcement' | 'follow_up' | 'meeting_reschedule';
}

export interface DashboardMetrics {
  emailsSentToday: number;
  totalContacts: number;
  activeDeals: number;
  responseRate: number;
}

export const INDUSTRIES = [
  'CleanTech',
  'AI',
  'CPG',
  'Real Estate',
  'FinTech',
  'HealthTech',
  'EdTech',
  'SaaS'
] as const;

export const DEAL_STAGES = [
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Growth',
  'Late Stage'
] as const;

export type Industry = typeof INDUSTRIES[number];
export type DealStage = typeof DEAL_STAGES[number];