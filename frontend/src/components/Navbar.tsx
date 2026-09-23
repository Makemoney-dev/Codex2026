import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Sparkles, Building2, User, Home } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  currentRole?: UserRole;
  onSwitchRole?: (role: UserRole) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRole = 'borrower', onSwitchRole }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const isLender = currentRole === 'lender' || location.pathname.startsWith('/lender');
  const isLanding = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-emerald-500 p-0.5 shadow-glow-cyan">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center group-hover:bg-slate-900 transition-colors">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-extrabold tracking-tight text-white font-sans">
                Invisible<span className="text-cyan-400">Score</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                Live Platform
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium -mt-0.5">
              Alternative Credit & Financial Inclusion
            </p>
          </div>
        </Link>

        {/* Center / Navigation Links for Landing vs Dashboard */}
        {!isLanding && (
          <div className="hidden md:flex items-center space-x-1 bg-slate-900/60 border border-slate-800/80 p-1 rounded-xl">
            <Link
              to="/borrower/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isLender
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => onSwitchRole && onSwitchRole('borrower')}
            >
              <User className="w-3.5 h-3.5 inline mr-1.5" />
              Borrower View
            </Link>
            <Link
              to="/lender/dashboard"
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isLender
                  ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
              onClick={() => onSwitchRole && onSwitchRole('lender')}
            >
              <Building2 className="w-3.5 h-3.5 inline mr-1.5" />
              Lender View
            </Link>
          </div>
        )}

        {/* Right Action buttons */}
        <div className="flex items-center space-x-3">
          {isLanding ? (
            <>
              <Link
                to="/borrower/dashboard"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 text-xs font-bold shadow-glow-cyan transition-all"
              >
                Get Started
              </Link>
              <Link
                to="/login"
                className="px-3.5 py-2 rounded-xl border border-slate-700 hover:border-slate-600 bg-slate-900/60 text-slate-300 text-xs font-semibold hover:text-white transition-all"
              >
                Sign In
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Landing</span>
              </Link>

              {isLender ? (
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchRole) onSwitchRole('borrower');
                    navigate('/borrower/dashboard');
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-cyan-400 text-xs font-semibold transition-all"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Switch to Borrower</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (onSwitchRole) onSwitchRole('lender');
                    navigate('/lender/dashboard');
                  }}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 text-cyan-400 text-xs font-semibold transition-all"
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Switch to Lender</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};
