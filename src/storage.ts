import type { Registration, FunnelStage, AcquisitionChannel } from './types';
import { generateBaselineRegistrations, CHANNEL_CONFIG } from './mockData';

// Separate storage keys for Interactive Mode vs Full Simulation Mode
const STORAGE_KEYS = {
  DATA_MODE: 'nxtwave_growth_data_mode_v2', // 'demo' | 'simulated'
  DEMO_REGISTRATIONS: 'nxtwave_growth_demo_regs_v2',
  DEMO_VISITS: 'nxtwave_growth_demo_visits_v2',
  DEMO_FORM_STARTS: 'nxtwave_growth_demo_starts_v2',
  SIM_REGISTRATIONS: 'nxtwave_growth_sim_regs_v2',
  SIM_VISITS: 'nxtwave_growth_sim_visits_v2',
  SIM_FORM_STARTS: 'nxtwave_growth_sim_starts_v2',
  LAST_USER_REGISTRATION: 'nxtwave_growth_last_user_reg_v2',
};

export class StorageService {
  static getDataMode(): 'demo' | 'simulated' {
    return (localStorage.getItem(STORAGE_KEYS.DATA_MODE) as 'demo' | 'simulated') || 'demo';
  }

  static setDataMode(mode: 'demo' | 'simulated'): void {
    localStorage.setItem(STORAGE_KEYS.DATA_MODE, mode);
  }

  // Get registrations for current active mode
  static getRegistrations(): Registration[] {
    const mode = this.getDataMode();
    const key = mode === 'simulated' ? STORAGE_KEYS.SIM_REGISTRATIONS : STORAGE_KEYS.DEMO_REGISTRATIONS;
    try {
      const data = localStorage.getItem(key);
      if (!data) {
        if (mode === 'simulated') {
          const initial = generateBaselineRegistrations();
          localStorage.setItem(key, JSON.stringify(initial));
          return initial;
        } else {
          localStorage.setItem(key, JSON.stringify([]));
          return [];
        }
      }
      return JSON.parse(data);
    } catch {
      return mode === 'simulated' ? generateBaselineRegistrations() : [];
    }
  }

  static addRegistration(newReg: {
    name: string;
    email: string;
    college: string;
    gradYear: string;
    whatsapp?: string;
    referralCode: string;
    referredBy?: string;
    channel: AcquisitionChannel;
  }): { success: boolean; message: string; registration?: Registration } {
    const registrations = this.getRegistrations();
    const cleanEmail = newReg.email.trim().toLowerCase();

    // 1. Prevent duplicate email registrations
    const existing = registrations.find(r => r.email.trim().toLowerCase() === cleanEmail);
    if (existing) {
      return {
        success: false,
        message: 'This email is already registered! You can view your existing referral link and details below.',
        registration: existing,
      };
    }

    // 2. Prevent self-referral
    let validReferredBy: string | undefined = undefined;
    if (newReg.referredBy && newReg.referredBy.trim()) {
      const candidateCode = newReg.referredBy.trim().toUpperCase();
      if (candidateCode !== newReg.referralCode.trim().toUpperCase()) {
        validReferredBy = candidateCode;
      }
    }

    const id = `reg-${Date.now().toString().slice(-6)}`;
    const reg: Registration = {
      ...newReg,
      id,
      email: cleanEmail,
      referredBy: validReferredBy,
      createdAt: new Date().toISOString(),
      dayOfCampaign: 5, // active simulated campaign day
    };

    registrations.unshift(reg);

    const mode = this.getDataMode();
    const key = mode === 'simulated' ? STORAGE_KEYS.SIM_REGISTRATIONS : STORAGE_KEYS.DEMO_REGISTRATIONS;
    localStorage.setItem(key, JSON.stringify(registrations));
    localStorage.setItem(STORAGE_KEYS.LAST_USER_REGISTRATION, JSON.stringify(reg));

    // Also update form start and visit to guarantee valid funnel progression
    this.recordFormStart();

    return {
      success: true,
      message: 'Spot successfully reserved! Welcome aboard.',
      registration: reg,
    };
  }

