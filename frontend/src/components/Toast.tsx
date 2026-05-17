import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Single Toast Item ────────────────────────────────────────────────────────
const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const showTimer = setTimeout(() => setVisible(true), 10);
    // Animate out before removal
    const hideTimer = setTimeout(() => setVisible(false), (toast.duration || 4000) - 300);
    const removeTimer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
      clearTimeout(removeTimer);
    };
  }, [toast, onRemove]);

  const config = {
    success: {
      icon: <CheckCircle className="w-4.5 h-4.5 shrink-0" />,
      classes: 'bg-white border-l-4 border-emerald-500 text-emerald-700',
      iconClasses: 'text-emerald-500',
    },
    error: {
      icon: <XCircle className="w-4.5 h-4.5 shrink-0" />,
      classes: 'bg-white border-l-4 border-rose-500 text-rose-700',
      iconClasses: 'text-rose-500',
    },
    warning: {
      icon: <AlertTriangle className="w-4.5 h-4.5 shrink-0" />,
      classes: 'bg-white border-l-4 border-amber-500 text-amber-700',
      iconClasses: 'text-amber-500',
    },
    info: {
      icon: <Info className="w-4.5 h-4.5 shrink-0" />,
      classes: 'bg-white border-l-4 border-blue-500 text-blue-700',
      iconClasses: 'text-blue-500',
    },
  }[toast.type];

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg shadow-slate-200/60 border border-slate-100 min-w-[280px] max-w-sm transition-all duration-300 ${config.classes} ${
        visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <span className={`mt-0.5 ${config.iconClasses}`}>{config.icon}</span>
      <p className="text-sm font-semibold flex-1 leading-snug">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-0.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors shrink-0 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((type: ToastType, message: string, duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message, duration }]);
  }, []);

  const value: ToastContextValue = {
    success: (msg) => addToast('success', msg),
    error: (msg) => addToast('error', msg),
    warning: (msg) => addToast('warning', msg),
    info: (msg) => addToast('info', msg),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 items-end pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────
export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
};
