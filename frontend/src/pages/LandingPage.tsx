import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Lock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  BrainCircuit,
  CheckCircle2,
  Building2,
  Users,
  Award
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { AnimatedCounter } from '../components/AnimatedCounter';
import { AnimatedHeadline } from '../components/AnimatedHeadline';
import { ScrollReveal } from '../components/ScrollReveal';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-semibold text-cyan-400 mb-6 shadow-glow-cyan animate-fade-in-up">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Explainable Alternative Credit Scoring</span>
          </div>

          {/* Motionable Animated Heading */}
          <AnimatedHeadline className="mb-4" />

          {/* Subheading */}
          <p className="mt-6 text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto animate-stagger-2">
            Traditional credit history doesn't tell the whole story. InvisibleScore uses consented alternative financial signals to provide a more inclusive and explainable approach to credit assessment.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 animate-stagger-3">
            <Link
              to="/borrower/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold text-sm shadow-glow-cyan flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <a
              href="#how-it-works"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-semibold text-sm transition-all"
            >
              How It Works
            </a>
          </div>

          {/* Prototype Synthetic Data Disclaimer Tag */}
          <div className="mt-6 text-xs text-slate-400 font-mono">
            * Prototype using synthetic data — not a real credit bureau score.
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="max-w-4xl mx-auto glass-card p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Gauge Preview */}
            <div className="md:col-span-5 flex flex-col items-center">
              <ScoreGauge score={742} maxScore={900} band="GOOD" size={230} />
              <div className="mt-2 flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>
                  +<AnimatedCounter value={28} duration={1600} /> points this month
                </span>
              </div>
            </div>

            {/* Explanations & Signals Preview */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Rahul Sharma</h3>
                  <p className="text-xs text-slate-400">Delivery Partner • Mumbai</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-400">Data Coverage</span>
                  <p className="text-sm font-bold text-cyan-400 font-mono">
                    <AnimatedCounter value={86} duration={1400} suffix="% Connected" />
                  </p>
                </div>
              </div>

              {/* Sample SHAP Positive Factors */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
                  <span className="text-slate-200 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Consistent UPI transaction activity</span>
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    +<AnimatedCounter value={42} duration={1500} /> pts
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
                  <span className="text-slate-200 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Regular monthly rent payments</span>
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    +<AnimatedCounter value={31} duration={1500} /> pts
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/30">
                  <span className="text-slate-200 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>Timely utility bill settlements</span>
                  </span>
                  <span className="text-emerald-400 font-bold font-mono">
                    +<AnimatedCounter value={24} duration={1500} /> pts
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[11px] text-slate-400 font-mono">
                <span>Model: GradientBoostingRegressor + SHAP</span>
                <span className="text-emerald-400">✓ Consented Signals Only</span>
              </div>
            </div>
          </div>
        </div>

        {/* Animated Metrics Strip */}
        <ScrollReveal direction="up" className="mt-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center hover:border-cyan-500/40 transition-all">
              <span className="text-3xl font-extrabold text-cyan-400 font-mono block">
                <AnimatedCounter value={900} duration={1600} prefix="0–" />
              </span>
              <span className="text-xs text-slate-400 mt-1.5 block font-medium">Inclusion Score Scale</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center hover:border-emerald-500/40 transition-all">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono block">
                <AnimatedCounter value={1400} duration={1600} formatCommas suffix="+" />
              </span>
              <span className="text-xs text-slate-400 mt-1.5 block font-medium">Micro-Signals Analyzed</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center hover:border-blue-500/40 transition-all">
              <span className="text-3xl font-extrabold text-white font-mono block">
                <AnimatedCounter value={99.4} duration={1600} decimals={1} suffix="%" />
              </span>
              <span className="text-xs text-slate-400 mt-1.5 block font-medium">Zero Data Leakage Seal</span>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 text-center hover:border-purple-500/40 transition-all">
              <span className="text-3xl font-extrabold text-cyan-300 font-mono block">
                <AnimatedCounter value={180} duration={1400} prefix="< " suffix="ms" />
              </span>
              <span className="text-xs text-slate-400 mt-1.5 block font-medium">SHAP Inference Latency</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 4 Feature Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <ScrollReveal direction="up" className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Built for modern, inclusive finance
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Bridging the gap between active financial behavior and formal credit accessibility.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Zap className="w-6 h-6" />,
              color: 'cyan',
              borderHover: 'hover:border-cyan-500/50',
              iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
              title: 'Alternative Data',
              desc: 'Consents UPI transaction cadence, rental consistency, utility bills, and telecom recharges instead of bureau history.',
            },
            {
              icon: <BrainCircuit className="w-6 h-6" />,
              color: 'emerald',
              borderHover: 'hover:border-emerald-500/50',
              iconBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
              title: 'Explainable AI',
              desc: 'No black boxes. Real SHAP TreeExplainer values translate exact mathematical attributions into plain-language reason codes.',
            },
            {
              icon: <Lock className="w-6 h-6" />,
              color: 'blue',
              borderHover: 'hover:border-blue-500/50',
              iconBg: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
              title: 'Privacy First',
              desc: 'Borrowers hold the master switch. Lenders only see explainable scores and bands — raw bank or UPI transactions are strictly sealed.',
            },
            {
              icon: <Users className="w-6 h-6" />,
              color: 'purple',
              borderHover: 'hover:border-purple-500/50',
              iconBg: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
              title: 'Financial Inclusion',
              desc: 'Purpose-built for gig workers, shopkeepers, daily earners, and young freelancers ignored by traditional legacy bureaus.',
            },
          ].map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 120} direction="up">
              <div className={`glass-card p-6 rounded-2xl border border-slate-800/80 ${item.borderHover} transition-all h-full flex flex-col`}>
                <div className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${item.iconBg}`}>
                  {item.icon}
                </div>
                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed flex-1">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-900">
        <ScrollReveal direction="up" className="text-center mb-12">
          <span className="text-xs font-bold text-cyan-400 tracking-widest uppercase">The Pipeline</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            How InvisibleScore Works
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { step: '01', title: 'Connect Signals', desc: 'Consent to UPI, rent, and utility streams' },
            { step: '02', title: 'Feature Engineering', desc: 'Behavioral cadence and regularity indexing' },
            { step: '03', title: 'ML Prediction', desc: 'Trained Gradient Boosting model produces 0–900 score' },
            { step: '04', title: 'SHAP Attribution', desc: 'Extracts exact positive & negative factor weights' },
            { step: '05', title: 'Lender Sharing', desc: 'Lender accesses only verified score & explanations' },
          ].map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 90} direction="up">
              <div className="glass-card p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/40 transition-all h-full relative">
                <span className="text-xs font-mono font-bold text-cyan-400">{item.step}</span>
                <h4 className="text-sm font-bold text-white mt-2 mb-1">{item.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-10 px-4 text-center text-xs text-slate-400">
        <p className="font-semibold text-slate-400 mb-1">
          InvisibleScore — Credit Score for the Invisible
        </p>
        <p className="max-w-md mx-auto leading-relaxed">
          Synthetic prototype built for financial inclusion evaluation. Not affiliated with CIBIL, Experian, or RBI Account Aggregator network.
        </p>
      </footer>
    </div>
  );
};
