import React from 'react';
import { UserCheck } from 'lucide-react';
import { BorrowerSummary } from '../types';
import { AnimatedCounter } from './AnimatedCounter';

interface BorrowerSelectorProps {
  borrowers: BorrowerSummary[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export const BorrowerSelector: React.FC<BorrowerSelectorProps> = ({
  borrowers,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {borrowers.map((b, idx) => {
        const isSelected = b.id === selectedId;

        return (
          <button
            key={b.id}
            type="button"
            onClick={() => onSelect(b.id)}
            className={`text-left p-3.5 rounded-xl border transition-all duration-200 ${
              isSelected
                ? 'bg-cyan-950/40 border-cyan-500/70 shadow-glow-cyan scale-[1.02]'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>{b.name}</span>
                {isSelected && <UserCheck className="w-3.5 h-3.5 text-cyan-400 inline" />}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-bold font-mono ${
                  b.band.toLowerCase() === 'excellent'
                    ? 'bg-cyan-500/20 text-cyan-300'
                    : b.band.toLowerCase() === 'good'
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                <AnimatedCounter value={b.current_score} duration={1200 + idx * 80} />
              </span>
            </div>
            <p className="text-xs text-slate-400 truncate">{b.occupation}</p>
            <div className="flex items-center justify-between mt-2 text-[11px] text-slate-400">
              <span>{b.city}</span>
              <span>
                Cov: <AnimatedCounter value={b.coverage} duration={1200 + idx * 80} suffix="%" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
};
