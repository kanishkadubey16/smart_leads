import React from 'react';
import { Search, Download, Plus } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusChange: (val: string) => void;
  sourceFilter: string;
  onSourceChange: (val: string) => void;
  sortBy: string;
  onSortChange: (val: string) => void;
  isAdmin: boolean;
  onExport: () => void;
  onAddLead: () => void;
  leadsEmpty: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sourceFilter,
  onSourceChange,
  sortBy,
  onSortChange,
  isAdmin,
  onExport,
  onAddLead,
  leadsEmpty,
}) => {
  const selectClass =
    'px-4 py-3 bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-xl text-sm text-slate-800 font-semibold transition-all duration-200 outline-none cursor-pointer';

  return (
    <div className="flex flex-wrap items-center gap-4 justify-between">
      <div className="flex flex-1 items-center gap-3 min-w-[280px] flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-xl text-sm text-slate-800 transition-all duration-200 outline-none placeholder-slate-400"
          />
        </div>

        {/* Status Filter */}
        <select value={statusFilter} onChange={(e) => onStatusChange(e.target.value)} className={selectClass}>
          <option value="All Status">All Status</option>
          <option value="New">New</option>
          <option value="Qualified">Qualified</option>
          <option value="Contacted">Contacted</option>
          <option value="Lost">Lost</option>
        </select>

        {/* Source Filter */}
        <select value={sourceFilter} onChange={(e) => onSourceChange(e.target.value)} className={selectClass}>
          <option value="All Sources">All Sources</option>
          <option value="Email Campaign">Email Campaign</option>
          <option value="Cold Call">Cold Call</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Referral">Referral</option>
          <option value="Website">Website</option>
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)} className={selectClass}>
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {isAdmin && (
          <button
            onClick={onExport}
            disabled={leadsEmpty}
            className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 text-slate-700 font-bold text-xs rounded-xl transition-colors duration-150 cursor-pointer disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>Export</span>
          </button>
        )}

        <button
          onClick={onAddLead}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 shrink-0" />
          <span>Add Lead</span>
        </button>
      </div>
    </div>
  );
};
