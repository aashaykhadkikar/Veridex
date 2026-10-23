import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FolderArchive,
  Search,
  Filter,
  Eye,
  ArrowUpRight,
  ShieldAlert,
  ChevronRight,
  Check,
  Building,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus, ApplicationCategory } from '../../types';

export const AdminDashboardView: React.FC = () => {
  const {
    applications,
    documents,
    complianceRules,
    activityLogs,
    openApplicationModal,
    openDocumentModal,
    setActiveTab,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Derive metrics dynamically from shared state
  const totalApps = applications.length;
  const pendingReviews = applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
  const approvedApps = applications.filter((a) => a.status === 'approved').length;
  const needsCorrectionApps = applications.filter((a) => a.status === 'needs_corrections').length;
  const expiringDocs = documents.filter((d) => d.status === 'expiring_soon' || d.status === 'expired').length;
  const flaggedRules = complianceRules.filter((r) => r.status === 'flagged').length;

  // Filtered applications list
  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.categoryTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || app.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
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
      {/* Top Welcome & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Regional Scrutiny & Approval Directorate
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Western Regional Office (WRO) · Oversight Console for Technical Higher Education
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('verification')}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            Review Compliance Rules
          </button>
          <button
            onClick={() => setActiveTab('applications')}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            Open Full Queue
          </button>
        </div>
      </div>

      {/* Summary KPI Cards Grid (Mac-inspired subtle surface) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Total Applications</span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
            {totalApps}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Across Western Region</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Pending Review</span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
            {pendingReviews}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Awaiting committee sign-off</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Needs Corrections</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {needsCorrectionApps}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Pending institutional response</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Approved EoA</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tabular-nums">
            {approvedApps}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Letters gazetted</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl col-span-2 md:col-span-1">
          <div className="flex items-center justify-between text-neutral-500 text-xs mb-2">
            <span>Expiring Documents</span>
            <FolderArchive className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums">
            {expiringDocs}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Fire NOCs & Accreditations</div>
        </div>
      </div>

      {/* Main 2-Column Split: Scrutiny Table + Side Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Applications & Scrutiny Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
            {/* Header & Filter Controls */}
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Active Applications Under Scrutiny
                </h2>
                <p className="text-xs text-neutral-500">
                  Click any row to open the complete inspection dossier & verification audit
                </p>
              </div>

              {/* Quick Filter segment */}
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="needs_corrections">Needs Corrections</option>
                  <option value="under_review">Under Review</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="eoa">Extension of Approval</option>
                  <option value="new_course">New Course</option>
                  <option value="intake_increase">Intake Expansion</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-neutral-50/70 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                    <th className="py-2.5 px-4 font-semibold">Application Number</th>
                    <th className="py-2.5 px-4 font-semibold">Institution Name</th>
                    <th className="py-2.5 px-4 font-semibold">Category</th>
                    <th className="py-2.5 px-4 font-semibold">Submitted</th>
                    <th className="py-2.5 px-4 font-semibold">Status</th>
                    <th className="py-2.5 px-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                  {filteredApps.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-neutral-400">
                        No applications matched your filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredApps.map((app) => (
                      <tr
                        key={app.id}
                        onClick={() => openApplicationModal(app.id)}
                        className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition-colors group"
                      >
                        <td className="py-3 px-4 font-mono font-medium text-neutral-900 dark:text-neutral-100 whitespace-nowrap">
                          {app.applicationNumber}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-neutral-900 dark:text-neutral-100 line-clamp-1">
                            {app.institutionName}
                          </div>
                          <div className="text-[11px] text-neutral-400 font-mono">
                            ID: {app.institutionId}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                          {app.categoryTitle}
                        </td>
                        <td className="py-3 px-4 text-neutral-500 whitespace-nowrap font-mono">
                          {app.submissionDate || 'Drafting'}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(app.status)}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openApplicationModal(app.id);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 rounded-md transition-colors"
                          >
                            <span>Inspect</span>
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
              <span>Showing {filteredApps.length} of {applications.length} applications</span>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Application Registry</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Document Expiry Alerts Bar */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Critical Document Expiries (Immediate Scrutiny Action)
                </h3>
              </div>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Browse All Documents
              </button>
            </div>

            <div className="space-y-2">
              {documents
                .filter((d) => d.status === 'expiring_soon' || d.status === 'flagged')
                .slice(0, 3)
                .map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => openDocumentModal(doc.id)}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 rounded-xl border border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {doc.internalCode}
                        </span>
                        <span className="text-[11px] text-neutral-400">·</span>
                        <span className="text-xs text-neutral-700 dark:text-neutral-300">
                          {doc.documentName}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        {doc.institutionOrPerson} · Expiry: <span className="font-mono font-medium text-rose-600 dark:text-rose-400">{doc.expiryDate}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="px-2 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md"
                    >
                      View
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Right Column: Verification Engine Status & Recent Activity Feed */}
        <div className="space-y-4">
          {/* Simulated Verification Engine Status Widget */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Automated Verification Engine
              </div>
              <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                Simulated 98.4%
              </span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              Simulated VisionOCR and cross-document integrity checks run on incoming institutional dossiers.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Active Rules Enforced</span>
                <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                  {complianceRules.filter((r) => r.enabled).length} of {complianceRules.length}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Flagged For Review</span>
                <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                  {flaggedRules} items
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-600 dark:text-neutral-400">Issuer Live API Sync</span>
                <span className="text-[11px] font-mono text-neutral-400">
                  Not connected (Demo)
                </span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('verification')}
              className="mt-4 w-full py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-medium text-xs rounded-xl transition-colors text-center"
            >
              Configure Scrutiny Rules & Anomalies
            </button>
          </div>

          {/* Recent Audit & Activity Trail */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-3">
              Recent Scrutiny Audit Trail
            </h3>

            <div className="space-y-3">
              {activityLogs.slice(0, 5).map((log) => (
                <div key={log.id} className="text-xs">
                  <div className="flex items-center justify-between text-neutral-400 text-[11px] mb-0.5">
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {log.actorName}
                    </span>
                    <span className="font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="font-medium text-neutral-900 dark:text-neutral-100">
                    {log.action}
                  </div>
                  <div className="text-neutral-500 text-[11px] line-clamp-2 mt-0.5">
                    {log.details}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveTab('reports')}
              className="mt-4 w-full py-2 text-xs text-blue-600 dark:text-blue-400 hover:underline text-center"
            >
              View Full Audit Logs & Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
