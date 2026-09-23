import React from 'react';
import { Zap, Home, Receipt, Smartphone } from 'lucide-react';
import { ConsentItem } from '../types';

interface ConsentToggleProps {
  item: ConsentItem;
  onToggle: (source: string, newStatus: boolean) => void;
  disabled?: boolean;
}

export const ConsentToggle: React.FC<ConsentToggleProps> = ({ item, onToggle, disabled }) => {
  const getIcon = (src: string) => {
    switch (src) {
      case 'upi':
        return <Zap className="w-5 h-5 text-cyan-400" />;
      case 'rent':
        return <Home className="w-5 h-5 text-emerald-400" />;
      case 'utility_bill':
        return <Receipt className="w-5 h-5 text-amber-400" />;
      case 'mobile_recharge':
        return <Smartphone className="w-5 h-5 text-purple-400" />;
      default:
        return <Zap className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3.5">
          <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 mt-0.5">
            {getIcon(item.source)}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-base font-semibold text-slate-100">{item.source_label}</h4>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  item.granted
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                {item.granted ? 'Consented' : 'Revoked'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xl">
              {item.usage_description}
            </p>
            <div className="text-[11px] text-slate-500 mt-2 flex items-center space-x-2">
              <span>Status: {item.granted ? 'Active for ML scoring' : 'Excluded from scoring model'}</span>
              <span>•</span>
              <span>Updated: Today</span>
            </div>
          </div>
        </div>

        {/* Toggle Switch */}
        <div className="ml-4 flex items-center">
          <button
            type="button"
            disabled={disabled}
            onClick={() => onToggle(item.source, !item.granted)}
            className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
              item.granted ? 'bg-cyan-500' : 'bg-slate-700'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                item.granted ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
