import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileText,
  FolderArchive,
  History,
  Building2,
  Calendar,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReportsView: React.FC = () => {
  const {
    applications,
    documents,
    complianceRules,
    activityLogs,
  } = useApp();

  const [dateFilter, setDateFilter] = useState<string>('all');
  const [reportType, setReportType] = useState<'applications' | 'documents' | 'audit_logs'>('applications');

  // Compute metric breakdowns
  const totalApps = applications.length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const reviewCount = applications.filter((a) => a.status === 'under_review' || a.status === 'submitted').length;
  const correctionsCount = applications.filter((a) => a.status === 'needs_corrections').length;

  const validDocs = documents.filter((d) => d.status === 'valid').length;
  const expiringDocs = documents.filter((d) => d.status === 'expiring_soon').length;
  const flaggedDocs = documents.filter((d) => d.status === 'flagged').length;

  // Browser-based CSV Export
  const handleExportCSV = () => {
    let csvContent = '';

    if (reportType === 'applications') {
      csvContent += 'Application Number,Institution Name,Institution ID,Category,Submission Date,Status,Progress Percentage,Summary\n';
      applications.forEach((a) => {
        csvContent += `"${a.applicationNumber}","${a.institutionName}","${a.institutionId}","${a.categoryTitle}","${a.submissionDate || 'Draft'}","${a.status}","${a.progressPercentage}%","${a.summary.replace(/"/g, '""')}"\n`;
      });
    } else if (reportType === 'documents') {
      csvContent += 'Internal Document Code,Document Name,Category,Beneficiary / Institution,Official Certificate Number,Issue Date,Expiry Date,Status,Linked Application\n';
      documents.forEach((d) => {
        csvContent += `"${d.internalCode}","${d.documentName}","${d.category}","${d.institutionOrPerson}","${d.certificateNumber}","${d.issueDate}","${d.expiryDate}","${d.status}","${d.linkedApplicationNumber || 'N/A'}"\n`;
      });
    } else {
      csvContent += 'Timestamp,Actor Name,Actor Role,Action,Details,Reference ID\n';
      activityLogs.forEach((l) => {
        csvContent += `"${l.timestamp}","${l.actorName}","${l.actorRole}","${l.action}","${l.details.replace(/"/g, '""')}","${l.referenceId || ''}"\n`;
      });
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aicte_export_${reportType}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Regulatory Analytics & Audit Reports
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Regional scrutiny metrics, compliance outcome forecasts, and client-side data export
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export {reportType.replace('_', ' ').toUpperCase()} (CSV)</span>
        </button>
      </div>

      {/* Analytics Summary Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Application Status Distribution */}
        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Applications Status Distribution
            </h3>
            <span className="text-xs font-mono text-neutral-500">Total: {totalApps}</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Approved ({approvedCount})</span>
                <span className="font-mono">{Math.round((approvedCount / (totalApps || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(approvedCount / (totalApps || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-blue-700 dark:text-blue-400 font-medium">Under Review / Submitted ({reviewCount})</span>
                <span className="font-mono">{Math.round((reviewCount / (totalApps || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full"
                  style={{ width: `${(reviewCount / (totalApps || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-amber-700 dark:text-amber-400 font-medium">Needs Corrections ({correctionsCount})</span>
                <span className="font-mono">{Math.round((correctionsCount / (totalApps || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(correctionsCount / (totalApps || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Document Validity & Integrity Forecast */}
        <div className="p-5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Document Validity Health
            </h3>
            <span className="text-xs font-mono text-neutral-500">Total: {documents.length}</span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-emerald-700 dark:text-emerald-400 font-medium">Fully Valid ({validDocs})</span>
                <span className="font-mono">{Math.round((validDocs / (documents.length || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(validDocs / (documents.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-amber-700 dark:text-amber-400 font-medium">Expiring Soon ({expiringDocs})</span>
                <span className="font-mono">{Math.round((expiringDocs / (documents.length || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full"
                  style={{ width: `${(expiringDocs / (documents.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-rose-700 dark:text-rose-400 font-medium">Flagged Anomaly ({flaggedDocs})</span>
                <span className="font-mono">{Math.round((flaggedDocs / (documents.length || 1)) * 100)}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full rounded-full"
                  style={{ width: `${(flaggedDocs / (documents.length || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Type Selector Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl overflow-x-auto">
        <button
          onClick={() => setReportType('applications')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            reportType === 'applications'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Application Status Summary Table
        </button>
        <button
          onClick={() => setReportType('documents')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            reportType === 'documents'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Document Expiry & Verification Findings
        </button>
        <button
          onClick={() => setReportType('audit_logs')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            reportType === 'audit_logs'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Chronological Audit Activity Log
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
            {reportType.replace('_', ' ')} Records
          </span>
          <span className="text-xs text-neutral-500">
            Ready for live browser CSV download
          </span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'applications' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                  <th className="py-2.5 px-4 font-semibold">Application Number</th>
                  <th className="py-2.5 px-4 font-semibold">Institution</th>
                  <th className="py-2.5 px-4 font-semibold">Category</th>
                  <th className="py-2.5 px-4 font-semibold">Submitted</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-bold">{app.applicationNumber}</td>
                    <td className="py-3 px-4 font-sans">{app.institutionName}</td>
                    <td className="py-3 px-4 font-sans">{app.categoryTitle}</td>
                    <td className="py-3 px-4">{app.submissionDate || 'Draft'}</td>
                    <td className="py-3 px-4 uppercase text-[11px] font-sans font-medium">{app.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'documents' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                  <th className="py-2.5 px-4 font-semibold">Internal Code</th>
                  <th className="py-2.5 px-4 font-semibold">Document Name</th>
                  <th className="py-2.5 px-4 font-semibold">Beneficiary / College</th>
                  <th className="py-2.5 px-4 font-semibold">Certificate Number</th>
                  <th className="py-2.5 px-4 font-semibold">Expiry Date</th>
                  <th className="py-2.5 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                {documents.map((d) => (
                  <tr key={d.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-bold text-blue-600">{d.internalCode}</td>
                    <td className="py-3 px-4 font-sans">{d.documentName}</td>
                    <td className="py-3 px-4 font-sans">{d.institutionOrPerson}</td>
                    <td className="py-3 px-4">{d.certificateNumber}</td>
                    <td className="py-3 px-4">{d.expiryDate}</td>
                    <td className="py-3 px-4 uppercase text-[11px] font-sans font-medium">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'audit_logs' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                  <th className="py-2.5 px-4 font-semibold">Timestamp</th>
                  <th className="py-2.5 px-4 font-semibold">Actor Name</th>
                  <th className="py-2.5 px-4 font-semibold">Role</th>
                  <th className="py-2.5 px-4 font-semibold">Action Performed</th>
                  <th className="py-2.5 px-4 font-semibold">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {activityLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-medium">{l.actorName}</td>
                    <td className="py-3 px-4 font-mono text-[11px] capitalize">{l.actorRole}</td>
                    <td className="py-3 px-4 font-semibold">{l.action}</td>
                    <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">{l.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