  static getLastUserRegistration(): Registration | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LAST_USER_REGISTRATION);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static getReferralCount(referralCode: string): number {
    if (!referralCode) return 0;
    const registrations = this.getRegistrations();
    return registrations.filter(
      r => r.referredBy && r.referredBy.toUpperCase() === referralCode.toUpperCase()
    ).length;
  }

  static getLeaderboard(limit = 8): { referralCode: string; name: string; college: string; count: number }[] {
    const registrations = this.getRegistrations();
    const refCounts: Record<string, number> = {};

    registrations.forEach(r => {
      if (r.referredBy) {
        const code = r.referredBy.toUpperCase();
        refCounts[code] = (refCounts[code] || 0) + 1;
      }
    });

    const entries = Object.keys(refCounts).map(code => {
      const student = registrations.find(r => r.referralCode?.toUpperCase() === code);
      return {
        referralCode: code,
        name: student ? student.name : `Ambassador ${code}`,
        college: student ? student.college : 'Engineering Institute',
        count: refCounts[code],
      };
    });

    return entries.sort((a, b) => b.count - a.count).slice(0, limit);
  }

  // Funnel analytics with guaranteed consistency (Visits >= Form Starts >= Registrations)
  static recordVisit(): void {
    const mode = this.getDataMode();
    const key = mode === 'simulated' ? STORAGE_KEYS.SIM_VISITS : STORAGE_KEYS.DEMO_VISITS;
    const defaultVisits = mode === 'simulated' ? 1420 : 0;
    const current = Number(localStorage.getItem(key) || defaultVisits);
    localStorage.setItem(key, String(current + 1));
  }

  static recordFormStart(): void {
    const mode = this.getDataMode();
    const key = mode === 'simulated' ? STORAGE_KEYS.SIM_FORM_STARTS : STORAGE_KEYS.DEMO_FORM_STARTS;
    const defaultStarts = mode === 'simulated' ? 710 : 0;
    const current = Number(localStorage.getItem(key) || defaultStarts);
    localStorage.setItem(key, String(current + 1));
  }

  static getFunnelMetrics(): FunnelStage[] {
    const registrations = this.getRegistrations();
    const totalReg = registrations.length;
    const mode = this.getDataMode();

    const visitKey = mode === 'simulated' ? STORAGE_KEYS.SIM_VISITS : STORAGE_KEYS.DEMO_VISITS;
    const startKey = mode === 'simulated' ? STORAGE_KEYS.SIM_FORM_STARTS : STORAGE_KEYS.DEMO_FORM_STARTS;

    const baseVisits = mode === 'simulated' ? 1420 : Math.max(totalReg, 1);
    const baseStarts = mode === 'simulated' ? 710 : totalReg;

    let visits = Number(localStorage.getItem(visitKey) || baseVisits);
    let formStarts = Number(localStorage.getItem(startKey) || baseStarts);

    // Guaranteed logical bounds: visits >= formStarts >= totalReg
    if (formStarts < totalReg) formStarts = totalReg;
    if (visits < formStarts) visits = formStarts;

    const formEngagePct = visits > 0 ? Math.min(100, Math.round((formStarts / visits) * 100)) : 0;
    const regPct = visits > 0 ? Math.min(100, Math.round((totalReg / visits) * 100 * 10) / 10) : 0;
    const dropOff1 = visits > 0 ? Math.max(0, Math.round(((visits - formStarts) / visits) * 100)) : 0;
    const dropOff2 = formStarts > 0 ? Math.max(0, Math.round(((formStarts - totalReg) / formStarts) * 100)) : 0;

    return [
      {
        stage: 'Landing Page Visitors',
        count: visits,
        percentage: 100,
      },
      {
        stage: 'Form Started / Engaged',
        count: formStarts,
        percentage: formEngagePct,
        dropOffRate: dropOff1,
      },
      {
        stage: 'Confirmed Registrations',
        count: totalReg,
        percentage: regPct,
        dropOffRate: dropOff2,
      },
    ];
  }

  // Dynamic channel stats derived strictly from the underlying registrations
  static getChannelStats() {
    const registrations = this.getRegistrations();
    const mode = this.getDataMode();

    return (Object.keys(CHANNEL_CONFIG) as AcquisitionChannel[]).map(chName => {
      const cfg = CHANNEL_CONFIG[chName];
      const count = registrations.filter(r => r.channel === chName).length;

      // In demo mode, calculate proportional micro-spend based on actual registrations
      // In simulated mode, use the verified planned spend
      let spent = cfg.budgetSpent;
      if (mode === 'demo') {
        // Safe proportional spend: if 0 registrations, ₹0 spent for organic, min ₹10 for paid if chosen
        spent = count > 0 ? Math.min(cfg.budgetAllocated, count * (chName.includes('paid') ? 15 : 2)) : 0;
      }

      return {
        name: chName,
        shortName: cfg.shortName,
        registrations: count,
        budgetAllocated: cfg.budgetAllocated,
        budgetSpent: spent,
        color: cfg.color,
      };
    });
  }

  // Clear demo registrations
  static clearDemo(): void {
    localStorage.removeItem(STORAGE_KEYS.DEMO_REGISTRATIONS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_VISITS);
    localStorage.removeItem(STORAGE_KEYS.DEMO_FORM_STARTS);
    localStorage.removeItem(STORAGE_KEYS.LAST_USER_REGISTRATION);
  }

  // Reset simulated baseline
  static resetSimulated(): void {
    const initial = generateBaselineRegistrations();
    localStorage.setItem(STORAGE_KEYS.SIM_REGISTRATIONS, JSON.stringify(initial));
    localStorage.setItem(STORAGE_KEYS.SIM_VISITS, '1420');
    localStorage.setItem(STORAGE_KEYS.SIM_FORM_STARTS, '710');
  }
}
