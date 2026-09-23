import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Search,
  ShieldCheck,
  Lock,
  History,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  RefreshCw,
  EyeOff,
  UserCheck
} from 'lucide-react';
import { api } from '../services/api';
import { BorrowerSummary, LenderBorrowerAssessment } from '../types';
import { BorrowerSelector } from '../components/BorrowerSelector';
import { AnimatedCounter } from '../components/AnimatedCounter';

export const LenderDashboard: React.FC = () => {
  const [borrowers, setBorrowers] = useState<BorrowerSummary[]>([]);
  const [selectedId, setSelectedId] = useState<number>(1);
  const [assessment, setAssessment] = useState<LenderBorrowerAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingAssessment, setFetchingAssessment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch borrowers list
  useEffect(() => {
    const fetchList = async () => {
      try {
        const list = await api.getBorrowers();
        setBorrowers(list);
        if (list.length > 0) {
          setSelectedId(list[0].id);
        }
      } catch (err: any) {
        setError('Failed to fetch borrowers list.');
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  // Fetch assessment whenever selectedId changes
  useEffect(() => {
    if (!selectedId) return;

    const fetchAssessment = async () => {
      setFetchingAssessment(true);
      try {
        const res = await api.getLenderBorrowerAssessment(selectedId);
        setAssessment(res);
      } catch (err: any) {
        setError('Unable to load borrower assessment.');
      } finally {
        setFetchingAssessment(false);
      }
    };
    fetchAssessment();
  }, [selectedId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading lender assessment console...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl animate-fade-in-up">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30 text-xs font-bold mb-2">
            <Building2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Lender Underwriting Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Borrower Assessment
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Assess inclusion scores backed by alternative data consent. Transparent explanations with zero raw data exposure.
          </p>
        </div>

        <Link
          to="/lender/access-logs"
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-cyan-300 text-xs font-bold transition-all self-start md:self-center"
        >
          <History className="w-4 h-4 text-cyan-400" />
          <span>View Access History</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Borrower Selection Tabs */}
      <div className="animate-stagger-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
            Select Borrower to Assess:
          </h3>
          <span className="text-xs text-slate-400">
            <AnimatedCounter value={borrowers.length} duration={1000} /> profiles preloaded
          </span>
        </div>
        <BorrowerSelector
          borrowers={borrowers}
          selectedId={selectedId}
          onSelect={(id) => setSelectedId(id)}
        />
      </div>

      {/* Assessment Display */}
      {fetchingAssessment ? (
        <div className="p-12 glass-card rounded-3xl border border-slate-800 text-center">
          <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Querying permitted inclusion score and logging access...</p>
        </div>
      ) : assessment ? (
        <div className="space-y-6">
          {/* Main Assessment Card */}
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-2xl font-bold text-white">{assessment.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                    {assessment.occupation}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Location: {assessment.city} • Verified Citizen</p>
              </div>

              {/* Score & Band Header */}
              <div className="flex items-center space-x-6">
                <div className="text-right">
                  <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                    Inclusion Score
                  </span>
                  <div className="flex items-baseline justify-end space-x-1">
                    <span className="text-3xl font-extrabold text-white font-mono">
                      <AnimatedCounter value={assessment.score} duration={1600} />
                    </span>
                    <span className="text-xs text-slate-400">/ 900</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Band</span>
                  <span className="text-base font-extrabold text-cyan-400 font-sans block">
                    {assessment.band}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center min-w-[90px]">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Coverage</span>
                  <span className="text-base font-extrabold text-emerald-400 font-mono block">
                    <AnimatedCounter value={assessment.data_coverage} duration={1400} suffix="%" />
                  </span>
                </div>
              </div>
            </div>

            {/* Explainable Factors Section */}
            <div className="mt-6">
              <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center space-x-2">
                <span>Explainable Underwriting Factors</span>
                <span className="text-xs text-slate-400 font-normal">
                  (High-level attributions without transaction leakage)
                </span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {assessment.explainable_factors.map((item, idx) => {
                  const isPos = item.direction.toLowerCase() === 'positive';
                  const isNeg = item.direction.toLowerCase() === 'negative';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-2.5">
                        {isPos ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        ) : isNeg ? (
                          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-slate-400 flex-shrink-0 ml-1 mr-1" />
                        )}
                        <span className="text-xs font-semibold text-slate-200">
                          {item.factor}
                        </span>
                      </div>

                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                          isPos
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                            : isNeg
                            ? 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {item.direction}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Privacy Firewall Callout Banner */}
          <div className="glass-card p-6 rounded-3xl border border-emerald-800/40 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 flex items-start space-x-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 mt-1">
              <EyeOff className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                Zero Raw Data Exposure Firewall
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {assessment.privacy_notice}
              </p>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                ✓ Access inquiry timestamped and written to borrower audit log.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};
