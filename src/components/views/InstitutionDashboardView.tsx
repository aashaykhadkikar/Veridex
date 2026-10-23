import React, { useState } from 'react';
import {
  Building2,
  PlusCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  Clock,
  FolderArchive,
  ArrowUpRight,
  Upload,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus } from '../../types';

interface InstitutionDashboardViewProps {
  onOpenCreateModal: () => void;
}

export const InstitutionDashboardView: React.FC<InstitutionDashboardViewProps> = ({
  onOpenCreateModal,
}) => {
  const {
    currentUser,
    applications,
    documents,
    openApplicationModal,
    openDocumentModal,
    setActiveTab,
  } = useApp();

  // Institution's specific applications (for K.J. Somaiya or current user's institute)
  const instId = currentUser.institutionId || '1-10972341';
  const myApplications = applications.filter((a) => a.institutionId === instId);

  // Metrics
  const totalMyApps = myApplications.length;
  const draftApps = myApplications.filter((a) => a.status === 'draft').length;
  const submittedApps = myApplications.filter((a) => a.status === 'submitted').length;
  const underReviewApps = myApplications.filter((a) => a.status === 'under_review').length;
  const needsCorrectionApps = myApplications.filter((a) => a.status === 'needs_corrections').length;

  // Active correction request applications
  const correctionNeededList = myApplications.filter((a) => a.status === 'needs_corrections');

  // Documents for this institution
  const myDocuments = documents.filter((d) =>
    d.institutionOrPerson.includes('Somaiya') ||
    d.institutionOrPerson.includes('KJSCE') ||
    d.institutionOrPerson === currentUser.fullName
  );
  const expiringDocs = myDocuments.filter((d) => d.status === 'expiring_soon' || d.status === 'flagged');

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
      {/* Institutional Banner Profile Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {currentUser.institution || 'K.J. Somaiya College of Engineering, Mumbai'}
                </h1>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                  Autonomous · NAAC A+
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                <span>AICTE Permanent ID: <strong className="text-neutral-800 dark:text-neutral-200">{instId}</strong></span>
                <span>·</span>
                <span>WRO Region: Mumbai Urban</span>
                <span>·</span>
                <span>Representative: <strong className="text-neutral-800 dark:text-neutral-200">{currentUser.fullName}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create New Application</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Alert for Corrections Needed */}
      {correctionNeededList.length > 0 && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-900/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Action Required: {correctionNeededList.length} Application Requires Document Clarification / Resubmission
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300/90 mt-0.5">
                The Regional Scrutiny Officer has requested updates for {correctionNeededList[0]?.categoryTitle}. Resolve the open correction items to resume approval review.
              </p>
            </div>
          </div>
          <button
            onClick={() => openApplicationModal(correctionNeededList[0].id)}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shrink-0"
          >
            Review & Respond
          </button>
        </div>
      )}

      {/* Metric Cards (macOS clean surface) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 text-xs mb-1">Total Dossiers</div>
          <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 tabular-nums">
            {totalMyApps}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Institutional filings</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 text-xs mb-1">Drafts In Progress</div>
          <div className="text-2xl font-bold font-mono text-neutral-600 dark:text-neutral-300 tabular-nums">
            {draftApps}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Unsubmitted</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 text-xs mb-1">Submitted</div>
          <div className="text-2xl font-bold font-mono text-indigo-600 dark:text-indigo-400 tabular-nums">
            {submittedApps}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">In scrutiny intake</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 text-xs mb-1">Under Review</div>
          <div className="text-2xl font-bold font-mono text-blue-600 dark:text-blue-400 tabular-nums">
            {underReviewApps}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Committee assessment</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl col-span-2 md:col-span-1">
          <div className="text-neutral-500 text-xs mb-1">Needs Correction</div>
          <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
            {needsCorrectionApps}
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Pending response</div>
        </div>
      </div>

      {/* Main 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Applications Table & Progress Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Institutional Submissions & Progress
                </h2>
                <p className="text-xs text-neutral-500">
                  Track stage, scrutiny comments, and document submission readiness
                </p>
              </div>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-xs text-blue-600 dark:text-blue-400 font-medium hover:underline inline-flex items-center gap-1"
              >
                <span>All Applications</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {myApplications.length === 0 ? (
                <div className="p-8 text-center text-neutral-400 text-xs">
                  No applications recorded yet. Click "Create New Application" above to begin.
                </div>
              ) : (
                myApplications.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => openApplicationModal(app.id)}
                    className="p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/40 cursor-pointer transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                            {app.applicationNumber}
                          </span>
                          <span className="text-neutral-300 dark:text-neutral-700">·</span>
                          {getStatusBadge(app.status)}
                        </div>
                        <h4 className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1">
                          {app.categoryTitle}
                        </h4>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-medium text-neutral-700 dark:text-neutral-300">
                          {app.progressPercentage}% Completed
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          Updated: {app.lastUpdated}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden mb-3">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          app.status === 'approved'
                            ? 'bg-emerald-500'
                            : app.status === 'needs_corrections'
                            ? 'bg-amber-500'
                            : 'bg-blue-600'
                        }`}
                        style={{ width: `${app.progressPercentage}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="line-clamp-1">{app.summary}</span>
                      <button
                        type="button"
                        className="text-blue-600 dark:text-blue-400 hover:underline shrink-0 ml-2"
                      >
                        Inspect Dossier &rarr;
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Mandatory Document Compliance Checklist */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Annual Statutory Compliance Checklist (2026-27 Approval Handbook)
            </h3>
            <p className="text-xs text-neutral-500 mb-3">
              Essential institution-wide certificates required to be active during scrutiny.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Municipal Fire Safety NOC</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">Expires 11-Apr-2026 (Action required)</div>
                </div>
                <button
                  onClick={() => openDocumentModal('doc-001')}
                  className="text-xs text-blue-600 hover:underline shrink-0 ml-2"
                >
                  Replace File
                </button>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Structural Safety & Occupancy</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Valid till Sept 2032 (10-Yr PWD)</div>
                </div>
                <button
                  onClick={() => openDocumentModal('doc-003')}
                  className="text-xs text-blue-600 hover:underline shrink-0 ml-2"
                >
                  View
                </button>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Faculty Cadre Ratio Statement</div>
                  <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">Flagged: 2 Professors vs 4 Required</div>
                </div>
                <button
                  onClick={() => openDocumentModal('doc-004')}
                  className="text-xs text-blue-600 hover:underline shrink-0 ml-2"
                >
                  Update
                </button>
              </div>

              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60 flex items-start justify-between">
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-neutral-100">Anti-Ragging & ICC Gazette Filings</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Affidavits signed & active</div>
                </div>
                <span className="text-xs text-emerald-600 font-medium">Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming Document Expiries & Notifications */}
        <div className="space-y-4">
          {/* Expiry Alerts */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Document Expiry Alerts</span>
              </div>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-xs text-blue-600 hover:underline"
              >
                Repository
              </button>
            </div>

            <p className="text-xs text-neutral-500 mb-3">
              Documents requiring renewal to prevent hold on Extension of Approval.
            </p>

            <div className="space-y-2">
              {expiringDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => openDocumentModal(doc.id)}
                  className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60 hover:bg-neutral-100 cursor-pointer transition-colors"
                >
                  <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                    {doc.documentName}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                    Code: {doc.internalCode}
                  </div>
                  <div className="text-[11px] text-rose-600 dark:text-rose-400 font-medium mt-1">
                    Expires on {doc.expiryDate}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact with AICTE Scrutiny Officer */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Assigned Scrutiny Directorate
            </h3>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60 text-xs">
              <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                Dr. K. Venkatraman
              </div>
              <div className="text-neutral-500 mt-0.5">
                Regional Director & Chief Scrutiny Officer
              </div>
              <div className="text-[11px] font-mono text-neutral-400 mt-1">
                Western Regional Office (WRO), Churchgate, Mumbai
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
