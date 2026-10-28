export type AcquisitionChannel =
  | 'College clubs and coding communities'
  | 'WhatsApp student groups'
  | 'Student ambassadors and referrals'
  | 'College placement and technical communities'
  | 'Email outreach'
  | 'Small targeted paid promotions';

export interface Registration {
  id: string;
  name: string;
  email: string;
  college: string;
  gradYear: string;
  whatsapp?: string;
  referralCode: string;
  referredBy?: string; // referralCode of referrer
  channel: AcquisitionChannel;
  createdAt: string; // ISO date
  dayOfCampaign: number; // 1 to 7
}

export interface ChannelStat {
  name: AcquisitionChannel;
  shortName: string;
  registrations: number;
  budgetAllocated: number; // in INR
  budgetSpent: number; // in INR
  color: string;
}

export interface DailyActivity {
  id: string;
  day: number;
  dateStr: string;
  title: string;
  channel: AcquisitionChannel;
  description: string;
  registrationsGained: number;
  spendToday: number;
  status: 'Completed' | 'In Progress' | 'Upcoming';
}

export interface FunnelStage {
  stage: string;
  count: number;
  percentage: number;
  dropOffRate?: number;
}
