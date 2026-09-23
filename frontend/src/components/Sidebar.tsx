import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  SlidersHorizontal,
  Lock,
  LineChart,
  Building2,
  History,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  role: UserRole;
  borrowerName?: string;
  onSwitchRole?: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ role, borrowerName = 'Rahul Sharma', onSwitchRole }) => {
  const isBorrower = role === 'borrower';

  return (
    <aside className="w-64 flex-shrink-0 hidden md:block border-r border-slate-800/80 bg-slate-950/50 p-5 min-h-[calc(100vh-4rem)]">
      {/* User Context Card */}
      <div className="mb-6 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
          {isBorrower ? 'Active Borrower' : 'Active Financial Institution'}
        </span>
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
            {isBorrower ? 'RS' : 'MF'}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">
              {isBorrower ? borrowerName : 'Mumbai Finance Ltd'}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {isBorrower ? 'Delivery Partner • Mumbai' : 'NBFC Lending Officer'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Group */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          {isBorrower ? 'Borrower Portal' : 'Lender Portal'}
        </p>

        {isBorrower ? (
          <>
            <NavLink
              to="/borrower/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="/borrower/simulator"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Score Simulator</span>
            </NavLink>

            <NavLink
              to="/borrower/privacy"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <Lock className="w-4 h-4" />
              <span>Privacy & Consent</span>
            </NavLink>

            <NavLink
              to="/borrower/history"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <LineChart className="w-4 h-4" />
              <span>Score History</span>
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/lender/dashboard"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <FileCheck className="w-4 h-4" />
              <span>Borrower Assessment</span>
            </NavLink>

            <NavLink
              to="/lender/access-logs"
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`
              }
            >
              <History className="w-4 h-4" />
              <span>Access History</span>
            </NavLink>
          </>
        )}
      </div>

      {/* Switch Persona Fast Track */}
      <div className="mt-8 pt-6 border-t border-slate-800/80">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Hackathon Quick Switch
        </p>
        {isBorrower ? (
          <NavLink
            to="/lender/dashboard"
            onClick={() => onSwitchRole && onSwitchRole('lender')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
          >
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Open Lender Portal</span>
          </NavLink>
        ) : (
          <NavLink
            to="/borrower/dashboard"
            onClick={() => onSwitchRole && onSwitchRole('borrower')}
            className="w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 transition-all"
          >
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Open Borrower Portal</span>
          </NavLink>
        )}
      </div>

      {/* Synthetic Data Disclaimer in Sidebar */}
      <div className="mt-8 p-3 rounded-xl bg-slate-900/40 border border-slate-800/60 text-[11px] text-slate-500 leading-relaxed">
        <p className="font-semibold text-slate-400 mb-0.5">Research Prototype</p>
        Using synthetic alternative data only. Not a CIBIL score.
      </div>
    </aside>
  );
};
