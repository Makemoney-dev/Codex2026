import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Building2, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (role: UserRole, borrowerId?: number) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('borrower@invisiblescore.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (overrideEmail?: string, overridePass?: string) => {
    const e = overrideEmail || email;
    const p = overridePass || password;
    setLoading(true);
    setError(null);

    try {
      const session = await api.loginDemo(e, p);
      onLoginSuccess(session.role, session.borrowerId);
      if (session.role === 'lender') {
        navigate('/lender/dashboard');
      } else {
        navigate('/borrower/dashboard');
      }
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-[#070b14]">
      <div className="max-w-md w-full glass-card p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 mx-auto flex items-center justify-center text-cyan-400 mb-3 shadow-glow-cyan">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Access Portal</h2>
          <p className="text-xs text-slate-400 mt-1">
            Select an account to explore the inclusion scoring platform
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Persona Buttons */}
        <div className="space-y-3 mb-6">
          <button
            type="button"
            disabled={loading}
            onClick={() => handleLogin('borrower@invisiblescore.com', 'demo123')}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300">
                  Borrower Account
                </h4>
                <p className="text-xs text-slate-400">Rahul Sharma (Delivery Partner • Score 742)</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-cyan-400 transform group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => handleLogin('lender@invisiblescore.com', 'demo123')}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-700/80 hover:border-emerald-500/50 text-left transition-all group flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-300">
                  Lender Account
                </h4>
                <p className="text-xs text-slate-400">Mumbai Finance Ltd (Credit Assessment)</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-4 text-[11px] text-slate-400 uppercase tracking-widest font-semibold">
            Or Manual Credentials
          </span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* Manual form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="space-y-4"
        >
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-sm text-white focus:outline-none"
              placeholder="borrower@invisiblescore.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 focus:border-cyan-500 text-sm text-white focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In with Credentials'}</span>
          </button>
        </form>

        <p className="text-[11px] text-slate-400 text-center mt-6">
          Preloaded accounts ready for immediate evaluation.
        </p>
      </div>
    </div>
  );
};
