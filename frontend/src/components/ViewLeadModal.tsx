import React from 'react';
import { X } from 'lucide-react';
import type { Lead } from '../types';

interface ViewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
}

export const ViewLeadModal: React.FC<ViewLeadModalProps> = ({ isOpen, onClose, lead }) => {
  if (!isOpen || !lead) return null;

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-50/80 text-blue-600 border-blue-100/50';
      case 'Qualified':
        return 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50';
      case 'Contacted':
        return 'bg-amber-50/80 text-amber-600 border-amber-100/50';
      case 'Lost':
        return 'bg-rose-50/80 text-rose-600 border-rose-100/50';
      default:
        return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 w-full max-w-md overflow-hidden flex flex-col transform transition-all animate-slideUp">
        
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Lead Details
            </h2>
            <p className="text-sm font-semibold text-slate-400">
              Quick view of prospect information.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-8 flex flex-col gap-5">
          {/* Name */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Name</span>
            <span className="text-base font-bold text-slate-900">{lead.name}</span>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email</span>
            <span className="text-base font-medium text-slate-700">{lead.email}</span>
          </div>

          {/* Status & Source Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status</span>
              <div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(lead.status)}`}>
                  {lead.status}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source</span>
              <span className="text-base font-medium text-slate-700">{lead.source}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
