import React, { useState } from 'react';
import {
  X,
  FileText,
  ShieldCheck,
  AlertTriangle,
  History,
  Upload,
  Calendar,
  Building,
  CheckCircle,
  FileCode,
  Download,
  ExternalLink,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentStatus } from '../../types';

export const DocumentViewerModal: React.FC = () => {
  const {
    documents,
    selectedDocumentId,
    closeDocumentModal,
    replaceDocumentFile,
    openApplicationModal,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'preview' | 'ocr' | 'versions' | 'replace'>('preview');

  // Replace file form
  const [replacementFileName, setReplacementFileName] = useState('');
  const [replacementReason, setReplacementReason] = useState('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  if (!selectedDocumentId) return null;

  const doc = documents.find((d) => d.id === selectedDocumentId);
  if (!doc) return null;

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'valid':
        return <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-xs bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md">Valid</span>;
      case 'expiring_soon':
        return <span className="text-amber-700 dark:text-amber-400 font-semibold text-xs bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-md">Expiring Soon</span>;
      case 'expired':
        return <span className="text-rose-700 dark:text-rose-400 font-semibold text-xs bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-md">Expired</span>;
      case 'flagged':
        return <span className="text-rose-700 dark:text-rose-400 font-semibold text-xs bg-rose-50 dark:bg-rose-950/60 px-2.5 py-1 rounded-md">Flagged for Review</span>;
      default:
        return <span className="text-neutral-500 font-semibold text-xs bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-md">Missing</span>;
    }
  };

  const handleReplaceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replacementFileName.trim()) return;
    replaceDocumentFile(doc.id, replacementFileName, replacementReason);
    setUploadSuccessMessage(`Successfully uploaded version ${doc.versions.length + 1} (${replacementFileName}). Document status updated.`);
    setReplacementFileName('');
    setReplacementReason('');
    setActiveTab('versions');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-neutral-800 dark:text-neutral-200">
        {/* Modal Top Header */}
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300">
                {doc.internalCode}
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              {getStatusBadge(doc.status)}
              <span className="text-neutral-300 dark:text-neutral-700">·</span>
              <span className="text-xs text-neutral-500 capitalize">{doc.category.replace('_', ' ')}</span>
            </div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-1">
              {doc.documentName}
            </h2>
            <div className="text-xs text-neutral-500 mt-0.5">
              Subject: <strong className="text-neutral-800 dark:text-neutral-200">{doc.institutionOrPerson}</strong> · Certificate No: <span className="font-mono">{doc.certificateNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={closeDocumentModal}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Segment Controls */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-4 bg-neutral-50/70 dark:bg-neutral-900/50 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('preview')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'preview'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Visual Document Preview
          </button>
          <button
            onClick={() => setActiveTab('ocr')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ocr'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <span>Simulated OCR Extraction</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800">
              {doc.simulatedOcr.overallConfidence}%
            </span>
          </button>
          <button
            onClick={() => setActiveTab('versions')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'versions'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            <span>Version History</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-200 dark:bg-neutral-800">
              v{doc.versions.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('replace')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'replace'
                ? 'border-blue-600 text-blue-700 dark:text-blue-400'
                : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Upload / Replace File
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {/* Flag Warning if any */}
              {doc.flagReason && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl flex items-start gap-2 text-xs text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Scrutiny Alert:</strong> {doc.flagReason}
                  </div>
                </div>
              )}

              {/* Realistic Document Canvas Container */}
              <div className="bg-neutral-100 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-300 dark:border-neutral-800 flex justify-center">
                <div className="w-full max-w-xl bg-white text-neutral-900 p-8 rounded-lg shadow-md border border-neutral-200 font-sans relative">
                  {/* Watermark */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] select-none text-6xl font-black rotate-[-25deg]">
                    AICTE VALIDATED
                  </div>

                  {/* Header of official document */}
                  <div className="border-b-2 border-neutral-800 pb-4 text-center">
                    <div className="text-[10px] font-bold tracking-widest text-neutral-500 uppercase">
                      Official Government Document / Scrutiny Copy
                    </div>
                    <h3 className="text-sm font-bold tracking-tight text-neutral-900 mt-1 uppercase">
                      {doc.issuingAuthority}
                    </h3>
                    <div className="text-[11px] text-neutral-600 mt-0.5">
                      Certificate Reference: <span className="font-mono font-bold">{doc.certificateNumber}</span>
                    </div>
                  </div>

                  {/* Document Body Details */}
                  <div className="py-6 space-y-3 text-xs leading-relaxed">
                    <p>
                      <strong>Subject / Beneficiary:</strong> {doc.institutionOrPerson}
                    </p>
                    <p>
                      <strong>Document Nomenclature:</strong> {doc.documentName}
                    </p>
                    <p>
                      <strong>Internal Portal Dossier Code:</strong> <span className="font-mono">{doc.internalCode}</span>
                    </p>
                    <p className="text-neutral-700">
                      This is to certify that the regulatory clearance / educational credentials documented herein have been ingested into the AICTE National Portal for scrutiny under the statutory provisions of the Approval Process Handbook.
                    </p>

                    <div className="grid grid-cols-2 gap-4 pt-3 border-t border-neutral-200 font-mono text-[11px]">
                      <div>
                        <span className="text-neutral-500 block">Date of Issuance:</span>
                        <strong className="text-neutral-900">{doc.issueDate}</strong>
                      </div>
                      <div>
                        <span className="text-neutral-500 block">Valid Until:</span>
                        <strong className={doc.status === 'expiring_soon' ? 'text-rose-600' : 'text-neutral-900'}>
                          {doc.expiryDate}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Stamps & Signatures Footer */}
                  <div className="pt-6 border-t border-neutral-200 flex items-end justify-between">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-blue-700/60 flex items-center justify-center text-[10px] text-blue-800 font-mono font-bold text-center p-1 uppercase">
                      DIGITALLY STAMPED
                    </div>
                    <div className="text-right">
                      <div className="font-serif italic text-xs text-neutral-800">
                        Authorized Signatory
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        {doc.issuingAuthority}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Linked Application Navigation */}
              {doc.linkedApplicationNumber && (
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-neutral-500">Linked Active Application:</span>{' '}
                    <span className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
                      {doc.linkedApplicationNumber}
                    </span>
                  </div>
                  {doc.linkedApplicationId && (
                    <button
                      onClick={() => openApplicationModal(doc.linkedApplicationId!)}
                      className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-1"
                    >
                      <span>Open Application Dossier</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'ocr' && (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl text-xs text-blue-900 dark:text-blue-200">
                <strong>Simulated VisionOCR Engine:</strong> Extracted at {doc.simulatedOcr.extractedAt} with overall engine confidence of <strong>{doc.simulatedOcr.overallConfidence}%</strong>. Note: External regulatory issuer databases are simulated in this prototype.
              </div>

              <div className="border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Extracted Field Metadata
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800 text-xs">
                  {doc.simulatedOcr.fields.map((f, idx) => (
                    <div key={idx} className="p-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium text-neutral-500 text-[11px]">{f.label}</div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                          {f.extractedValue}
                        </div>
                        {f.expectedValue && (
                          <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                            Compliance Expectation: {f.expectedValue}
                          </div>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-medium text-neutral-700 dark:text-neutral-300">
                          {f.confidence}% conf
                        </span>
                        <div className="text-[11px]">
                          {f.matchStatus === 'exact' ? (
                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">Exact Match</span>
                          ) : f.matchStatus === 'partial' ? (
                            <span className="text-amber-600 dark:text-amber-400 font-medium">Partial Match</span>
                          ) : (
                            <span className="text-rose-600 dark:text-rose-400 font-medium">Discrepancy</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="space-y-3">
              {uploadSuccessMessage && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                  {uploadSuccessMessage}
                </div>
              )}

              <h3 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Document Revision & Version Audit
              </h3>

              <div className="space-y-2">
                {doc.versions.map((ver) => (
                  <div
                    key={ver.version}
                    className="p-3 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-700 dark:text-blue-400">
                          v{ver.version}.0
                        </span>
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">
                          {ver.fileName}
                        </span>
                        <span className="text-[11px] text-neutral-400">({ver.fileSize})</span>
                      </div>
                      <div className="text-neutral-500 text-[11px] mt-0.5">
                        {ver.changeSummary} · Uploaded by <strong className="text-neutral-700 dark:text-neutral-300">{ver.uploadedBy}</strong>
                      </div>
                    </div>
                    <div className="text-right text-[11px] text-neutral-400 font-mono">
                      {new Date(ver.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'replace' && (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 rounded-xl text-xs text-neutral-600 dark:text-neutral-400">
                Upload a renewed or rectified copy for internal code <strong>{doc.internalCode}</strong>. This updates the active version and logs an entry in the version history.
              </div>

              <form onSubmit={handleReplaceSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Select / Name New Mock File <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={replacementFileName}
                    onChange={(e) => setReplacementFileName(e.target.value)}
                    placeholder="e.g. fire_noc_renewed_mcgm_2026.pdf"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Summary of Renewal / Changes Made
                  </label>
                  <input
                    type="text"
                    value={replacementReason}
                    onChange={(e) => setReplacementReason(e.target.value)}
                    placeholder="e.g. Renewed annual NOC from MCGM Fire Brigade valid till April 2027"
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div className="p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl text-center">
                  <Upload className="w-6 h-6 text-neutral-400 mx-auto mb-1" />
                  <span className="text-neutral-600 dark:text-neutral-400 block font-medium">
                    Simulated Document Drag & Drop / File Selector
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    PDF, JPG, PNG up to 25MB (Fictional mock upload)
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-xs"
                >
                  Upload New Version & Clear Flags
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 flex items-center justify-between">
          <div className="text-xs text-neutral-500 font-mono">
            Internal Code: <strong className="text-neutral-900 dark:text-neutral-100">{doc.internalCode}</strong>
          </div>
          <button
            onClick={closeDocumentModal}
            className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
