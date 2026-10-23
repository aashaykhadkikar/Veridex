import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  History,
  Send,
  Upload,
  MessageSquare,
  FileCheck,
  Check,
  Building,
  User,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus } from '../../types';

export const ApplicationDetailModal: React.FC = () => {
  const {
    currentUser,
    applications,
    selectedApplicationId,
    closeApplicationModal,
    openDocumentModal,
    adminUpdateStatus,
    adminRequestCorrection,
    institutionRespondCorrection,
    submitApplication,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'scrutiny' | 'corrections' | 'history'>('overview');

  // Form states for Admin actions
  const [showAdminDecisionForm, setShowAdminDecisionForm] = useState(false);
  const [adminDecisionType, setAdminDecisionType] = useState<ApplicationStatus>('approved');
  const [adminRemarks, setAdminRemarks] = useState('');

  // Form states for Admin requesting new correction
  const [showAddCorrectionForm, setShowAddCorrectionForm] = useState(false);
  const [correctionItem, setCorrectionItem] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');

  // Form states for Institution responding to correction
  const [respondingCorrectionId, setRespondingCorrectionId] = useState<string | null>(null);
  const [institutionalResponseText, setInstitutionalResponseText] = useState('');

  if (!selectedApplicationId) return null;

  const app = applications.find((a) => a.id === selectedApplicationId);
  if (!app) return null;

  const isAdmin = currentUser.role === 'admin';
  const isInstitutionRep = currentUser.role === 'institution';

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'approved':
        return <span className="text-emerald-700 dark:text-emerald-400 font-bold text-xs bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">Approved</span>;
      case 'needs_corrections':
        return <span className="text-amber-700 dark:text-amber-400 font-bold text-xs bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md">Needs Corrections</span>;
      case 'under_review':
        return <span className="text-blue-700 dark:text-blue-400 font-bold text-xs bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">Under Review</span>;
      case 'submitted':
        return <span className="text-indigo-700 dark:text-indigo-400 font-bold text-xs bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">Submitted</span>;
      case 'rejected':
        return <span className="text-rose-700 dark:text-rose-400 font-bold text-xs bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-md">Rejected</span>;
      default:
        return <span className="text-neutral-500 font-bold text-xs bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">Draft</span>;
    }
  };

  const handleAdminDecisionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    adminUpdateStatus(app.id, adminDecisionType, adminRemarks);
    setShowAdminDecisionForm(false);
    setAdminRemarks('');
  };

  const handleCreateCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionItem.trim() || !correctionReason.trim()) return;
    adminRequestCorrection(app.id, correctionItem, correctionReason);
    setCorrectionItem('');
    setCorrectionReason('');
    setShowAddCorrectionForm(false);
  };

  const handleSendInstitutionResponse = (corrId: string) => {
    if (!institutionalResponseText.trim()) return;
    institutionRespondCorrection(app.id, corrId, institutionalResponseText);
    setInstitutionalResponseText('');
    setRespondingCorrectionId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-neutral-800 dark:text-neutral-200">
        {/* Modal Top Chrome */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-blue-700 dark:text-blue-400">
                {app.applicationNumber}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              {getStatusBadge(app.status)}
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500 font-mono">AY {app.academicYear}</span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {app.categoryTitle}
            </h2>
            <div className="text-xs text-neutral-500 mt-0.5">
              {app.institutionName} · AICTE ID: <span className="font-mono">{app.institutionId}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeApplicationModal}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Segment Controls */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-4 bg-neutral-50/70 dark:bg-neutral-900/50 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Overview & Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'documents'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <span>Required Documents</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800 font-mono">
              {app.requiredDocuments.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('scrutiny')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'scrutiny'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <span>Automated OCR & Rules Scrutiny</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-mono">
              96.8%
            </span>
          </button>
          <button
            onClick={() => setActiveTab('corrections')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'corrections'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <span>Correction Requests</span>
            {app.correctionRequests.length > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono">
                {app.correctionRequests.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'history'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Audit History Timeline
          </button>
        </div>

        {/* Modal Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
                <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider mb-2">
                  Executive Summary & Purpose
                </h3>
                <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed">
                  {app.summary}
                </p>
                {app.requestedIntakeChange && (
                  <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700 text-xs">
                    <span className="font-semibold text-neutral-600 dark:text-neutral-400">Intake / Capacity Specification:</span>{' '}
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">{app.requestedIntakeChange}</span>
                  </div>
                )}
              </div>

              {/* Progress & Assigned Officer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
                  <div className="text-xs font-semibold text-neutral-500 mb-1">
                    Scrutiny Progress State
                  </div>
                  <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
                    {app.progressPercentage}%
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-700 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${app.progressPercentage}%` }}
                    />
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Submitted: {app.submissionDate || 'Draft'} · Last Modified: {app.lastUpdated}
                  </div>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60">
                  <div className="text-xs font-semibold text-neutral-500 mb-1">
                    Designated Scrutiny Directorate
                  </div>
                  <div className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    {app.assignedOfficer || 'Regional Scrutiny Committee (WRO)'}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Jurisdiction: Western Regional Directorate, Mumbai
                  </div>
                  {app.approvalRemarks && (
                    <div className="mt-2 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Remark: {app.approvalRemarks}
                    </div>
                  )}
                </div>
              </div>

              {/* Reviewer Notes */}
              {app.reviewerNotes && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl text-xs text-amber-950 dark:text-amber-200">
                  <strong className="font-semibold block mb-1">Scrutiny Officer Directive:</strong>
                  {app.reviewerNotes}
                </div>
              )}

              {/* Draft actions if status is draft */}
              {app.status === 'draft' && isInstitutionRep && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-blue-950 dark:text-blue-200">Application in Draft Mode</div>
                    <p className="text-xs text-blue-800 dark:text-blue-300">Ready to submit for official scrutiny?</p>
                  </div>
                  <button
                    onClick={() => submitApplication(app.id)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs rounded-xl shadow-xs"
                  >
                    Submit Application
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>Checklist of required regulatory annexures:</span>
                <span>{app.requiredDocuments.length} mandatory documents</span>
              </div>

              <div className="space-y-2">
                {app.requiredDocuments.map((docReq) => (
                  <div
                    key={docReq.id}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {docReq.name}
                        </div>
                        {docReq.notes && (
                          <div className="text-[11px] text-neutral-500 mt-0.5">
                            {docReq.notes}
                          </div>
                        )}
                        {docReq.uploadedDocId && (
                          <div className="text-[11px] font-mono text-blue-600 dark:text-blue-400 mt-0.5">
                            Attached Code: {docReq.uploadedDocId}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {docReq.status === 'correction_needed' ? (
                        <span className="text-amber-700 dark:text-amber-400 font-medium text-[11px] bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                          Correction Needed
                        </span>
                      ) : docReq.status === 'verified' ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px] bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          Verified
                        </span>
                      ) : (
                        <span className="text-neutral-600 dark:text-neutral-400 font-medium text-[11px] bg-neutral-200 dark:bg-neutral-700 px-2 py-0.5 rounded">
                          Uploaded
                        </span>
                      )}

                      {docReq.uploadedDocId && (
                        <button
                          type="button"
                          onClick={() => openDocumentModal(docReq.uploadedDocId!)}
                          className="px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-md hover:bg-neutral-100 flex items-center gap-1"
                        >
                          <span>Inspect Doc</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'scrutiny' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Simulated Scrutiny Engine Output:</strong> Visual document classification, optical character extraction, and cross-document discrepancy checking performed on submitted documents.
                </div>
              </div>

              {/* Sample Extracted Key-Values */}
              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800/80 font-semibold text-xs text-neutral-900 dark:text-neutral-100">
                  Extracted Cross-Document Consistency Matrix
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  <div className="p-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Fire NOC Expiry vs Academic Approval Year
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Fire NOC (MCGM/CFO/WRO/NOC-2025/8892) expires on 11-Apr-2026. Academic term commences 1-July-2026.
                      </div>
                    </div>
                    <span className="text-amber-700 dark:text-amber-400 font-bold text-[11px] bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded shrink-0">
                      Expiry Warning
                    </span>
                  </div>

                  <div className="p-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Professor Cadre Proportion (Computer Engineering)
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Statutory requirement: 4 Professors for 720 UG intake. Extracted payroll documents only identify 2 active Professors.
                      </div>
                    </div>
                    <span className="text-rose-700 dark:text-rose-400 font-bold text-[11px] bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded shrink-0">
                      Cadre Anomaly Flag
                    </span>
                  </div>

                  <div className="p-3 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        Structural Stability PWD Certificate Validity
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        10-Year civil stability certification valid till Sept 2032. Carpet area matches approved master site plan.
                      </div>
                    </div>
                    <span className="text-emerald-700 dark:text-emerald-400 font-bold text-[11px] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded shrink-0">
                      Passed Verification
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'corrections' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Formal Correction & Clarification Items
                  </h3>
                  <p className="text-xs text-neutral-500">
                    All compliance points raised by the Scrutiny Committee must be resolved.
                  </p>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => setShowAddCorrectionForm(!showAddCorrectionForm)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-xs"
                  >
                    + Request Correction
                  </button>
                )}
              </div>

              {/* Form for Admin to add correction */}
              {showAddCorrectionForm && (
                <form
                  onSubmit={handleCreateCorrectionSubmit}
                  className="p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl space-y-3"
                >
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    Issue New Clarification / Deficiency Notice
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Subject / Document Item
                    </label>
                    <input
                      type="text"
                      required
                      value={correctionItem}
                      onChange={(e) => setCorrectionItem(e.target.value)}
                      placeholder="e.g. Land Title Demarcation or Fire Safety Renewal"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      Specific Deficiency & Required Document
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={correctionReason}
                      onChange={(e) => setCorrectionReason(e.target.value)}
                      placeholder="Explain regulatory requirement and required resolution..."
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCorrectionForm(false)}
                      className="px-3 py-1 text-xs text-neutral-600 dark:text-neutral-400"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs font-semibold text-white bg-amber-600 rounded-lg"
                    >
                      Issue Request
                    </button>
                  </div>
                </form>
              )}

              {/* Correction List */}
              {app.correctionRequests.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400 bg-neutral-50 dark:bg-neutral-800/20 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  No active correction requests recorded for this application.
                </div>
              ) : (
                <div className="space-y-3">
                  {app.correctionRequests.map((corr) => (
                    <div
                      key={corr.id}
                      className={`p-4 rounded-xl border text-xs space-y-2 ${
                        corr.resolutionStatus === 'resolved'
                          ? 'border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : 'border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100">
                          {corr.item}
                        </span>
                        <span
                          className={`font-semibold text-[11px] px-2 py-0.5 rounded ${
                            corr.resolutionStatus === 'resolved'
                              ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                              : 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                          }`}
                        >
                          {corr.resolutionStatus === 'resolved' ? 'Resolved' : 'Action Required'}
                        </span>
                      </div>

                      <div className="text-neutral-700 dark:text-neutral-300">
                        {corr.reason}
                      </div>

                      <div className="text-[11px] text-neutral-400 font-mono">
                        Requested by: {corr.requestedBy} · {new Date(corr.requestedAt).toLocaleDateString()}
                      </div>

                      {/* Institutional Resolution Display */}
                      {corr.institutionalResponse && (
                        <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700/60">
                          <div className="font-semibold text-emerald-800 dark:text-emerald-300">
                            Institutional Resolution Submitted:
                          </div>
                          <div className="text-neutral-800 dark:text-neutral-200 mt-0.5">
                            {corr.institutionalResponse}
                          </div>
                        </div>
                      )}

                      {/* Institutional Response Form */}
                      {corr.resolutionStatus === 'open' && isInstitutionRep && (
                        <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-900">
                          {respondingCorrectionId === corr.id ? (
                            <div className="space-y-2">
                              <label className="block font-semibold text-neutral-800 dark:text-neutral-200">
                                Explain Institutional Corrective Action & Document Proof:
                              </label>
                              <textarea
                                rows={2}
                                value={institutionalResponseText}
                                onChange={(e) => setInstitutionalResponseText(e.target.value)}
                                placeholder="Detail the corrective actions taken (e.g. MCGM fire renewal application receipt filed, faculty advertisement released)..."
                                className="w-full px-3 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                              />
                              <div className="flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => setRespondingCorrectionId(null)}
                                  className="px-2.5 py-1 text-neutral-600 hover:text-neutral-800"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSendInstitutionResponse(corr.id)}
                                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg"
                                >
                                  Submit Resolution & Re-queue
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setRespondingCorrectionId(corr.id);
                                setInstitutionalResponseText('');
                              }}
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-xs"
                            >
                              Respond & Submit Corrective Proof
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Full Audit Trail & Decision Milestones
              </h3>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-neutral-200 dark:before:bg-neutral-800">
                {app.history.map((hist) => (
                  <div key={hist.id} className="relative text-xs">
                    <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white dark:ring-neutral-900" />
                    <div className="flex items-center justify-between text-neutral-400 font-mono text-[11px] mb-0.5">
                      <span>{hist.actor} ({hist.actorRole})</span>
                      <span>{new Date(hist.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="font-bold text-neutral-900 dark:text-neutral-100">
                      {hist.action}
                    </div>
                    <div className="text-neutral-600 dark:text-neutral-300 mt-0.5">
                      {hist.details}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer & Admin Decision Actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-neutral-500 font-mono">
            Status: <strong className="text-neutral-800 dark:text-neutral-200 uppercase">{app.status}</strong>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-end">
            {isAdmin && !showAdminDecisionForm && (
              <>
                <button
                  onClick={() => {
                    setAdminDecisionType('under_review');
                    setShowAdminDecisionForm(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100"
                >
                  Mark Under Review
                </button>
                <button
                  onClick={() => {
                    setAdminDecisionType('needs_corrections');
                    setShowAdminDecisionForm(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 rounded-lg hover:bg-amber-100"
                >
                  Request Corrections
                </button>
                <button
                  onClick={() => {
                    setAdminDecisionType('approved');
                    setShowAdminDecisionForm(true);
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs"
                >
                  Approve Application
                </button>
                <button
                  onClick={() => {
                    setAdminDecisionType('rejected');
                    setShowAdminDecisionForm(true);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 rounded-lg hover:bg-rose-100"
                >
                  Reject
                </button>
              </>
            )}

            {showAdminDecisionForm && (
              <form onSubmit={handleAdminDecisionSubmit} className="flex items-center gap-2 flex-1 sm:max-w-md">
                <input
                  type="text"
                  required
                  value={adminRemarks}
                  onChange={(e) => setAdminRemarks(e.target.value)}
                  placeholder={`Reason for ${adminDecisionType}...`}
                  className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 rounded-lg"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shrink-0"
                >
                  Confirm {adminDecisionType.replace('_', ' ').toUpperCase()}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAdminDecisionForm(false)}
                  className="px-2 py-1 text-xs text-neutral-500"
                >
                  Cancel
                </button>
              </form>
            )}

            <button
              onClick={closeApplicationModal}
              className="px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
