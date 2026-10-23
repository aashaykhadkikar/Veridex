import React, { useState } from 'react';
import {
  FileText,
  Search,
  Filter,
  PlusCircle,
  ChevronRight,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus, ApplicationCategory } from '../../types';

interface ApplicationsViewProps {
  onOpenCreateModal: () => void;
}

export const ApplicationsView: React.FC<ApplicationsViewProps> = ({ onOpenCreateModal }) => {
  const {
    currentUser,
    applications,
    openApplicationModal,
  } = useApp();

  const [statusTab, setStatusTab] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'id'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const statusOptions = [
    { id: 'all', label: 'All Applications', count: applications.length },
    { id: 'needs_corrections', label: 'Needs Corrections', count: applications.filter((a) => a.status === 'needs_corrections').length },
    { id: 'under_review', label: 'Under Review', count: applications.filter((a) => a.status === 'under_review').length },
    { id: 'submitted', label: 'Submitted', count: applications.filter((a) => a.status === 'submitted').length },
    { id: 'approved', label: 'Approved', count: applications.filter((a) => a.status === 'approved').length },
    { id: 'draft', label: 'Drafts', count: applications.filter((a) => a.status === 'draft').length },
  ];

  const filtered = applications.filter((app) => {
    const matchesStatus = statusTab === 'all' || app.status === statusTab;
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;
    const matchesSearch =
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.summary.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'progress') {
      return sortOrder === 'desc'
        ? b.progressPercentage - a.progressPercentage
        : a.progressPercentage - b.progressPercentage;
    }
    if (sortBy === 'id') {
      return sortOrder === 'desc'
        ? b.applicationNumber.localeCompare(a.applicationNumber)
        : a.applicationNumber.localeCompare(b.applicationNumber);
    }
    // Default date
    const dateA = a.submissionDate || a.lastUpdated;
    const dateB = b.submissionDate || b.lastUpdated;
    return sortOrder === 'desc'
      ? dateB.localeCompare(dateA)
      : dateA.localeCompare(dateB);
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return <span className="text-emerald-700 dark:text-emerald-400 font-medium text-xs">Approved</span>;
      case 'needs_corrections':
        return <span className="text-amber-700 dark:text-amber-400 font-medium text-xs">Needs Corrections</span>;
      case 'under_review':
        return <span className="text-blue-700 dark:text-blue-400 font-medium text-xs">Under Review</span>;
      case 'submitted':
        return <span className="text-indigo-700 dark:text-indigo-400 font-medium text-xs">Submitted</span>;
      case 'rejected':
        return <span className="text-rose-700 dark:text-rose-400 font-medium text-xs">Rejected</span>;
      default:
        return <span className="text-neutral-500 font-medium text-xs">Draft</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Institutional Applications Registry
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Central repository of approval renewal dossiers, course additions, and cadre compliance records
          </p>
        </div>

        <button
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Application Filing</span>
        </button>
      </div>

      {/* Segmented Status Tabs (macOS style zero-pill interactive filters) */}
      <div className="flex items-center gap-1 p-1 bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl overflow-x-auto">
        {statusOptions.map((tab) => {
          const isActive = statusTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-600 text-neutral-900 dark:text-neutral-100'
                  : 'bg-neutral-300/60 dark:bg-neutral-700 text-neutral-500'
              }`}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Application Number, College Name, Category, or Keywords..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Regulatory Categories</option>
            <option value="eoa">Extension of Approval (EoA)</option>
            <option value="new_course">New Course Introduction</option>
            <option value="intake_increase">Intake Expansion</option>
            <option value="faculty_cadre">Faculty Cadre Regularization</option>
            <option value="infrastructure_compliance">Infrastructure Compliance</option>
          </select>

          <button
            onClick={() => {
              if (sortBy === 'date') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('date');
                setSortOrder('desc');
              }
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
            title="Sort by date"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Date ({sortOrder})</span>
          </button>
        </div>
      </div>

      {/* Applications Data Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                <th className="py-3 px-4 font-semibold">Application Number</th>
                <th className="py-3 px-4 font-semibold">Institution Name</th>
                <th className="py-3 px-4 font-semibold">Category Title</th>
                <th className="py-3 px-4 font-semibold">Submission Date</th>
                <th className="py-3 px-4 font-semibold">Progress</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Scrutiny Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No applications found matching your criteria.
                  </td>
                </tr>
              ) : (
                sorted.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => openApplicationModal(app.id)}
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                      {app.applicationNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                        {app.institutionName}
                      </div>
                      <div className="text-[11px] text-neutral-400 font-mono">
                        AICTE ID: {app.institutionId}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                      <div>{app.categoryTitle}</div>
                      <div className="text-[11px] text-neutral-400 line-clamp-1">{app.summary}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-500 whitespace-nowrap">
                      {app.submissionDate || 'Drafting'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              app.status === 'approved'
                                ? 'bg-emerald-500'
                                : app.status === 'needs_corrections'
                                ? 'bg-amber-500'
                                : 'bg-blue-600'
                            }`}
                            style={{ width: `${app.progressPercentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] text-neutral-500">
                          {app.progressPercentage}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openApplicationModal(app.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <span>Open Details</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 bg-neutral-50/50 dark:bg-neutral-800/20 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Displaying {sorted.length} applications</span>
          <span>Shared client-side synchronization active</span>
        </div>
      </div>
    </div>
  );
};
