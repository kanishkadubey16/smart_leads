import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import type { Lead, DashboardStats } from '../types';
import { formatDate } from '../utils/date';
import { StatsCard } from '../components/StatsCard';
import { LeadModal } from '../components/LeadModal';
import { ViewLeadModal } from '../components/ViewLeadModal';
import { 
  Search, 
  Download, 
  Plus, 
  MoreHorizontal, 
  ChevronLeft, 
  ChevronRight, 
  Edit3, 
  Trash2, 
  RefreshCw,
  FolderOpen,
  Eye
} from 'lucide-react';


import { useAuth } from '../hooks/useAuth';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  // Leads & Stats state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    qualified: 0,
    contacted: 0,
    lost: 0,
  });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [sortBy, setSortBy] = useState('Newest');

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 6; // Matching page size in screenshot

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMenuOpenLeadId, setActionMenuOpenLeadId] = useState<string | null>(null);
  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Click outside handling for context menus
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setActionMenuOpenLeadId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch leads from mock API
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/leads', {
        params: {
          q: searchQuery,
          status: statusFilter,
          source: sourceFilter,
          sort: sortBy,
          page,
          limit,
        },
      });
      setLeads(response.data.leads);
      setStats(response.data.stats);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to fetch leads. Please check your connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Trigger refetch when filters or page changes
  useEffect(() => {
    fetchLeads();
  }, [searchQuery, statusFilter, sourceFilter, sortBy, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, sourceFilter, sortBy]);

  // Handle Export CSV
  const handleExport = () => {
    if (leads.length === 0) return;
    
    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
    const rows = leads.map(l => [l.name, l.email, l.status, l.source, formatDate(l.createdAt)]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.map(val => `"${val.replace(/"/g, '""')}"`).join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smart_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add or Edit form submit handler
  const handleModalSubmit = async (values: { name: string; email: string; status: any; source: any }) => {
    setModalLoading(true);
    try {
      if (selectedLead) {
        // Edit lead
        // @ts-ignore - Handle stale state from HMR
        await api.put(`/leads/${selectedLead.id || selectedLead._id}`, values);
      } else {
        // Add lead
        await api.post('/leads', values);
      }
      setIsModalOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Action failed');
    } finally {
      setModalLoading(false);
    }
  };

  // Delete lead handler
  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  // Get matching status color badge style
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
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 py-10 flex flex-col gap-8 select-none">
      
      {/* Title Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Pipeline Overview
          </h1>
          <p className="text-sm font-semibold text-slate-400">
            Manage and track your leads
          </p>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <StatsCard
          label="Total Leads"
          value={stats.totalLeads}
          iconName="Users"
          colorType="blue"
          subtitle="Matching current filters"
        />
        <StatsCard
          label="Qualified"
          value={stats.qualified}
          iconName="UserCheck"
          colorType="green"
          subtitle="High potential prospects"
        />
        <StatsCard
          label="Contacted"
          value={stats.contacted}
          iconName="PhoneCall"
          colorType="orange"
          subtitle="In communication"
        />
        <StatsCard
          label="Lost"
          value={stats.lost}
          iconName="UserX"
          colorType="red"
          subtitle="Closed / Unqualified"
        />
      </div>

      {/* Main Content Card Container */}
      <div className="w-full bg-white border border-slate-100 shadow-md shadow-slate-100/50 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">
        
        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex flex-1 items-center gap-3 min-w-[280px]">
            {/* Search Box */}
            <div className="relative w-full">
              <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-xl text-sm text-slate-800 transition-all duration-200 outline-none placeholder-slate-400"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-xl text-sm text-slate-800 font-semibold transition-all duration-200 outline-none cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="New">New</option>
              <option value="Qualified">Qualified</option>
              <option value="Contacted">Contacted</option>
              <option value="Lost">Lost</option>
            </select>

            {/* Source Filter */}
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-xl text-sm text-slate-800 font-semibold transition-all duration-200 outline-none cursor-pointer"
            >
              <option value="All Sources">All Sources</option>
              <option value="Email Campaign">Email Campaign</option>
              <option value="Cold Call">Cold Call</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Referral">Referral</option>
              <option value="Website">Website</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-white border border-slate-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 rounded-xl text-sm text-slate-800 font-semibold transition-all duration-200 outline-none cursor-pointer"
            >
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
            </select>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            {user?.role === 'ADMIN' && (
              <button
                onClick={handleExport}
                disabled={leads.length === 0}
                className="flex items-center justify-center gap-2 px-5 py-3 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-50 text-slate-700 font-bold text-xs rounded-xl transition-colors duration-150 cursor-pointer"
              >
                <Download className="w-4 h-4 shrink-0" />
                <span>Export</span>
              </button>
            )}

            <button
              onClick={() => {
                setSelectedLead(null);
                setIsModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-500/10 hover:shadow-blue-500/25 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
            <span className="text-sm font-semibold text-red-700">{error}</span>
            <button
              onClick={fetchLeads}
              className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-800 mt-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Leads Table Container */}
        {!error && (
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
                  // Shimmer Loading States
                  Array.from({ length: limit }).map((_, idx) => (
                    <tr key={`shimmer-${idx}`} className="animate-pulse border-b border-slate-50">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded w-28"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded w-40"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 bg-slate-100 rounded-full w-16"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded w-24"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-slate-100 rounded w-20"></div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="h-5 bg-slate-100 rounded w-6 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : leads.length === 0 ? (
                  // Empty State
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center select-none">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                          <FolderOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-base font-extrabold text-slate-800 tracking-tight mt-1">
                          No leads found
                        </h3>
                        <p className="text-xs font-semibold text-slate-400 max-w-sm">
                          Try adjusting your search terms, status filters, or add a brand new lead to the pipeline.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  // Table Content
                  leads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className="hover:bg-slate-50/50 transition-colors duration-150 border-b border-slate-50/80"
                    >
                      <td className="px-6 py-4.5 font-bold text-slate-900">
                        {lead.name}
                      </td>
                      <td className="px-6 py-4.5 text-slate-500 font-medium select-all">
                        {lead.email}
                      </td>
                      <td className="px-6 py-4.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadgeStyle(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 text-slate-500 font-medium">
                        {lead.source}
                      </td>
                      <td className="px-6 py-4.5 text-slate-400 font-semibold">
                        {formatDate(lead.createdAt)}
                      </td>
                      
                      {/* Context actions menu */}
                      <td className="px-6 py-4.5 text-right relative">
                        <div className="inline-block" ref={actionMenuOpenLeadId === lead.id ? actionMenuRef : undefined}>
                          <button
                            onClick={() => setActionMenuOpenLeadId(actionMenuOpenLeadId === lead.id ? null : lead.id)}
                            className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors duration-150 outline-none cursor-pointer"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>

                          {/* Options menu popup */}
                          {actionMenuOpenLeadId === lead.id && (
                            <div className="absolute right-6 top-8 w-40 bg-white border border-slate-100 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2 flex flex-col gap-0.5 z-30 animate-fadeIn text-left">
                              <button
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setIsViewModalOpen(true);
                                  setActionMenuOpenLeadId(null);
                                }}
                                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                              >
                                <Eye className="w-4 h-4 text-slate-600" />
                                <span>View Details</span>
                              </button>
                              
                              <button
                                onClick={() => {
                                  // @ts-ignore - Handle stale state from HMR where id might be undefined but _id exists
                                  setSelectedLead(lead);
                                  setIsModalOpen(true);
                                  setActionMenuOpenLeadId(null);
                                }}
                                className="flex items-center gap-3 w-full px-3 py-2 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4 text-slate-600" />
                                <span>Edit Lead</span>
                              </button>
                              
                              {user?.role === 'ADMIN' && (
                                <button
                                  onClick={() => {
                                    // @ts-ignore - Handle stale state from HMR
                                    handleDeleteLead(lead.id || lead._id);
                                    setActionMenuOpenLeadId(null);
                                  }}
                                  className="flex items-center gap-3 w-full px-3 py-2 hover:bg-rose-50 text-rose-600 font-semibold text-xs rounded-lg transition-colors cursor-pointer mt-0.5"
                                >
                                  <Trash2 className="w-4 h-4 text-rose-500" />
                                  <span>Delete</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Section */}
        {!error && !loading && totalCount > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-2">
            <span className="text-xs font-semibold text-slate-400">
              Showing <span className="text-slate-700 font-bold">{(page - 1) * limit + 1}</span> to{' '}
              <span className="text-slate-700 font-bold">{Math.min(page * limit, totalCount)}</span> of{' '}
              <span className="text-slate-700 font-bold">{totalCount}</span> leads
            </span>

            {/* Pagination buttons */}
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="p-2 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 text-slate-600 rounded-xl transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 shrink-0" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => setPage(pageNum)}
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
                onClick={() => setPage(page + 1)}
                className="p-2 border border-slate-200 hover:bg-slate-50 active:bg-slate-100 disabled:opacity-40 text-slate-600 rounded-xl transition-all duration-150 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4 shrink-0" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Lead Modal */}
      <ViewLeadModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        lead={selectedLead}
      />
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedLead(null);
        }}
        onSubmit={handleModalSubmit}
        lead={selectedLead}
        loading={modalLoading}
      />
    </div>
  );
};
export default Dashboard;
