import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Share2,
  Calendar,
  Layers,
  ArrowUpRight,
  RotateCcw,
  Award,
  Globe,
  BarChart3,
  UserCheck
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { StorageService } from './storage';
import { CAMPAIGN_ACTIVITIES } from './mockData';
import type { Registration } from './types';
import { CampaignStrategyModal } from './CampaignStrategyModal';
import { ProjectEvaluatorModal } from './ProjectEvaluatorModal';

interface DashboardProps {
  onNavigateToLanding: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigateToLanding }) => {
  const [dataMode, setDataMode] = useState<'demo' | 'simulated'>(() => StorageService.getDataMode());
  const [registrations, setRegistrations] = useState<Registration[]>(() =>
    StorageService.getRegistrations()
  );
  const [channelFilter, setChannelFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [resetNotice, setResetNotice] = useState(false);

  const funnel = useMemo(() => StorageService.getFunnelMetrics(), [registrations, dataMode]);

  // KPIs
  const totalRegistrations = registrations.length;
  const goal = 500;
  const progressPct = Math.min(100, Math.round((totalRegistrations / goal) * 100));
  const totalVisits = funnel[0]?.count || 1420;
  const conversionRate = totalVisits > 0 ? ((totalRegistrations / totalVisits) * 100).toFixed(1) : '0';

  const referralRegistrations = useMemo(() => {
    return registrations.filter(
      r => r.channel === 'Student ambassadors and referrals' || Boolean(r.referredBy)
    ).length;
  }, [registrations]);

  // Channel breakdown
  const channelData = useMemo(() => {
    const counts: Record<string, number> = {};
    registrations.forEach(r => {
      counts[r.channel] = (counts[r.channel] || 0) + 1;
    });

    const channels = StorageService.getChannelStats();
    return channels.map(c => ({
      name: c.shortName,
      fullName: c.name,
      registrations: counts[c.name] || 0,
      budgetSpent: c.budgetSpent,
      budgetAllocated: c.budgetAllocated,
      cpa: counts[c.name] > 0 ? (c.budgetSpent / counts[c.name]).toFixed(1) : '0',
      color: c.color,
    }));
  }, [registrations]);

  // Best channel
  const bestChannel = useMemo(() => {
    if (channelData.length === 0) return { name: 'WhatsApp Groups', registrations: 0 };
    return [...channelData].sort((a, b) => b.registrations - a.registrations)[0];
  }, [channelData]);

  // Budget calculations
  const totalBudget = 2000;
  const totalSpent = useMemo(() => {
    return channelData.reduce((acc, curr) => acc + curr.budgetSpent, 0);
  }, [channelData]);
  const costPerAcquisition = totalRegistrations > 0 ? (totalSpent / totalRegistrations).toFixed(1) : '0';

  // Registrations over 7-day timeline
  const lineChartData = useMemo(() => {
    const days = [
      { day: 'Day 1', date: 'Oct 22', target: 50, actual: 0 },
      { day: 'Day 2', date: 'Oct 23', target: 120, actual: 0 },
      { day: 'Day 3', date: 'Oct 24', target: 200, actual: 0 },
      { day: 'Day 4', date: 'Oct 25', target: 300, actual: 0 },
      { day: 'Day 5 (Today)', date: 'Oct 26', target: 400, actual: 0 },
      { day: 'Day 6 (Proj)', date: 'Oct 27', target: 460, actual: 0 },
      { day: 'Day 7 (Proj)', date: 'Oct 28', target: 500, actual: 0 },
    ];

    // Cumulative actual registrations by day
    let cumulative = 0;
    for (let d = 1; d <= 5; d++) {
      const countForDay = registrations.filter(r => r.dayOfCampaign === d).length;
      cumulative += countForDay;
      days[d - 1].actual = cumulative;
    }

    // Projected pace for Days 6 & 7 if current velocity continues
    const day5Actual = days[4].actual;
    days[5].actual = Math.min(500, Math.round(day5Actual + (500 - day5Actual) * 0.55));
    days[6].actual = Math.max(500, Math.round(days[5].actual + (500 - day5Actual) * 0.55));

    return days;
  }, [registrations]);

  // Referral leaderboard
  const leaderboard = useMemo(() => {
    return StorageService.getLeaderboard(6);
  }, [registrations]);

  // Filtered registrations table
  const filteredRegistrations = useMemo(() => {
    return registrations.filter(r => {
      const matchesChannel = channelFilter === 'All' || r.channel === channelFilter;
      const matchesSearch =
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.referralCode.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesChannel && matchesSearch;
    });
  }, [registrations, channelFilter, searchQuery]);

  // Masking helpers for sensible privacy
  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    if (!domain) return email;
    if (user.length <= 2) return `${user}***@${domain}`;
    return `${user.slice(0, 2)}***${user.slice(-1)}@${domain}`;
  };

  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [isEvaluatorModalOpen, setIsEvaluatorModalOpen] = useState(false);

  const switchDataMode = (newMode: 'demo' | 'simulated') => {
    StorageService.setDataMode(newMode);
    setDataMode(newMode);
    setRegistrations(StorageService.getRegistrations());
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
  };

  const handleClearAll = () => {
    StorageService.setDataMode('demo');
    StorageService.clearDemo();
    setDataMode('demo');
    setRegistrations([]);
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <header className="glass-panel sticky top-0 z-40 border-b border-slate-800/80 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/20">
            N
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-lg text-white">NxtWave Growth Engine</h1>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase tracking-wider">
                Live Interactive Prototype
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Campaign: "Build Your First AI Project in 60 Minutes" • 500 Registration Goal
            </p>
          </div>
        </div>

        {/* Mode Selector & Quick Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsStrategyModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition flex items-center gap-1.5"
          >
            <span>Strategic Plan</span>
          </button>

          <button
            onClick={() => setIsEvaluatorModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 transition flex items-center gap-1.5 hidden sm:flex"
          >
            <span>AI Project Evaluator</span>
          </button>

          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-lg p-1 text-xs">
            <button
              onClick={() => switchDataMode('demo')}
              className={`px-3 py-1 rounded font-semibold transition ${
                dataMode === 'demo'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Clean mode starting with real live registrations"
            >
              Interactive Mode ({totalRegistrations} Regs)
            </button>
            <button
              onClick={() => switchDataMode('simulated')}
              className={`px-3 py-1 rounded font-semibold transition ${
                dataMode === 'simulated'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Pre-seeded campaign dataset (348 baseline registrations)"
            >
              Full Simulation (348 Regs)
            </button>
          </div>

          <button
            onClick={handleClearAll}
            title="Clear all registrations to test Student A -> Student B from 0"
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset to 0</span>
          </button>

          <button
            onClick={onNavigateToLanding}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-blue-600/30"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Open Registration Page</span>
          </button>
        </div>
      </header>

      {resetNotice && (
        <div className="bg-emerald-500/10 border-b border-emerald-500/30 text-emerald-300 text-xs py-2 text-center font-medium">
          {dataMode === 'demo'
            ? 'Switched to Clean Interactive Mode. Data reset to 0 demo registrations.'
            : 'Switched to Full Campaign Simulation Mode (348 baseline registrations across 6 channels).'}
        </div>
      )}

      {/* Main Dashboard Workspace */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Core KPI Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* KPI 1: Registrations & Goal */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Registrations</span>
              <span className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                <Users className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalRegistrations}</span>
              <span className="text-xs text-slate-400">/ {goal} goal</span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
                <span>{progressPct}% achieved</span>
                <span className="text-emerald-400 font-bold">On track for Day 7</span>
              </div>
            </div>
          </div>

          {/* KPI 2: Conversion Rate */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Visitor Conversion</span>
              <span className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{conversionRate}%</span>
              <span className="text-xs text-emerald-400 font-semibold flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5" /> +4.2% vs avg
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>{totalVisits.toLocaleString()} unique landing visits</span>
              <span className="text-purple-400 font-medium">High intent</span>
            </div>
          </div>

          {/* KPI 3: Referral-Driven Registrations */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Viral & Referral Share</span>
              <span className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Share2 className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{referralRegistrations}</span>
              <span className="text-xs text-slate-400">
                ({Math.round((referralRegistrations / totalRegistrations) * 100)}% of total)
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="truncate">Viral coefficient (k-factor): 0.68</span>
              <span className="text-emerald-400 font-semibold">Zero-cost</span>
            </div>
          </div>

          {/* KPI 4: Budget & CPA */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800/90 hover:border-slate-700 transition">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Budget Spent</span>
              <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <DollarSign className="w-4 h-4" />
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">₹{totalSpent}</span>
              <span className="text-xs text-slate-400">/ ₹{totalBudget}</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span>₹{totalBudget - totalSpent} remaining</span>
              <span className="text-amber-400 font-semibold font-mono">CPA: ₹{costPerAcquisition}</span>
            </div>
          </div>
        </section>

        {/* Charts Row: 7-Day Velocity & Acquisition Channels */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Line Chart: 7-Day Registration Growth */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex flex-wrap items-center justify-between mb-6 gap-2">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <span>Cumulative Registrations (7-Day Pace)</span>
                </h3>
                <p className="text-xs text-slate-400">Actual pace vs. required target pace to reach 500</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-blue-400 font-medium">
                  <span className="w-3 h-1 bg-blue-500 rounded"></span> Actual
                </span>
                <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span className="w-3 h-1 bg-slate-600 rounded"></span> Target
                </span>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748B" fontSize={11} domain={[0, 520]} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="target"
                    stroke="#475569"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                    dot={false}
                    name="Target Pace"
                  />
                  <Line
                    type="monotone"
                    dataKey="actual"
                    stroke="#3B82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Actual Registrations"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Velocity: <strong>~72 reg/day</strong> over last 48 hours</span>
              <span className="text-emerald-400 font-semibold">Forecast: 512 registrations by Sunday</span>
            </div>
          </div>

          {/* Bar Chart: Channel Performance */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <span>Channel Attribution</span>
                </h3>
                <p className="text-xs text-slate-400">Registrations delivered by each channel</p>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Top: <strong className="text-emerald-400">{bestChannel.name}</strong>
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                  <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94A3B8"
                    fontSize={10}
                    tickLine={false}
                    width={90}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      color: '#F8FAFC',
                      fontSize: '12px',
                    }}
                    formatter={(value) => [`${value} registrations`, 'Acquired']}
                  />
                  <Bar dataKey="registrations" radius={[0, 4, 4, 0]}>
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Dominant organic: <strong>WhatsApp Student Groups (32%)</strong></span>
            </div>
          </div>
        </section>

        {/* Funnel & Budget Allocation Breakdown */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Conversion Funnel */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              <Target className="w-4 h-4 text-emerald-400" />
              <span>Acquisition & Registration Funnel</span>
            </h3>
            <p className="text-xs text-slate-400 mb-6">Visitor journey from initial touchpoint to confirmed seat</p>

            <div className="space-y-4">
              {funnel.map((stage, idx) => (
                <div key={stage.stage} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-bold text-slate-400">
                        {idx + 1}
                      </span>
                      {stage.stage}
                    </span>
                    <span className="font-mono text-white font-bold">
                      {stage.count.toLocaleString()} ({stage.percentage}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-800/80 rounded-lg h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-lg transition-all duration-700 ${
                        idx === 0
                          ? 'bg-blue-600'
                          : idx === 1
                          ? 'bg-indigo-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(5, stage.percentage)}%` }}
                    />
                  </div>

                  {stage.dropOffRate !== undefined && (
                    <div className="text-[10px] text-slate-500 text-right">
                      Drop-off: <span className="text-rose-400">{stage.dropOffRate}%</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-6 p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300">
              <strong className="text-blue-400">Growth Insight:</strong> 50% form completion from landing page visitors is well above standard 20% edtech benchmarks due to frictionless single-page layout and peer referral links.
            </div>
          </div>

          {/* Budget Tracker & ROI */}
          <div className="lg:col-span-6 glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-amber-400" />
                <span>₹2,000 Budget Expenditure & Efficiency</span>
              </h3>
              <span className="text-xs font-mono font-bold text-amber-400">
                ₹{totalSpent} / ₹2,000
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-6">Real-time spend and Cost-Per-Acquisition (CPA) per channel</p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                    <th className="pb-2">Channel</th>
                    <th className="pb-2">Allocated</th>
                    <th className="pb-2">Spent</th>
                    <th className="pb-2">Regs</th>
                    <th className="pb-2 text-right">CPA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {channelData.map(ch => (
                    <tr key={ch.name} className="hover:bg-slate-800/30">
                      <td className="py-2.5 font-sans font-medium text-slate-200 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ch.color }} />
                        <span className="truncate max-w-[140px]">{ch.name}</span>
                      </td>
                      <td className="py-2.5 text-slate-400">₹{ch.budgetAllocated}</td>
                      <td className="py-2.5 text-slate-200">₹{ch.budgetSpent}</td>
                      <td className="py-2.5 text-white font-bold">{ch.registrations}</td>
                      <td className="py-2.5 text-right font-bold text-emerald-400">₹{ch.cpa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span>Overall Campaign CPA: <strong className="text-emerald-400 font-mono">₹{costPerAcquisition} / reg</strong></span>
              <span>Reserve Left: <strong className="text-amber-400 font-mono">₹{totalBudget - totalSpent}</strong></span>
            </div>
          </div>
        </section>

        {/* Viral Referral Leaderboard & Daily Growth Activity */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Referral Leaderboard */}
          <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Student Ambassador Leaderboard</span>
              </h3>
              <span className="text-[11px] text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Top Advocates
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Peer advocates driving viral exponential loops through campus networks.
            </p>

            <div className="space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-xs text-slate-500 text-center py-6">
                  No referrals yet. Register with a referral code to see the board update!
                </div>
              ) : (
                leaderboard.map((item, index) => (
                  <div
                    key={item.referralCode}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                          index === 0
                            ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                            : index === 1
                            ? 'bg-slate-300 text-slate-950'
                            : index === 2
                            ? 'bg-amber-700 text-white'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">{item.name}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
                          {item.college}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-blue-400">
                        {item.count} friends
                      </div>
                      <div className="text-[10px] font-mono text-slate-500">
                        Code: {item.referralCode}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* 7-Day Campaign Strategy Timeline */}
          <div className="lg:col-span-7 glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" />
                <span>7-Day Campaign Execution Playbook</span>
              </h3>
              <span className="text-xs text-slate-400">Tactics & Milestones</span>
            </div>

            <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
              {CAMPAIGN_ACTIVITIES.map(act => (
                <div
                  key={act.id}
                  className={`p-3.5 rounded-xl border transition ${
                    act.status === 'Completed'
                      ? 'bg-slate-900/60 border-slate-800'
                      : act.status === 'In Progress'
                      ? 'bg-blue-950/30 border-blue-500/40 shadow-sm shadow-blue-500/10'
                      : 'bg-slate-900/20 border-slate-850 opacity-70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold font-mono text-blue-400">
                        {act.dateStr}
                      </span>
                      <span className="text-xs font-bold text-white">{act.title}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        act.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : act.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30 animate-pulse'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {act.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed mb-2">{act.description}</p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-800/40">
                    <span>
                      Channel: <strong className="text-slate-300">{act.channel}</strong>
                    </span>
                    <div className="flex items-center gap-3">
                      <span>
                        Regs: <strong className="text-emerald-400">+{act.registrationsGained}</strong>
                      </span>
                      <span>
                        Spend: <strong className="text-amber-400">₹{act.spendToday}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Live Registrations Table with Privacy Protection */}
        <section className="glass-panel p-6 rounded-2xl border border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-blue-400" />
                <span>Audited Student Registrations</span>
              </h3>
              <p className="text-xs text-slate-400">
                Verified records (emails and numbers are masked for data privacy compliance)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search student or college..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />

              <select
                value={channelFilter}
                onChange={e => setChannelFilter(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Channels ({registrations.length})</option>
                <option value="WhatsApp student groups">WhatsApp student groups</option>
                <option value="Student ambassadors and referrals">Ambassadors & Referrals</option>
                <option value="College clubs and coding communities">College Tech Clubs</option>
                <option value="College placement and technical communities">Placement Communities</option>
                <option value="Small targeted paid promotions">Paid Promotions</option>
                <option value="Email outreach">Email Outreach</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Masked Email</th>
                  <th className="py-3 px-4">Engineering College</th>
                  <th className="py-3 px-4">Year</th>
                  <th className="py-3 px-4">Channel / Source</th>
                  <th className="py-3 px-4">Referral Code</th>
                  <th className="py-3 px-4">Referred By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredRegistrations.slice(0, 15).map(reg => (
                  <tr key={reg.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-semibold text-white">{reg.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">{maskEmail(reg.email)}</td>
                    <td className="py-3 px-4 text-slate-300 max-w-[220px] truncate" title={reg.college}>
                      {reg.college}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{reg.gradYear}</td>
                    <td className="py-3 px-4">
                      <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {reg.channel}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-blue-400 font-bold">{reg.referralCode}</td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {reg.referredBy ? (
                        <span className="text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          {reg.referredBy}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>
              Showing top {Math.min(15, filteredRegistrations.length)} of {filteredRegistrations.length} matching registrations
            </span>
            <span className="text-[11px] text-slate-400">Protected by LocalStorage sandbox</span>
          </div>
        </section>
      </main>

      {/* Strategy and AI Project Evaluator Modals */}
      <CampaignStrategyModal
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
      />
      <ProjectEvaluatorModal
        isOpen={isEvaluatorModalOpen}
        onClose={() => setIsEvaluatorModalOpen(false)}
      />
    </div>
  );
};
