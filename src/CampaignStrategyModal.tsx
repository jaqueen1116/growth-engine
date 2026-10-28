import React from 'react';
import {
  Users,
  Target,
  Sparkles
} from 'lucide-react';

export const CampaignStrategyModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="glass-panel-glow max-w-4xl w-full rounded-2xl border border-blue-500/30 p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg font-bold p-1 rounded-lg hover:bg-slate-800"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
            NxtWave Growth Intern Submission Blueprint
          </span>
        </div>

        <h2 className="text-2xl font-black text-white">
          7-Day Marketing Strategy & Growth Engineering Plan
        </h2>
        <p className="text-xs text-slate-400 mt-1 mb-6">
          Objective: 500 final-year engineering registrations for "Build Your First AI Project in 60 Minutes" • ₹2,000 Budget
        </p>

        <div className="space-y-6 text-sm text-slate-300">
          {/* Section 1: Understand the Student */}
          <section className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span>1. Understand the Student</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-bold text-blue-400 uppercase mb-1">Target Persona</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>4th-Year B.Tech/BE Students (2027 batch)</strong> in Tier-2/3 Indian engineering colleges (CSE, IT, ECE, EEE).
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-bold text-amber-400 uppercase mb-1">Why They Care</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  High anxiety around placement season. Generic Java/SQL resumes get rejected; recruiters demand real AI/LLM experience.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs font-bold text-emerald-400 uppercase mb-1">Trigger to Register</div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>"Leave with a GitHub-ready AI project in 60 minutes"</strong> + ready resume bullet points + zero prerequisites.
                </p>
              </div>
            </div>
          </section>

          {/* Section 2: Marketing Campaign Plan & Channel Allocation */}
          <section className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-400" />
              <span>2. Prioritized 6-Channel Acquisition Plan (₹2,000 Budget)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Prioritized channel mix: High organic distribution + viral peer loops + precision micro-spends.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Channel</th>
                    <th className="py-2.5 px-3">Target Regs</th>
                    <th className="py-2.5 px-3">Budget</th>
                    <th className="py-2.5 px-3">CPA</th>
                    <th className="py-2.5 px-3">Why It Works</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-white">1. WhatsApp Student Groups</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">150 (30%)</td>
                    <td className="py-2.5 px-3">₹300</td>
                    <td className="py-2.5 px-3 text-emerald-400">₹2.0</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Direct peer-to-peer circulation in unofficial batch & placement groups.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-white">2. Campus Ambassadors & Referrals</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">160 (32%)</td>
                    <td className="py-2.5 px-3">₹500</td>
                    <td className="py-2.5 px-3 text-emerald-400">₹3.1</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Viral K-factor incentive: "Invite 3 friends, unlock AI Prompt & Resume Pack".</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-white">3. College Tech Clubs & Societies</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">90 (18%)</td>
                    <td className="py-2.5 px-3">₹400</td>
                    <td className="py-2.5 px-3 text-emerald-400">₹4.4</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Co-hosted announcements with ACM/IEEE student branches.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-white">4. Placement Wing Notices</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">50 (10%)</td>
                    <td className="py-2.5 px-3">₹200</td>
                    <td className="py-2.5 px-3 text-emerald-400">₹4.0</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Endorsed by class placement reps as interview skill enhancement.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-white">5. Hyper-Targeted IG/Meta Ads</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">35 (7%)</td>
                    <td className="py-2.5 px-3">₹450</td>
                    <td className="py-2.5 px-3 text-amber-400">₹12.8</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Geo-fenced Instagram stories for 4th-year tech college clusters.</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-sans font-semibold text-white">6. Targeted Email Outreach</td>
                    <td className="py-2.5 px-3 text-emerald-400 font-bold">15 (3%)</td>
                    <td className="py-2.5 px-3">₹150</td>
                    <td className="py-2.5 px-3 text-amber-400">₹10.0</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Direct invite to alumni of past coding contests and workshops.</td>
                  </tr>
                  <tr className="bg-slate-950 font-bold">
                    <td className="py-2.5 px-3 font-sans text-blue-400">Total Campaign</td>
                    <td className="py-2.5 px-3 text-emerald-400">500 Regs</td>
                    <td className="py-2.5 px-3 text-amber-400">₹2,000</td>
                    <td className="py-2.5 px-3 text-emerald-400">₹4.0 Avg</td>
                    <td className="py-2.5 px-3 font-sans text-slate-400 text-[11px]">Blended viral + community engine</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: Beyond "Just A Landing Page" */}
          <section className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>3. "Build One Thing" — Why This System Wins Brownie Points</span>
            </h3>
            <p className="text-xs text-slate-400">
              Rather than building a standard static landing page, this prototype implements a full multi-asset growth engine:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>1-Click WhatsApp Referral Engine</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Prepares customized, non-spam WhatsApp share URLs with dynamic referral code tags that attribute new peers in real-time.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>Growth Operations Dashboard</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Real-time KPI telemetry, 7-day velocity pacing charts, channel ROI tracker, and ambassador leaderboard.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>AI Project Evaluator & Interview Simulator</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Post-workshop retention tool that evaluates code, generates ATS-friendly bullet points, and predicts interview questions.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
                <div className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Interactive Test Mode (Student A → Student B)</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Allows interviewers to reset to 0, register Student A, click the test link, register Student B, and verify live attribution.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
