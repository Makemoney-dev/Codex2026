import React, { useEffect, useState } from 'react';
import { Zap, Home, Receipt, Smartphone } from 'lucide-react';
import { AlternativeDataCard } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { useInView } from '../hooks/useInView';

interface DataSourceCardProps {
  card: AlternativeDataCard;
}

export const DataSourceCard: React.FC<DataSourceCardProps> = ({ card }) => {
  const [animatedWidth, setAnimatedWidth] = useState<number>(0);
  const [cardRef, isInView] = useInView<HTMLDivElement>({ threshold: 0.15 });

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        setAnimatedWidth(card.percentage);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [card.percentage, isInView]);

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

  const getStatusBadge = (label: string) => {
    switch (label.toLowerCase()) {
      case 'excellent':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'high':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'good':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'regular':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      default:
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    }
  };

  return (
    <div ref={cardRef} className="glass-card glass-card-interactive p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/50">
            {getIcon(card.source)}
          </div>
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(
              card.status_label
            )}`}
          >
            {card.status_label}
          </span>
        </div>
        <h4 className="text-sm font-semibold text-slate-200 mb-1">{card.title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
          {card.description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-xs font-medium text-slate-400">Regularity Index</span>
          <span className="text-lg font-extrabold text-white font-mono">
            <AnimatedCounter value={card.percentage} duration={1500} suffix="%" />
          </span>
        </div>
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 to-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${animatedWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
};
