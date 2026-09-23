import React from 'react';
import { CheckCircle2, AlertTriangle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'success' | 'warning' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl bg-slate-900/95 border border-slate-700 shadow-2xl backdrop-blur-md animate-fade-in max-w-md">
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
      )}
      <p className="text-xs font-medium text-slate-200">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
