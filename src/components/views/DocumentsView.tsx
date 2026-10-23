import React, { useState } from 'react';
import {
  FolderArchive,
  Search,
  Filter,
  PlusCircle,
  FileText,
  AlertTriangle,
  Clock,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  Upload,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DocumentCategory, DocumentStatus, DocumentItem } from '../../types';

export const DocumentsView: React.FC = () => {
  const {
    documents,
    openDocumentModal,
    addDocument,
    openApplicationModal,
  } = useApp();

  const [categoryTab, setCategoryTab] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'expiry' | 'code'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // New Document Registration Modal State
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocCategory, setNewDocCategory] = useState<DocumentCategory>('infrastructure');
  const [newDocCode, setNewDocCode] = useState('INF-FIR-2026-09');
  const [newDocCertNum, setNewDocCertNum] = useState('');
  const [newDocAuthority, setNewDocAuthority] = useState('');
  const [newDocPerson, setNewDocPerson] = useState('');
  const [newDocIssueDate, setNewDocIssueDate] = useState('2026-01-10');
  const [newDocExpiryDate, setNewDocExpiryDate] = useState('2027-01-09');

  const categories = [
    { id: 'all', label: 'All Documents', count: documents.length },
    { id: 'infrastructure', label: 'Infrastructure & Safety', count: documents.filter((d) => d.category === 'infrastructure').length },
    { id: 'faculty_qualifications', label: 'Faculty Qualifications', count: documents.filter((d) => d.category === 'faculty_qualifications').length },
    { id: 'faculty_experience', label: 'Faculty Experience & Cadre', count: documents.filter((d) => d.category === 'faculty_experience').length },
    { id: 'institutional_approvals', label: 'Institutional Approvals & NBA', count: documents.filter((d) => d.category === 'institutional_approvals').length },
    { id: 'student_records', label: 'Student Enrolment Records', count: documents.filter((d) => d.category === 'student_records').length },
  ];

  const filtered = documents.filter((doc) => {
    const matchesCategory = categoryTab === 'all' || doc.category === categoryTab;
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    const matchesSearch =
      doc.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.internalCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.certificateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.institutionOrPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.issuingAuthority.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'code') {
      return sortOrder === 'desc'
        ? b.internalCode.localeCompare(a.internalCode)
        : a.internalCode.localeCompare(b.internalCode);
    }
    if (sortBy === 'expiry') {
      return sortOrder === 'desc'
        ? b.expiryDate.localeCompare(a.expiryDate)
        : a.expiryDate.localeCompare(b.expiryDate);
    }
    return sortOrder === 'desc'
      ? b.lastUpdated.localeCompare(a.lastUpdated)
      : a.lastUpdated.localeCompare(b.lastUpdated);
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'valid':
        return <span className="text-emerald-700 dark:text-emerald-400 font-medium text-xs">Valid</span>;
      case 'expiring_soon':
        return <span className="text-amber-700 dark:text-amber-400 font-medium text-xs">Expiring Soon</span>;
      case 'expired':
        return <span className="text-rose-700 dark:text-rose-400 font-medium text-xs">Expired</span>;
      case 'flagged':
        return <span className="text-rose-700 dark:text-rose-400 font-medium text-xs">Flagged</span>;
      default:
        return <span className="text-neutral-500 font-medium text-xs">Missing</span>;
    }
  };

  const handleRegisterDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName.trim() || !newDocCode.trim() || !newDocCertNum.trim()) return;

    addDocument({
      internalCode: newDocCode,
      documentName: newDocName,
      category: newDocCategory,
      institutionOrPerson: newDocPerson || 'K.J. Somaiya College of Engineering, Mumbai',
      certificateNumber: newDocCertNum,
      issuingAuthority: newDocAuthority || 'Designated Statutory Authority',
      issueDate: newDocIssueDate,
      expiryDate: newDocExpiryDate,
      status: 'valid',
      lastUpdated: new Date().toISOString(),
      fileType: 'PDF',
      fileSize: '2.1 MB',
      simulatedOcr: {
        engine: 'AICTE-VisionOCR v4.2 (Simulated)',
        overallConfidence: 97.5,
        extractedAt: new Date().toISOString(),
        documentClassification: newDocName,
        classificationConfidence: 98.2,
        fields: [
          { label: 'Document Name', extractedValue: newDocName, confidence: 99.0, matchStatus: 'exact' },
          { label: 'Certificate Ref', extractedValue: newDocCertNum, confidence: 98.4, matchStatus: 'exact' },
        ],
      },
    });

    setShowAddDocModal(false);
    setNewDocName('');
    setNewDocCertNum('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Searchable Document Repository
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Decentralized archive of technical credentials, municipal NOCs, land titles, and accreditation deeds
          </p>
        </div>

        <button
          onClick={() => setShowAddDocModal(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Register New Document</span>
        </button>
      </div>

      {/* Segmented Category Filter Tabs */}
      <div className="flex items-center gap-1 p-1 bg-neutral-200/80 dark:bg-neutral-800/80 rounded-xl overflow-x-auto">
        {categories.map((cat) => {
          const isActive = categoryTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setCategoryTab(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                isActive
                  ? 'bg-neutral-100 dark:bg-neutral-600 text-neutral-900 dark:text-neutral-100'
                  : 'bg-neutral-300/60 dark:bg-neutral-700 text-neutral-500'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Strip */}
      <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Document Name, Internal Code (e.g. FAC-QUA), Certificate No, or Issuer..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="valid">Valid Documents</option>
            <option value="expiring_soon">Expiring Soon</option>
            <option value="flagged">Flagged for Review</option>
            <option value="expired">Expired</option>
          </select>

          <button
            onClick={() => {
              if (sortBy === 'expiry') {
                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
              } else {
                setSortBy('expiry');
                setSortOrder('asc');
              }
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100"
            title="Sort by expiry"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Expiry ({sortOrder})</span>
          </button>
        </div>
      </div>

      {/* Document Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-neutral-50 dark:bg-neutral-800/40 border-b border-neutral-200 dark:border-neutral-800 text-neutral-500">
                <th className="py-3 px-4 font-semibold">Internal Code</th>
                <th className="py-3 px-4 font-semibold">Document Name</th>
                <th className="py-3 px-4 font-semibold">Subject / Institution</th>
                <th className="py-3 px-4 font-semibold">Official Certificate No.</th>
                <th className="py-3 px-4 font-semibold">Issuance & Expiry</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    No documents matched your repository query.
                  </td>
                </tr>
              ) : (
                sorted.map((doc) => (
                  <tr
                    key={doc.id}
                    onClick={() => openDocumentModal(doc.id)}
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-medium text-blue-700 dark:text-blue-400 whitespace-nowrap">
                      {doc.internalCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {doc.documentName}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        {doc.issuingAuthority} · {doc.fileSize}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300">
                      {doc.institutionOrPerson}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                      {doc.certificateNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] whitespace-nowrap">
                      <div className="text-neutral-500">Issued: {doc.issueDate}</div>
                      <div className={doc.status === 'expiring_soon' ? 'text-rose-600 font-semibold' : 'text-neutral-700 dark:text-neutral-300'}>
                        Expires: {doc.expiryDate}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {getStatusBadge(doc.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDocumentModal(doc.id);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
                      >
                        <span>Preview & OCR</span>
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
          <span>Total records: {sorted.length}</span>
          <span className="italic">Note: Documents stored with simulated OCR data for demo purposes.</span>
        </div>
      </div>

      {/* Modal to register new mock document */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-lg shadow-xl p-6">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 mb-1">
              Register New Document to Repository
            </h3>
            <p className="text-xs text-neutral-500 mb-4">
              Create a simulated document record with internal readable code.
            </p>

            <form onSubmit={handleRegisterDoc} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Document Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="e.g. State Pollution Control Board Consent"
                  className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Internal Readable Code <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocCode}
                    onChange={(e) => setNewDocCode(e.target.value)}
                    placeholder="e.g. INF-PCB-KAS-01"
                    className="w-full px-3 py-1.5 font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Category
                  </label>
                  <select
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="infrastructure">Infrastructure</option>
                    <option value="faculty_qualifications">Faculty Qualifications</option>
                    <option value="faculty_experience">Faculty Experience</option>
                    <option value="institutional_approvals">Institutional Approvals</option>
                    <option value="student_records">Student Records</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Official Certificate Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocCertNum}
                    onChange={(e) => setNewDocCertNum(e.target.value)}
                    placeholder="e.g. MPCB/CONSENT/2026/892"
                    className="w-full px-3 py-1.5 font-mono bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Issuing Authority
                  </label>
                  <input
                    type="text"
                    value={newDocAuthority}
                    onChange={(e) => setNewDocAuthority(e.target.value)}
                    placeholder="e.g. Maharashtra Pollution Control Board"
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={newDocIssueDate}
                    onChange={(e) => setNewDocIssueDate(e.target.value)}
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>

                <div>
                  <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={newDocExpiryDate}
                    onChange={(e) => setNewDocExpiryDate(e.target.value)}
                    placeholder="YYYY-MM-DD or Permanent"
                    className="w-full px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs"
                >
                  Save Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
