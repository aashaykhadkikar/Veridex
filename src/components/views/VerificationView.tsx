import React, { useState } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
  Check,
  X,
  FileSearch,
  ExternalLink,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ComplianceRule } from '../../types';

export const VerificationView: React.FC = () => {
  const {
    complianceRules,
    toggleComplianceRule,
    reviewComplianceRule,
    currentUser,
    openDocumentModal,
    openApplicationModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'rules' | 'anomalies' | 'cross_checks' | 'pipeline'>('rules');
  const [selectedRuleForReview, setSelectedRuleForReview] = useState<ComplianceRule | null>(null);
  const [reviewDecisionNotes, setReviewDecisionNotes] = useState('');

  const flaggedRules = complianceRules.filter((r) => r.status === 'flagged');
  const passRules = complianceRules.filter((r) => r.status === 'pass');
  const reviewedRules = complianceRules.filter((r) => r.status === 'reviewed');

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRuleForReview || !reviewDecisionNotes.trim()) return;
    reviewComplianceRule(selectedRuleForReview.id, reviewDecisionNotes);
    setSelectedRuleForReview(null);
    setReviewDecisionNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Verification & Regulatory Compliance Scrutiny
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Automated scrutiny heuristics, cross-document discrepancy flags, and human-in-the-loop review audit
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
            Engine: VisionOCR 4.2 (Simulated)
          </span>
        </div>
      </div>

      {/* Prominent Disclaimer Card as mandated by regulatory requirements */}
      <div className="p-4 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl flex items-start gap-3 text-xs text-blue-950 dark:text-blue-200">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">
            Notice on Regulatory Scrutiny & Verification Heuristics:
          </div>
          <p className="leading-relaxed text-blue-900/90 dark:text-blue-300">
            All OCR extractions and cross-document match scores are calculated in-browser for prototype demonstration.
            <strong> Direct verification with state registries and issuers is marked as &quot;Not connected — demo simulation&quot;.</strong>
            An anomaly or discrepancy flag is strictly an indicator for scrutiny officer inquiry and does NOT constitute evidence or legal presumption of fraud. Final decisions require authorized committee concurrence.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl overflow-x-auto">
        <button
          onClick={() => setActiveTab('rules')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'rules'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <span>Statutory Compliance Rules ({complianceRules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('anomalies')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'anomalies'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          <span>Anomaly Scrutiny Queue</span>
          {flaggedRules.length > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono">
              {flaggedRules.length} Flags
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('cross_checks')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'cross_checks'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          Cross-Document Consistency Matrix
        </button>

        <button
          onClick={() => setActiveTab('pipeline')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'pipeline'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
          }`}
        >
          OCR & Field Completeness Engine
        </button>
      </div>

      {/* Rules Config View */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="text-neutral-500 text-xs">Total Active Rules</div>
              <div className="text-2xl font-bold font-mono text-neutral-900 dark:text-neutral-100 mt-1">
                {complianceRules.filter((r) => r.enabled).length}
              </div>
              <div className="text-[11px] text-neutral-400">APH 2026-27 Norms</div>
            </div>

            <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="text-neutral-500 text-xs">Flagged for Human Review</div>
              <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 mt-1">
                {flaggedRules.length}
              </div>
              <div className="text-[11px] text-neutral-400">Requires officer inquiry</div>
            </div>

            <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
              <div className="text-neutral-500 text-xs">Reviewed Decisions</div>
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-1">
                {reviewedRules.length}
              </div>
              <div className="text-[11px] text-neutral-400">Recorded in audit history</div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Configurable Regulatory Scrutiny Rules
                </h3>
                <p className="text-xs text-neutral-500">
                  Enable/disable automated checks or review rule findings
                </p>
              </div>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {complianceRules.map((rule) => (
                <div key={rule.id} className="p-4 text-xs space-y-2 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                          {rule.name}
                        </span>
                        <span className="text-[11px] font-mono text-neutral-400">·</span>
                        <span className="text-neutral-500 font-medium">Category: {rule.category}</span>
                        <span className="text-[11px] font-mono text-neutral-400">·</span>
                        <span className={`font-semibold uppercase text-[10px] px-1.5 py-0.2 rounded ${
                          rule.severity === 'high'
                            ? 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}>
                          {rule.severity} Priority
                        </span>
                      </div>

                      <p className="text-neutral-600 dark:text-neutral-400">
                        {rule.description}
                      </p>
                    </div>

                    {/* Enable/Disable Toggle */}
                    <div className="flex items-center gap-3 shrink-0">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rule.enabled}
                          onChange={() => toggleComplianceRule(rule.id)}
                          className="w-4 h-4 rounded text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500"
                        />
                        <span className="text-neutral-600 dark:text-neutral-400">
                          {rule.enabled ? 'Active' : 'Disabled'}
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Findings and evidence */}
                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-medium text-neutral-900 dark:text-neutral-100">
                        Audit Finding: {rule.explanation}
                      </div>
                      <div className="text-[11px] text-neutral-500 mt-0.5">
                        Supporting Evidence: {rule.evidence}
                      </div>
                      {rule.reviewedBy && (
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                          Reviewed by {rule.reviewedBy} on {new Date(rule.reviewedAt!).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {rule.status === 'flagged' ? (
                        <button
                          onClick={() => setSelectedRuleForReview(rule)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-md shadow-xs"
                        >
                          Review & Concur
                        </button>
                      ) : rule.status === 'reviewed' ? (
                        <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                          Reviewed
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-xs font-medium">Passed</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Anomalies Queue View */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-xs text-amber-900 dark:text-amber-200">
            <strong>Anomaly Scrutiny Queue:</strong> The items below require scrutiny committee inquiry before final EoA clearance can be sanctioned.
          </div>

          <div className="space-y-3">
            {flaggedRules.length === 0 ? (
              <div className="p-8 text-center text-neutral-400 text-xs bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
                All regulatory anomalies have been reviewed and resolved!
              </div>
            ) : (
              flaggedRules.map((r) => (
                <div
                  key={r.id}
                  className="p-4 bg-white dark:bg-neutral-900 border border-amber-300 dark:border-amber-900/60 rounded-xl shadow-xs space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                        {r.name}
                      </span>
                    </div>
                    <span className="text-amber-800 dark:text-amber-300 font-semibold bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded">
                      Open Flag
                    </span>
                  </div>

                  <p className="text-neutral-700 dark:text-neutral-300">
                    {r.explanation}
                  </p>

                  <div className="text-neutral-500 font-mono text-[11px]">
                    Extracted Proof: {r.evidence}
                  </div>

                  <div className="pt-2 flex justify-end gap-2 border-t border-neutral-100 dark:border-neutral-800">
                    <button
                      onClick={() => openApplicationModal('app-001')}
                      className="px-3 py-1 text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 rounded-md"
                    >
                      Inspect Linked Application
                    </button>
                    <button
                      onClick={() => setSelectedRuleForReview(r)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs"
                    >
                      Record Scrutiny Officer Concurrence
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Cross-Checks Matrix */}
      {activeTab === 'cross_checks' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs text-xs">
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Cross-Document Multi-Source Triangulation Matrix
            </h3>
            <p className="text-neutral-500 mt-0.5">
              Automated comparison between institutional claims and official third-party certificates
            </p>
          </div>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  Land Ownership Area vs Campus Expansion Blueprint
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  PASS (Consistent)
                </span>
              </div>
              <div className="text-neutral-600 dark:text-neutral-300">
                Source A: Revenue District Collector Land Title (32.8 Acres freehold). Source B: Proposed E&TC Classroom expansion layout (4,200 m² built up).
              </div>
              <div className="text-neutral-400 font-mono text-[11px]">
                Ground Coverage Ratio complies with Maharashtra DCR Table 14.
              </div>
            </div>

            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  Faculty Aadhaar Biometrics vs IIT Bombay Ph.D. Roster
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  PASS (Identical)
                </span>
              </div>
              <div className="text-neutral-600 dark:text-neutral-300">
                Dr. Sunita Deshmukh graduation register verified against central university degree depository (NAD/DigiLocker token matched).
              </div>
            </div>

            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  Cadre Payroll Statement vs Mandatory AICTE 1:2:6 Proportion
                </span>
                <span className="text-rose-700 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950 px-2 py-0.5 rounded">
                  ANOMALY (Shortfall)
                </span>
              </div>
              <div className="text-neutral-600 dark:text-neutral-300">
                Extracted payroll data identifies 2 Full Professors against regulatory statutory requirement of 4 for 720 intake capacity.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engine & Field Completeness */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              OCR Engine Ingestion Pipeline
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Document Classification Model</span>
                <span className="font-mono font-medium">Vision-Transformer (Simulated)</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Average Confidence Score</span>
                <span className="font-mono font-medium text-emerald-600">97.8%</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Seal & Digital Stamp Extraction</span>
                <span className="font-mono font-medium text-blue-600">Active</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-neutral-500">Direct Issuer Live Verification API</span>
                <span className="font-mono text-neutral-400">Not connected (Demo Mode)</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
              Required-Field Completeness Rate
            </h3>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Fire & Building Safety NOCs</span>
                  <span className="font-mono">100% complete</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Faculty Qualifications (Ph.D. & PG Degrees)</span>
                  <span className="font-mono">94% complete</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-[94%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span>Financial Audit Balance Sheets (UDIN Verified)</span>
                  <span className="font-mono">100% complete</span>
                </div>
                <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal for recording Officer Concurrence on an Anomaly */}
      {selectedRuleForReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-md shadow-xl p-6 text-xs">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Record Scrutiny Officer Concurrence
            </h3>
            <p className="text-neutral-500 mb-3">
              Review rule: <strong>{selectedRuleForReview.name}</strong>
            </p>

            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl mb-3 text-neutral-700 dark:text-neutral-300">
              {selectedRuleForReview.explanation}
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Reviewer Decision Notes / Resolution <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewDecisionNotes}
                  onChange={(e) => setReviewDecisionNotes(e.target.value)}
                  placeholder="Record justification (e.g. Verified recruitment advertisement published in national daily; compliance granted pending final appointment letters)..."
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setSelectedRuleForReview(null)}
                  className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Confirm & Log Decision
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
