import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, RefreshCw, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { ConsentItem } from '../types';
import { ConsentToggle } from '../components/ConsentToggle';
import { Toast } from '../components/Toast';
import { AnimatedCounter } from '../components/AnimatedCounter';

interface ConsentCenterProps {
  borrowerId?: number;
}

export const ConsentCenter: React.FC<ConsentCenterProps> = ({ borrowerId = 1 }) => {
  const [consents, setConsents] = useState<ConsentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchConsents = async () => {
    try {
      setError(null);
      const data = await api.getConsents(borrowerId);
      setConsents(data);
    } catch (err: any) {
      setError('Unable to load consent preferences.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, [borrowerId]);

  const handleToggle = async (source: string, newStatus: boolean) => {
    setActionLoading(true);
    try {
      const res = await api.toggleConsent(borrowerId, source, newStatus);
      // Update local state
      setConsents((prev) =>
        prev.map((c) => (c.source === source ? { ...c, granted: newStatus } : c))
      );
      setToastMessage(res.message);
    } catch (err: any) {
      setToastMessage('Failed to update consent. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const grantedCount = consents.filter((c) => c.granted).length;
  const coveragePercent = consents.length > 0 ? Math.round((grantedCount / consents.length) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading your privacy permissions...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-4xl animate-fade-in-up">
      {/* Page Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-bold mb-2">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Consent & Privacy Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Data. Your Consent.
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Only data sources you actively consent to are used for scoring. You have the right to grant or revoke access anytime.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-400 block">Active Streams</span>
            <span className="text-2xl font-extrabold text-cyan-400 font-mono">
              <AnimatedCounter value={grantedCount} duration={1000} /> / <AnimatedCounter value={consents.length} duration={1000} />
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              {grantedCount === 4 ? 'Full Permissions' : 'Selective Permissions'}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
            <span className="text-[11px] font-semibold text-slate-400 block">Signal Coverage</span>
            <span className="text-2xl font-extrabold text-emerald-400 font-mono">
              <AnimatedCounter value={coveragePercent} duration={1200} suffix="%" />
            </span>
            <span className="text-[10px] text-emerald-400/80 block mt-0.5 font-medium">
              ML Input Weight
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Consent Cards List */}
      <div className="space-y-4 animate-stagger-1">
        {consents.map((item) => (
          <ConsentToggle
            key={item.source}
            item={item}
            onToggle={handleToggle}
            disabled={actionLoading}
          />
        ))}
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="glass-card p-6 rounded-3xl border border-cyan-800/40 bg-gradient-to-r from-slate-950 via-cyan-950/20 to-slate-950 flex items-start space-x-4">
        <div className="p-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 mt-1">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1">
            Privacy Firewall Guarantee
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            Lenders receive an explainable score, not your raw financial data. Raw transaction logs, rental receipts, utility invoices, and merchant names are strictly confidential and never shared.
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
};
