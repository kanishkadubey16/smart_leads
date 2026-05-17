import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { Lead, DashboardStats } from '../types';
import { formatDate } from '../utils/date';
import { StatsCard } from '../components/StatsCard';
import { LeadModal } from '../components/LeadModal';
import { ViewLeadModal } from '../components/ViewLeadModal';
import { LeadTable } from '../components/LeadTable';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';

const LIMIT = 6;

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const toast = useToast();

  // ─── Data State ─────────────────────────────────────────────────────────────
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<DashboardStats>({ totalLeads: 0, qualified: 0, contacted: 0, lost: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ─── Filter State ────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sourceFilter, setSourceFilter] = useState('All Sources');
  const [sortBy, setSortBy] = useState('Newest');

  // ─── Pagination State ────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // ─── Modal State ─────────────────────────────────────────────────────────────
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ─── Reset page on filter change ─────────────────────────────────────────────
  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, sourceFilter, sortBy]);

  // ─── Fetch Leads ─────────────────────────────────────────────────────────────
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/leads', {
        params: { q: searchQuery, status: statusFilter, source: sourceFilter, sort: sortBy, page, limit: LIMIT },
      });
      setLeads(response.data.leads);
      setStats(response.data.stats);
      setTotalPages(response.data.pagination.totalPages);
      setTotalCount(response.data.pagination.totalCount);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Failed to fetch leads.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [searchQuery, statusFilter, sourceFilter, sortBy, page]);

  // ─── Export CSV ───────────────────────────────────────────────────────────────
  const handleExport = () => {
    if (leads.length === 0) return;
    const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
    const rows = leads.map((l) => [l.name, l.email, l.status, l.source, formatDate(l.createdAt)]);
    const csv = 'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.map((v) => `"${v.replace(/"/g, '""')}"`).join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csv);
    link.download = `smart_leads_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('CSV exported successfully!');
  };

  // ─── Add / Edit Submit ────────────────────────────────────────────────────────
  const handleModalSubmit = async (values: { name: string; email: string; status: any; source: any }) => {
    setModalLoading(true);
    try {
      if (selectedLead) {
        // @ts-ignore
        await api.put(`/leads/${selectedLead.id || selectedLead._id}`, values);
        toast.success('Lead updated successfully!');
      } else {
        await api.post('/leads', values);
        toast.success('Lead created successfully!');
      }
      setIsModalOpen(false);
      setSelectedLead(null);
      fetchLeads();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Action failed. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  // ─── Delete ───────────────────────────────────────────────────────────────────
  const handleDeleteLead = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead? This cannot be undone.')) return;
    try {
      await api.delete(`/leads/${id}`);
      toast.success('Lead deleted successfully.');
      fetchLeads();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Delete failed. Please try again.');
    }
  };

  const isAdmin = user?.role === 'ADMIN';

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-12 py-10 flex flex-col gap-8 select-none">

      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Pipeline Overview</h1>
        <p className="text-sm font-semibold text-slate-400">Manage and track your leads</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <StatsCard label="Total Leads"  value={stats.totalLeads} iconName="Users"     colorType="blue"   subtitle="Matching current filters" />
        <StatsCard label="Qualified"    value={stats.qualified}  iconName="UserCheck" colorType="green"  subtitle="High potential prospects" />
        <StatsCard label="Contacted"    value={stats.contacted}  iconName="PhoneCall" colorType="orange" subtitle="In communication" />
        <StatsCard label="Lost"         value={stats.lost}       iconName="UserX"     colorType="red"    subtitle="Closed / Unqualified" />
      </div>

      {/* Main Card */}
      <div className="w-full bg-white border border-slate-100 shadow-md shadow-slate-100/50 rounded-2xl p-6 sm:p-8 flex flex-col gap-6">

        {/* Filter Bar */}
        <FilterBar
          searchQuery={searchQuery}    onSearchChange={setSearchQuery}
          statusFilter={statusFilter}  onStatusChange={setStatusFilter}
          sourceFilter={sourceFilter}  onSourceChange={setSourceFilter}
          sortBy={sortBy}              onSortChange={setSortBy}
          isAdmin={isAdmin}
          onExport={handleExport}
          onAddLead={() => { setSelectedLead(null); setIsModalOpen(true); }}
          leadsEmpty={leads.length === 0}
        />

        {/* Error Banner */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-between gap-3">
            <span className="text-sm font-semibold text-rose-700">{error}</span>
            <button onClick={fetchLeads} className="text-xs font-bold text-rose-600 hover:text-rose-800 underline underline-offset-2 cursor-pointer whitespace-nowrap">
              Try again
            </button>
          </div>
        )}

        {/* Lead Table */}
        {!error && (
          <LeadTable
            leads={leads}
            loading={loading}
            limit={LIMIT}
            isAdmin={isAdmin}
            onView={(lead) => { setSelectedLead(lead); setIsViewModalOpen(true); }}
            onEdit={(lead) => { setSelectedLead(lead); setIsModalOpen(true); }}
            onDelete={handleDeleteLead}
          />
        )}

        {/* Pagination */}
        {!error && !loading && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={totalCount}
            limit={LIMIT}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* Modals */}
      <ViewLeadModal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} lead={selectedLead} />
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedLead(null); }}
        onSubmit={handleModalSubmit}
        lead={selectedLead}
        loading={modalLoading}
      />
    </div>
  );
};

export default Dashboard;
