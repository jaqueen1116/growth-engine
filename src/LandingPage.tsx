import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Video,
  CheckCircle,
  Copy,
  Share2,
  Users,
  Award,
  ArrowRight,
  ShieldCheck,
  BookOpen,
  Terminal,
  Zap,
  Check,
  Gift
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StorageService } from './storage';
import type { Registration, AcquisitionChannel } from './types';
import { CampaignStrategyModal } from './CampaignStrategyModal';
import { ProjectEvaluatorModal } from './ProjectEvaluatorModal';

interface LandingPageProps {
  onNavigateToDashboard: () => void;
  referralCodeParam?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToDashboard,
  referralCodeParam = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: '',
    gradYear: '2027',
    whatsapp: '',
    referredBy: referralCodeParam,
    channel: (referralCodeParam
      ? 'Student ambassadors and referrals'
      : 'WhatsApp student groups') as AcquisitionChannel,
  });

  const [hasStartedForm, setHasStartedForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeReg, setActiveReg] = useState<Registration | null>(() => {
    // If incoming with a referral code param, show the registration form so user can register!
    if (referralCodeParam) return null;
    return StorageService.getLastUserRegistration();
  });
  const [copied, setCopied] = useState(false);
  const [isStrategyModalOpen, setIsStrategyModalOpen] = useState(false);
  const [isEvaluatorModalOpen, setIsEvaluatorModalOpen] = useState(false);

  // Sync if referralCodeParam changes via URL
  React.useEffect(() => {
    if (referralCodeParam) {
      setFormData(prev => ({
        ...prev,
        referredBy: referralCodeParam,
        channel: 'Student ambassadors and referrals',
      }));
      setActiveReg(null); // Show registration form for the referred student
    }
  }, [referralCodeParam]);

  // Trigger form start tracking once
  const handleInputChange = (field: string, value: string) => {
    if (!hasStartedForm) {
      setHasStartedForm(true);
      StorageService.recordFormStart();
    }
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMsg('');
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.college.trim()) {
      setErrorMsg('Please fill in your name, email, and college.');
      return;
    }

    // Auto generate clean referral code
    const cleanFirstName = formData.name.trim().split(' ')[0].toUpperCase().replace(/[^A-Z]/g, '').slice(0, 5) || 'NXT';
    const randomSuffix = Math.floor(10 + Math.random() * 89);
    const newReferralCode = `${cleanFirstName}${randomSuffix}`;

    const result = StorageService.addRegistration({
      name: formData.name.trim(),
      email: formData.email.trim(),
      college: formData.college.trim(),
      gradYear: formData.gradYear,
      whatsapp: formData.whatsapp.trim() || undefined,
      referralCode: newReferralCode,
      referredBy: formData.referredBy.trim() || undefined,
      channel: formData.referredBy.trim()
        ? 'Student ambassadors and referrals'
        : formData.channel,
    });

    if (result.success && result.registration) {
      setActiveReg(result.registration);
      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }
    } else if (!result.success && result.registration) {
      setErrorMsg(result.message);
      setActiveReg(result.registration);
    } else {
      setErrorMsg(result.message || 'Registration failed. Please check inputs.');
    }
  };

  const referralCount = activeReg ? StorageService.getReferralCount(activeReg.referralCode) : 0;
  const baseUrl = window.location.origin + window.location.pathname;
  const referralLink = activeReg ? `${baseUrl}?ref=${activeReg.referralCode}` : '';

  const getWhatsAppShareUrl = () => {
    if (!activeReg) return '';
    const shareText = `Hey! I'm joining NxtWave's FREE workshop — Build Your First AI Project in 60 Minutes. Want to join me? Register here: ${referralLink}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
  };

  const copyToClipboard = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0A0E1A] text-slate-100 flex flex-col selection:bg-blue-500">
      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 border-b border-white/10">
        <span className="bg-white/20 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
          Simulation Demo
        </span>
        <span>
          NxtWave Growth Intern Challenge — Target: 500 Final-Year Engineering Registrations in 7 Days (₹2,000 Budget)
        </span>
        <button
          onClick={onNavigateToDashboard}
          className="ml-3 underline font-bold hover:text-blue-100 flex items-center gap-1"
        >
          Open Growth Dashboard <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <nav className="glass-panel sticky top-0 z-50 px-6 py-4 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 font-black text-xl text-white">
            N
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight flex items-center gap-1.5">
              <span>NxtWave</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold">
                Growth Engine
              </span>
            </div>
            <p className="text-[11px] text-slate-400">From one AI workshop to 500 student registrations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsStrategyModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition flex items-center gap-1.5"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Campaign Plan</span>
          </button>

          <button
            onClick={() => setIsEvaluatorModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30 transition flex items-center gap-1.5 hidden sm:flex"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>AI Project Evaluator</span>
          </button>

          <button
            onClick={onNavigateToDashboard}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 hover:border-slate-600 transition flex items-center gap-2 shadow-sm"
          >
            <span>Live Dashboard</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 md:px-8 border-b border-slate-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.18),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Workshop Pitch */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              FREE LIVE ONLINE WORKSHOP
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              Build Your First <br />
              <span className="gradient-text">AI Project</span> in 60 Minutes.
            </h1>

            <p className="text-lg text-slate-300 leading-relaxed max-w-2xl">
              No prior AI experience required. Build a real beginner-friendly AI project and leave with something you can show.
            </p>

            {/* Quick meta badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Date</div>
                  <div className="text-xs font-bold text-slate-200">Sunday, 6:00 PM IST</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <Clock className="w-5 h-5 text-indigo-400" />
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Duration</div>
                  <div className="text-xs font-bold text-slate-200">60 Min Hands-On</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2 sm:col-span-1">
                <Video className="w-5 h-5 text-emerald-400" />
                <div>
                  <div className="text-[11px] text-slate-400 uppercase font-semibold">Format</div>
                  <div className="text-xs font-bold text-slate-200">Live Interactive</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#register"
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition flex items-center gap-2 group"
              >
                <span>Reserve My Free Spot</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#agenda"
                className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 font-semibold text-base border border-slate-700/80 transition"
              >
                See How It Works
              </a>
            </div>

            {/* Campaign Target & Cohort Status */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 border-2 border-[#0A0E1A] flex items-center justify-center text-[10px] font-bold">27</div>
                <div className="w-7 h-7 rounded-full bg-indigo-600 border-2 border-[#0A0E1A] flex items-center justify-center text-[10px] font-bold">AI</div>
                <div className="w-7 h-7 rounded-full bg-purple-600 border-2 border-[#0A0E1A] flex items-center justify-center text-[10px] font-bold">60</div>
                <div className="w-7 h-7 rounded-full bg-emerald-600 border-2 border-[#0A0E1A] flex items-center justify-center text-[10px] font-bold">NX</div>
              </div>
              <span>
                <strong className="text-slate-200">500 seat target</strong> for final-year 2027 engineering students across Indian colleges
              </span>
            </div>
          </div>

          {/* Right Column: Registration Card or Referral Card */}
          <div className="lg:col-span-5" id="register">
            {activeReg ? (
              /* Post-Registration & Viral Referral Card */
              <div className="glass-panel-glow p-6 sm:p-8 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Spot Reserved!</h2>
                    <p className="text-xs text-slate-400">Welcome, {activeReg.name} ({activeReg.college})</p>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 mb-5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Registered Email</span>
                    <span className="font-mono text-slate-200">{activeReg.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Your Referral Code</span>
                    <span className="font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {activeReg.referralCode}
                    </span>
                  </div>
                </div>

                {/* Referral Count & Milestones */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/40 to-slate-900 border border-blue-500/20 mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                      <Gift className="w-4 h-4 text-orange-400" />
                      <span>Referral Reward Tracker</span>
                    </div>
                    <span className="text-xs font-bold text-blue-400">
                      {referralCount} Friend{referralCount !== 1 ? 's' : ''} Joined
                    </span>
                  </div>

                  {/* Progress bar to milestone 3 */}
                  <div className="w-full bg-slate-800 rounded-full h-2 mb-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, (referralCount / 3) * 100)}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      {referralCount >= 3
                        ? '🎉 Unlocked: AI Resume Blueprint & Prompt Pack!'
                        : `Invite ${3 - referralCount} more friends to unlock the AI Interview Prep Guide.`}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Goal: 3</span>
                  </p>
                </div>

                {/* Viral Actions */}
                <div className="space-y-3">
                  <a
                    href={getWhatsAppShareUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Invite Friends via WhatsApp</span>
                  </a>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Direct Test as Student B button */}
                  <a
                    href={referralLink}
                    className="w-full py-2.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <span>⚡ Test Link: Register as Student B with this code</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Tracked in real-time on Growth Engine</span>
                  <button
                    onClick={() => setActiveReg(null)}
                    className="text-blue-400 hover:underline"
                  >
                    Register another student
                  </button>
                </div>
              </div>
            ) : (
              /* Clean Registration Form */
              <div className="glass-panel p-6 sm:p-8 rounded-2xl relative border border-slate-700/80 shadow-2xl">
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Reserve Your Free Seat</h2>
                    <span className="text-[11px] font-bold text-orange-400 bg-orange-400/10 px-2.5 py-0.5 rounded-full border border-orange-400/20">
                      Limited to 500 Seats
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill the form below to lock your access link and starter code.
                  </p>
                </div>

                {referralCodeParam && formData.referredBy && (
                  <div className="mb-4 p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-xs text-blue-300 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Referred by peer code: <strong>{formData.referredBy}</strong></span>
                  </div>
                )}

                {errorMsg && (
                  <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                    {errorMsg}
                  </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Full Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      College Email or Personal Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul.sharma@college.edu.in"
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Engineering College Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. JNTU Hyderabad / BMS College / RVCE"
                      value={formData.college}
                      onChange={e => handleInputChange('college', e.target.value)}
                      className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Graduation Year
                      </label>
                      <select
                        value={formData.gradYear}
                        onChange={e => handleInputChange('gradYear', e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition"
                      >
                        <option value="2027">2027 (Final Year)</option>
                        <option value="2028">2028 (Pre-Final)</option>
                        <option value="2026">2026 (Graduating)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        WhatsApp (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="10-digit number"
                        value={formData.whatsapp}
                        onChange={e => handleInputChange('whatsapp', e.target.value)}
                        className="w-full bg-slate-900/90 border border-slate-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
                      />
                    </div>
                  </div>

                  {/* Referral Code Input — shown only when not pre-filled via URL param */}
                  {!referralCodeParam && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Have a Referral Code? (Optional)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Gift className="w-4 h-4 text-slate-500" />
                        </div>
                        <input
                          type="text"
                          placeholder="e.g. RAHUL42"
                          value={formData.referredBy}
                          onChange={e => {
                            const val = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                            handleInputChange('referredBy', val);
                            if (val.trim()) {
                              handleInputChange('channel', 'Student ambassadors and referrals');
                            }
                          }}
                          maxLength={10}
                          className="w-full bg-slate-900/90 border border-slate-700 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition font-mono tracking-wider uppercase"
                        />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Enter a friend's referral code if you were invited by someone.
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 transition flex items-center justify-center gap-2"
                  >
                    <span>Confirm & Get Workshop Access</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Privacy & Prototype simulation disclaimer */}
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 leading-normal flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <p>
                    <strong>Simulation Note:</strong> This is an interactive demo for the NxtWave Growth Intern challenge. Registrations are stored securely in browser LocalStorage and are not submitted to NxtWave servers.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3 Core Benefits Section */}
      <section id="benefits" className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Why Final-Year Engineers Join
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-3">
            Walk Away With Tangible AI Skills in 1 Hour
          </h2>
          <p className="text-slate-400 text-sm mt-2">
            Most workshops are 90% theory and slide decks. This session is 100% build-first.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Terminal className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Build a Beginner-Friendly AI Project</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Step-by-step guidance to assemble a working AI application from scratch. No complex mathematics or heavy setup required.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-indigo-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Learn to Use AI Tools Practically</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Discover how modern developers leverage LLM APIs, prompt engineering, and intelligent tooling to accelerate software delivery.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">A Project to Discuss in Interviews</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Stand out during campus placements and technical interviews with an actual deployed AI project on your GitHub resume.
            </p>
          </div>
        </div>
      </section>

      {/* 60-Minute Workshop Agenda */}
      <section id="agenda" className="py-16 px-4 md:px-8 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
              Structured Timeline
            </span>
            <h2 className="text-3xl font-extrabold text-white mt-3">
              The 60-Minute Breakdown
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Every minute is optimized for maximum hands-on learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
              <div className="text-xs font-mono font-bold text-blue-400 mb-1">00 - 15 MIN</div>
              <h3 className="text-base font-bold text-white mb-1">Foundation & AI APIs</h3>
              <p className="text-xs text-slate-400">
                Understanding LLM architectures, API keys, and environment setup without local headaches.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
              <div className="text-xs font-mono font-bold text-indigo-400 mb-1">15 - 35 MIN</div>
              <h3 className="text-base font-bold text-white mb-1">Hands-on Code Build</h3>
              <p className="text-xs text-slate-400">
                Writing core application logic, system prompts, and handling asynchronous AI streams.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
              <div className="text-xs font-mono font-bold text-purple-400 mb-1">35 - 50 MIN</div>
              <h3 className="text-base font-bold text-white mb-1">UI & Deployment</h3>
              <p className="text-xs text-slate-400">
                Attaching an interactive web interface and generating a live shareable URL for recruiters.
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
              <div className="text-xs font-mono font-bold text-emerald-400 mb-1">50 - 60 MIN</div>
              <h3 className="text-base font-bold text-white mb-1">Placement Strategy</h3>
              <p className="text-xs text-slate-400">
                How to showcase this project on LinkedIn/Resume and answers to top technical interview questions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who should attend & What students will take away */}
      <section className="py-20 px-4 md:px-8 max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Who should attend */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2.5 text-blue-400 mb-4">
              <Users className="w-5 h-5" />
              <h3 className="text-xl font-bold text-white">Who Should Attend?</h3>
            </div>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Final-year engineering students (2027 batch)</strong> preparing for upcoming off-campus and on-campus IT placements.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Pre-final year students who want early exposure to modern AI engineering practices.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Students from CSE, IT, ECE, EEE, and other branches with basic programming familiarity.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Learners tired of theoretical tutorials who want a verified build on their portfolio.</span>
              </li>
            </ul>
          </div>

          {/* What you take away */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2.5 text-indigo-400 mb-4">
              <BookOpen className="w-5 h-5" />
              <h3 className="text-xl font-bold text-white">What You'll Take Away</h3>
            </div>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Starter Code & Architecture Templates</strong> with clean modular structure and setup docs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>AI Interview Question Bank</strong>: Curated technical questions asked during developer placement rounds.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Live Build Guidance</strong>: Follow-along code architecture during the 60-minute build session.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Peer discussion channel for 2027 batch engineering students.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Bottom Sticky Floating CTA on Mobile */}
      <div className="md:hidden fixed bottom-3 left-4 right-4 z-40">
        <a
          href="#register"
          className="w-full py-3.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 border border-blue-400/30"
        >
          <span>Reserve Free Spot Now</span>
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Modals for Campaign Plan and AI Evaluator */}
      <CampaignStrategyModal
        isOpen={isStrategyModalOpen}
        onClose={() => setIsStrategyModalOpen(false)}
      />
      <ProjectEvaluatorModal
        isOpen={isEvaluatorModalOpen}
        onClose={() => setIsEvaluatorModalOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 py-8 px-6 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 NxtWave Growth Engine. Built for the Growth Intern Simulation Challenge.</p>
          <div className="flex items-center gap-4">
            <button onClick={onNavigateToDashboard} className="text-blue-400 hover:underline">
              Growth Operations Dashboard
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">Target: 500 Registrations</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
