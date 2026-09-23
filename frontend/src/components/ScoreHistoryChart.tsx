import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { ScoreHistoryItem } from '../types';

interface ScoreHistoryChartProps {
  data: ScoreHistoryItem[];
}

export const ScoreHistoryChart: React.FC<ScoreHistoryChartProps> = ({ data }) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 15, left: -15, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScore" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" vertical={false} />
          <XAxis
            dataKey="month"
            stroke="#64748b"
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
          />
          <YAxis
            domain={[500, 900]}
            stroke="#64748b"
            tickLine={false}
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            ticks={[500, 600, 700, 800, 900]}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/60 p-3 rounded-lg shadow-xl">
                    <p className="text-xs font-semibold text-slate-400">{label}</p>
                    <p className="text-lg font-bold text-cyan-400">
                      {payload[0].value} <span className="text-xs text-slate-400 font-normal">/ 900</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="#06b6d4"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorScore)"
            dot={{ r: 4, fill: '#06b6d4', stroke: '#0a0f1d', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#00f2fe', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
