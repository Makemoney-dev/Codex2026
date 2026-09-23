import React from 'react';

interface SimulatorSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  description: string;
  icon?: React.ReactNode;
  onChange: (val: number) => void;
}

export const SimulatorSlider: React.FC<SimulatorSliderProps> = ({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  description,
  icon,
  onChange,
}) => {
  return (
    <div className="glass-card p-5 rounded-2xl border border-slate-800/80 hover:border-slate-700/80 transition-all">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2.5">
          {icon && <div className="p-2 rounded-lg bg-slate-800/80 text-cyan-400">{icon}</div>}
          <div>
            <h4 className="text-sm font-semibold text-slate-200">{label}</h4>
            <p className="text-xs text-slate-400">{description}</p>
          </div>
        </div>
        <div className="px-3 py-1 bg-slate-800/90 border border-slate-700/70 rounded-lg text-sm font-bold font-mono text-cyan-300">
          {value}%
        </div>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
        />
        <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1.5">
          <span>{min}% (Irregular)</span>
          <span>50%</span>
          <span>{max}% (Perfect)</span>
        </div>
      </div>
    </div>
  );
};
