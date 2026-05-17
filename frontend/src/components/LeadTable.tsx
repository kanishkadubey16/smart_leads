import React, { useRef, useState } from 'react';
import { MoreHorizontal, Eye, Edit3, Trash2, FolderOpen } from 'lucide-react';
import type { Lead } from '../types';
import { formatDate } from '../utils/date';
import { useClickOutside } from '../hooks/useClickOutside';

interface LeadTableProps {
  leads: Lead[];
  loading: boolean;
  limit: number;
  isAdmin: boolean;
  onView: (lead: Lead) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'New':        return 'bg-blue-50/80 text-blue-600 border-blue-100/50';
    case 'Qualified':  return 'bg-emerald-50/80 text-emerald-600 border-emerald-100/50';
    case 'Contacted':  return 'bg-amber-50/80 text-amber-600 border-amber-100/50';
    case 'Lost':       return 'bg-rose-50/80 text-rose-600 border-rose-100/50';
    default:           return 'bg-slate-50 text-slate-600 border-slate-100';
  }
};

// ─── Skeleton Row ─────────────────────────────────────────────────────────────
const SkeletonRow: React.FC = () => (
  <tr className="animate-pulse border-b border-slate-50">
    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-28" /></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-40" /></td>
    <td className="px-6 py-4"><div className="h-6 bg-slate-100 rounded-full w-16" /></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24" /></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-20" /></td>
    <td className="px-6 py-4 text-right"><div className="h-5 bg-slate-100 rounded w-6 ml-auto" /></td>
  </tr>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
const EmptyState: React.FC = () => (
  <tr>
    <td colSpan={6} className="px-6 py-20 text-center select-none">
      <div className="flex flex-col items-center justify-center gap-3">
        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 border border-slate-100 shadow-inner">
          <FolderOpen className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-slate-800 tracking-tight mt-1">No leads found</h3>
        <p className="text-xs font-semibold text-slate-400 max-w-[280px]">
          Try adjusting your search or filters, or add a new lead to the pipeline.
        </p>
      </div>
    </td>
  </tr>
);

// ─── Action Menu for one row ──────────────────────────────────────────────────
interface RowMenuProps {
  lead: Lead;
  isAdmin: boolean;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const RowMenu: React.FC<RowMenuProps> = ({ isAdmin, onView, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref as React.RefObject<HTMLElement>, () => setOpen(false));

  return (
    <div className="inline-block relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors duration-150 outline-none cursor-pointer"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-6 top-8 w-40 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2 flex flex-col gap-0.5 z-30 animate-fadeIn text-left">
          <button
            onClick={() => { onView(); setOpen(false); }}
            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-slate-600" />
            <span>View Details</span>
          </button>

          <button
            onClick={() => { onEdit(); setOpen(false); }}
            className="flex items-center gap-3 w-full px-3 py-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            <Edit3 className="w-4 h-4 text-slate-600" />
            <span>Edit Lead</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => { onDelete(); setOpen(false); }}
              className="flex items-center gap-3 w-full px-3 py-2 hover:bg-rose-50 text-rose-600 font-semibold text-xs rounded-lg transition-colors cursor-pointer mt-0.5"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
              <span>Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main LeadTable ───────────────────────────────────────────────────────────
export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  loading,
  limit,
  isAdmin,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="w-full overflow-x-auto border border-slate-100 rounded-2xl">
      <table className="w-full text-left border-collapse min-w-[700px]">
        <thead>
          <tr className="bg-slate-50/50 border-b border-slate-100 text-[11px] font-bold text-slate-400 tracking-wider">
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Source</th>
            <th className="px-6 py-4">Created At</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50 text-sm font-medium text-slate-700">
          {loading ? (
            Array.from({ length: limit }).map((_, i) => <SkeletonRow key={`sk-${i}`} />)
          ) : leads.length === 0 ? (
            <EmptyState />
          ) : (
            leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-slate-50/50 transition-colors duration-150 border-b border-slate-50/80"
              >
                <td className="px-6 py-4 font-bold text-slate-900">{lead.name}</td>
                <td className="px-6 py-4 text-slate-500 font-medium select-all">{lead.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 font-medium">{lead.source}</td>
                <td className="px-6 py-4 text-slate-400 font-semibold">{formatDate(lead.createdAt)}</td>
                <td className="px-6 py-4 text-right relative">
                  <RowMenu
                    lead={lead}
                    isAdmin={isAdmin}
                    onView={() => onView(lead)}
                    onEdit={() => onEdit(lead)}
                    // @ts-ignore - handle both id and _id
                    onDelete={() => onDelete(lead.id || lead._id)}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
