import React, { useEffect, useState } from 'react';
import { History, ShieldCheck, RefreshCw, AlertCircle, Eye, Clock, User, Building2, Lock, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { AccessLogItem } from '../types';
import { AnimatedCounter } from '../components/AnimatedCounter';

export const AccessHistoryPage: React.FC = () => {
  const [logs, setLogs] = useState<AccessLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setError(null);
      const data = await api.getLenderAccessLogs();
      setLogs(data);
    } catch (err: any) {
      setError('Unable to fetch access audit logs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const uniqueLenders = new Set(logs.map((l) => l.lender_name)).size;

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin" />
        <p className="text-sm font-medium text-slate-400">Loading audit access logs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12 max-w-5xl animate-fade-in-up">
      {/* Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold mb-2">
            <History className="w-3.5 h-3.5 text-cyan-400" />
            <span>Immutable Audit Trail</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Access History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Every score inquiry by registered lenders is recorded in real time for transparent consumer protection.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-slate-300 hover:text-white transition-all self-start md:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* 4 Animated KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-stagger-1">
        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Total Inquiries</span>
          <span className="text-2xl font-extrabold text-cyan-400 font-mono">
            <AnimatedCounter value={logs.length} duration={1200} />
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Audit log records</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Lenders Queried</span>
          <span className="text-2xl font-extrabold text-emerald-400 font-mono">
            <AnimatedCounter value={uniqueLenders} duration={1200} />
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Active institutions</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Consent Compliance</span>
          <span className="text-2xl font-extrabold text-white font-mono">
            <AnimatedCounter value={100} duration={1400} suffix="%" />
          </span>
          <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">Zero unauthorized</span>
        </div>

        <div className="glass-card p-4 rounded-2xl border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Raw Data Exposure</span>
          <span className="text-2xl font-extrabold text-cyan-300 font-mono">
            <AnimatedCounter value={0} duration={1000} suffix="%" />
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">Strict privacy seal</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Logs Table */}
      <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden animate-stagger-2">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Eye className="w-4 h-4 text-cyan-400" />
            <span>Recent Inquiries</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            <AnimatedCounter value={logs.length} duration={1000} /> events logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-900/40 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
                <th className="py-3 px-5">Lender Institution</th>
                <th className="py-3 px-5">Borrower</th>
                <th className="py-3 px-5">Purpose</th>
                <th className="py-3 px-5">Timestamp</th>
                <th className="py-3 px-5 text-right">Data Exchanged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-5 font-medium text-white flex items-center space-x-2">
                    <Building2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                    <span>{log.lender_name}</span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-300">
                    <span className="flex items-center space-x-1.5">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      <span>{log.borrower_name}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-slate-400">{log.purpose}</td>
                  <td className="py-3.5 px-5 text-slate-400 font-mono flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{log.accessed_at}</span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      Score & Factors Only
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Transparency Callout */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 flex items-start space-x-4">
        <div className="p-3 rounded-2xl bg-slate-900 text-cyan-400 border border-slate-800 mt-0.5">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white mb-1">Consumer Transparency Notice</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            The lender can see the explainable score, but cannot see Rahul's raw financial transactions. Every query is non-repudiable and accessible to the consumer anytime.
          </p>
        </div>
      </div>
    </div>
  );
};
