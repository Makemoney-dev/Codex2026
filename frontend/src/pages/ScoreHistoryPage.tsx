import React, { useEffect, useState } from 'react';
import { LineChart as LineChartIcon, TrendingUp, RefreshCw, AlertCircle, ArrowUpRight, Award } from 'lucide-react';
import { api } from '../services/api';
import { ScoreHistoryItem, ScoreResponse } from '../types';
import { ScoreHistoryChart } from '../components/ScoreHistoryChart';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface ScoreHistoryPageProps {
  borrowerId?: number;
}

export const ScoreHistoryPage: React.FC<ScoreHistoryPageProps> = ({ borrowerId = 1 }) => {
  const [history, setHistory] = useState<ScoreHistoryItem[]>([]);
  const [score, setScore] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [h, s] = await Promise.all([
          api.getScoreHistory(borrowerId),
          api.getScore(borrowerId),
        ]);
        setHistory(h);
        setScore(s);
      } catch (err: any) {
        setError('Failed to fetch score history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [borrowerId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading historical timeline...</p>
      </div>
    );
  }

  const startScore = history.length > 0 ? history[0].score : 680;
  const currentScore = score ? score.score : 742;
  const delta = currentScore - startScore;

  return (
    <div className="space-y-8 pb-12 max-w-5xl animate-fade-in-up">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold mb-2">
            <LineChartIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Behavioral Progression</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Score History & Trend
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Track how your steady monthly habits compound into higher credit inclusion scores.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center flex-shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 block">6-Month Gain</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">
            +<AnimatedCounter value={delta} duration={1400} /> pts
          </span>
          <span className="text-[10px] text-slate-400 block mt-0.5">
            {startScore} → <AnimatedCounter value={currentScore} duration={1400} />
          </span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Chart Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 animate-stagger-1">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Trajectory Curve</h3>
            <p className="text-xs text-slate-400">Monthly progression across 6 evaluation periods</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            Current: <AnimatedCounter value={currentScore} duration={1400} /> ({score?.band || 'Good'})
          </span>
        </div>

        <ScoreHistoryChart data={history} />
      </div>

      {/* Monthly Timeline Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 animate-stagger-2">
        {history.map((item, idx) => {
          const isLatest = idx === history.length - 1;

          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center transition-all ${
                isLatest
                  ? 'bg-cyan-950/30 border-cyan-500/50 shadow-glow-cyan'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <span className="text-xs font-semibold text-slate-400 block mb-1">{item.month}</span>
              <span className="text-xl font-extrabold text-white font-mono block">
                <AnimatedCounter value={item.score} duration={1200 + idx * 80} />
              </span>
              <span
                className={`text-[10px] font-bold block mt-1 ${
                  isLatest ? 'text-cyan-300' : 'text-slate-500'
                }`}
              >
                {isLatest ? 'Current' : 'Settled'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

