import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  SlidersHorizontal,
  Lock,
  RefreshCw,
  AlertCircle,
  Database,
  BrainCircuit,
  MapPin,
  Briefcase
} from 'lucide-react';
import { api } from '../services/api';
import { ScoreResponse, ScoreHistoryItem } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { DataSourceCard } from '../components/DataSourceCard';
import { ExplanationCard } from '../components/ExplanationCard';
import { ScoreHistoryChart } from '../components/ScoreHistoryChart';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface BorrowerDashboardProps {
  borrowerId?: number;
}

export const BorrowerDashboard: React.FC<BorrowerDashboardProps> = ({ borrowerId = 1 }) => {
  const [scoreData, setScoreData] = useState<ScoreResponse | null>(null);
  const [historyData, setHistoryData] = useState<ScoreHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [animatedCoverage, setAnimatedCoverage] = useState<number>(0);

  const fetchData = async () => {
    try {
      setError(null);
      const [scoreRes, historyRes] = await Promise.all([
        api.getScore(borrowerId),
        api.getScoreHistory(borrowerId),
      ]);
      setScoreData(scoreRes);
      setHistoryData(historyRes);
      setTimeout(() => {
        setAnimatedCoverage(scoreRes.data_coverage);
      }, 200);
    } catch (err: any) {
      setError('Unable to load scoring data from backend. Please ensure server is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [borrowerId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">
          Running machine learning inference & SHAP explainability engine...
        </p>
      </div>
    );
  }

  if (error || !scoreData) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center glass-card rounded-2xl border border-rose-800/60 my-12 animate-fade-in-up">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-1">Backend Connection Error</h3>
        <p className="text-xs text-slate-400 mb-6">{error}</p>
        <button
          onClick={handleRefresh}
          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-xl text-xs font-bold transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Borrower Header Banner */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800/80 flex flex-col md:flex-row md:items-center md:justify-between gap-6 animate-fade-in-up">
        <div>
          <div className="flex items-center space-x-2.5 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Alternative Financial Profile
            </span>
            <span className="text-xs text-slate-400 font-mono">
              ID: #BRW-00{scoreData.borrower_id}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {scoreData.borrower_name}
          </h1>
          <div className="flex items-center space-x-4 mt-2 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <Briefcase className="w-3.5 h-3.5 text-slate-500" />
              <span>{scoreData.occupation}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{scoreData.city}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Link
            to="/borrower/simulator"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-cyan-300 text-xs font-bold transition-all shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
            <span>Score Simulator</span>
          </Link>

          <Link
            to="/borrower/privacy"
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-emerald-500 text-slate-200 hover:text-emerald-300 text-xs font-bold transition-all shadow-sm"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Privacy & Consent</span>
          </Link>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Recalculate with ML model"
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Top Scoring Section: Score Gauge + Key Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-stagger-1">
        {/* Score Gauge Card */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-slate-800/80 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute -top-16 -left-16 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <ScoreGauge score={scoreData.score} maxScore={900} band={scoreData.band} size={250} />

          <div className="mt-2 text-center">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950/30 border border-emerald-800/40 text-xs font-bold text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>
                +<AnimatedCounter value={scoreData.monthly_change} duration={1600} /> points this month
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">
              Computed using consent-backed alternative financial signals
            </p>
          </div>
        </div>

        {/* Key Indicators Card */}
        <div className="lg:col-span-7 glass-card p-6 sm:p-7 rounded-3xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Coverage & Health Signals</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Model {scoreData.model_version}
              </span>
            </div>

            {/* Coverage Meter */}
            <div className="mt-5 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-slate-300">
                  Data Coverage Index
                </span>
                <span className="text-sm font-bold text-cyan-300 font-mono">
                  <AnimatedCounter value={scoreData.data_coverage} duration={1500} suffix="%" />
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${animatedCoverage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                Reflects active consented streams (UPI, Rent, Utility Bills, Mobile Recharge). Higher coverage gives the ML model more granular behavioral signals.
              </p>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block font-medium">Model Confidence</span>
                <span className="text-lg font-bold text-white font-mono mt-0.5 block">
                  <AnimatedCounter value={Math.round(scoreData.confidence * 100)} duration={1400} suffix="%" />
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/60">
                <span className="text-[11px] text-slate-400 block font-medium">Score Tier</span>
                <span className="text-lg font-bold text-emerald-400 font-sans mt-0.5 block">
                  {scoreData.band}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span>Last computed: {new Date(scoreData.computed_at).toLocaleTimeString()}</span>
            <span className="text-cyan-400">✓ SHAP Explainability active</span>
          </div>
        </div>
      </div>

      {/* Alternative Data Cards (UPI, Rent, Bills, Recharge) */}
      <div className="animate-stagger-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Alternative Financial Signals</h3>
            <p className="text-xs text-slate-400">
              Synthesized behavioral signals used as features in the scoring model
            </p>
          </div>
          <span className="text-xs text-cyan-400 font-mono">
            <AnimatedCounter value={scoreData.alternative_data.length} duration={1000} /> Sources Connected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {scoreData.alternative_data.map((card, idx) => (
            <DataSourceCard key={idx} card={card} />
          ))}
        </div>
      </div>

      {/* Two Column: "Why This Score?" (SHAP) + Score History Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-stagger-3">
        {/* SHAP Explainability Card */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Why this score?</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                SHAP Explainer
              </span>
            </div>

            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Our explainable AI extracts the mathematical impact of each behavioral signal so you know exactly what drove your score:
            </p>

            <ExplanationCard explanations={scoreData.explanations} />
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-relaxed">
            * Shapley feature attributions computed directly from the trained tree model.
          </div>
        </div>

        {/* Score History Chart */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl border border-slate-800/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white">Score History</h3>
                <p className="text-xs text-slate-400">6-month score progression trajectory</p>
              </div>
              <span className="text-xs font-bold text-emerald-400 font-mono">
                +<AnimatedCounter value={scoreData.monthly_change} duration={1400} /> pts overall
              </span>
            </div>

            <ScoreHistoryChart data={historyData} />
          </div>

          <div className="mt-6 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Consistent monthly habits improve score over time</span>
            <Link to="/borrower/history" className="text-cyan-400 hover:underline">
              View details →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
