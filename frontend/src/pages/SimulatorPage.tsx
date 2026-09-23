import React, { useEffect, useState } from 'react';
import { SlidersHorizontal, TrendingUp, Sparkles, AlertCircle, ArrowRight, Zap, Home, Receipt, Smartphone } from 'lucide-react';
import { api } from '../services/api';
import { SimulateResponse } from '../types';
import { SimulatorSlider } from '../components/SimulatorSlider';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface SimulatorPageProps {
  borrowerId?: number;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({ borrowerId = 1 }) => {
  // Slider states initialized to realistic baseline
  const [upi, setUpi] = useState(85);
  const [rent, setRent] = useState(88);
  const [utility, setUtility] = useState(80);
  const [recharge, setRecharge] = useState(78);

  const [simResult, setSimResult] = useState<SimulateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.simulateScore(borrowerId, {
        upi_consistency: upi,
        rent_regularity: rent,
        utility_payment_timeliness: utility,
        recharge_consistency: recharge,
      });
      setSimResult(res);
    } catch (err: any) {
      setError('Unable to run ML simulation. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Run on mount and whenever sliders change (with a debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      runSimulation();
    }, 250);

    return () => clearTimeout(timer);
  }, [upi, rent, utility, recharge, borrowerId]);

  return (
    <div className="space-y-8 pb-12 max-w-5xl animate-fade-in-up">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold mb-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Machine Learning Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          See how your financial behavior could affect your score
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Adjust the hypothetical behavioral metrics below. Our backend Gradient Boosting model runs live inference to project how score changes under different financial habits.
        </p>
      </div>

      {/* Side-by-Side Comparison Banner */}
      {simResult && (
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden animate-stagger-1">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Current Score */}
            <div className="md:col-span-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Current Score
              </span>
              <div className="flex items-baseline justify-center space-x-1 my-1">
                <span className="text-4xl font-extrabold text-white font-mono">
                  <AnimatedCounter value={simResult.current_score} duration={1200} />
                </span>
                <span className="text-xs text-slate-400">/ 900</span>
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-slate-800 text-slate-300">
                {simResult.current_band}
              </span>
            </div>

            {/* Transition Arrow / Delta */}
            <div className="md:col-span-4 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-slate-400 mb-1">Projected Delta</span>
              <div
                className={`inline-flex items-center space-x-1 px-4 py-1.5 rounded-full text-sm font-extrabold font-mono border ${
                  simResult.change_points >= 0
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-glow-emerald'
                    : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                }`}
              >
                <TrendingUp
                  className={`w-4 h-4 ${simResult.change_points < 0 ? 'transform rotate-180' : ''}`}
                />
                <span>
                  {simResult.change_points >= 0 ? '+' : ''}
                  <AnimatedCounter value={simResult.change_points} duration={1200} /> pts
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-2 text-xs text-slate-400 font-mono">
                <AnimatedCounter value={simResult.current_score} duration={1000} />
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
                <AnimatedCounter value={simResult.projected_score} duration={1000} className="text-cyan-300 font-bold" />
              </div>
            </div>

            {/* Projected Score */}
            <div className="md:col-span-4 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/40 text-center shadow-glow-cyan">
              <span className="text-xs font-semibold text-cyan-400 block uppercase tracking-wider">
                Projected Score
              </span>
              <div className="flex items-baseline justify-center space-x-1 my-1">
                <span className="text-4xl font-extrabold text-white font-mono">
                  <AnimatedCounter value={simResult.projected_score} duration={1400} />
                </span>
                <span className="text-xs text-cyan-400/70">/ 900</span>
              </div>
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {simResult.projected_band}
              </span>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Important:</span> Simulation only — your actual score has not changed.
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 animate-stagger-2">
        <SimulatorSlider
          label="UPI Consistency"
          description="Cadence of daily UPI payments and merchant transactions"
          value={upi}
          onChange={setUpi}
          icon={<Zap className="w-4 h-4 text-cyan-400" />}
        />

        <SimulatorSlider
          label="Rent Regularity"
          description="Punctuality in settling monthly housing rentals"
          value={rent}
          onChange={setRent}
          icon={<Home className="w-4 h-4 text-emerald-400" />}
        />

        <SimulatorSlider
          label="Utility Bill Timeliness"
          description="Settling electricity, cooking gas, and water bills on or before due date"
          value={utility}
          onChange={setUtility}
          icon={<Receipt className="w-4 h-4 text-amber-400" />}
        />

        <SimulatorSlider
          label="Mobile Recharge Consistency"
          description="Prepaid telecom recharges prior to expiration"
          value={recharge}
          onChange={setRecharge}
          icon={<Smartphone className="w-4 h-4 text-purple-400" />}
        />
      </div>

      {/* Quick Action Presets */}
      <div className="glass-card p-5 rounded-2xl border border-slate-800 flex items-center justify-between animate-stagger-3">
        <span className="text-xs font-semibold text-slate-300">Try Predefined Behavioral Scenarios:</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setUpi(98);
              setRent(99);
              setUtility(96);
              setRecharge(95);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500 text-xs font-semibold text-cyan-300 transition-all"
          >
            Flawless Discipline
          </button>
          <button
            onClick={() => {
              setUpi(75);
              setRent(80);
              setUtility(72);
              setRecharge(70);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-300 transition-all"
          >
            Moderate Habits
          </button>
          <button
            onClick={() => {
              setUpi(50);
              setRent(55);
              setUtility(48);
              setRecharge(45);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-rose-500 text-xs font-semibold text-rose-300 transition-all"
          >
            Irregular Delays
          </button>
        </div>
      </div>
    </div>
  );
};
