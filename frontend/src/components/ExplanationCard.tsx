import React from 'react';
import { CheckCircle, AlertCircle, MinusCircle } from 'lucide-react';
import { ExplanationItem } from '../types';
import { AnimatedCounter } from './AnimatedCounter';

interface ExplanationCardProps {
  explanations: ExplanationItem[];
}

export const ExplanationCard: React.FC<ExplanationCardProps> = ({ explanations }) => {
  return (
    <div className="space-y-3">
      {explanations.map((item, idx) => {
        const isPos = item.direction === 'positive' && item.impact_points > 0;
        const isNeg = item.direction === 'negative' || item.impact_points < 0;

        return (
          <div
            key={idx}
            className={`flex items-start justify-between p-3.5 rounded-xl border transition-all duration-200 ${
              isPos
                ? 'bg-emerald-950/20 border-emerald-800/30 hover:border-emerald-700/50'
                : isNeg
                ? 'bg-rose-950/20 border-rose-800/30 hover:border-rose-700/50'
                : 'bg-slate-900/40 border-slate-800/40 hover:border-slate-700/50'
            }`}
          >
            <div className="flex items-start space-x-3 pr-2">
              <div className="mt-0.5 flex-shrink-0">
                {isPos ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : isNeg ? (
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                ) : (
                  <MinusCircle className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-medium ${
                    isPos ? 'text-slate-100' : isNeg ? 'text-slate-200' : 'text-slate-300'
                  }`}
                >
                  {item.reason}
                </p>
                <span className="text-xs text-slate-400 mt-0.5 block font-mono">
                  Signal: {item.feature_name.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            <div className="flex-shrink-0 ml-2">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold font-mono border ${
                  isPos
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : isNeg
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700'
                }`}
              >
                <AnimatedCounter
                  value={item.impact_points}
                  prefix={item.impact_points > 0 ? '+' : ''}
                  suffix=" pts"
                  duration={1200 + idx * 100}
                />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
