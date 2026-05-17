import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  totalCount,
  limit,
  onPageChange,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
      <span className="text-xs font-semibold text-slate-400">
        Showing <span className="text-slate-700 font-bold">{(page - 1) * limit + 1}</span> to{' '}
        <span className="text-slate-700 font-bold">{Math.min(page * limit, totalCount)}</span> of{' '}
        <span className="text-slate-700 font-bold">{totalCount}</span> leads
      </span>

      <div className="flex items-center gap-1.5">
        <button
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
          className="p-2 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 text-slate-600 rounded-xl transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <button
              key={`page-${pageNum}`}
              onClick={() => onPageChange(pageNum)}
              className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all duration-150 cursor-pointer ${
                page === pageNum
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/15'
                  : 'border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
          className="p-2 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 text-slate-600 rounded-xl transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4 shrink-0" />
        </button>
      </div>
    </div>
  );
};
