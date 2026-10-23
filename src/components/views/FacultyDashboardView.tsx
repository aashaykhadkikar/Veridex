import React from 'react';
import {
  Sliders,
  FileCheck,
  Building2,
  GraduationCap,
  Calendar,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  Award,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const FacultyDashboardView: React.FC = () => {
  const {
    currentUser,
    documents,
    openDocumentModal,
    openApplicationModal,
    setActiveTab,
  } = useApp();

  // Documents related to faculty
  const facultyDocs = documents.filter(
    (d) =>
      d.category === 'faculty_qualifications' ||
      d.category === 'faculty_experience' ||
      d.institutionOrPerson.toLowerCase().includes(currentUser.fullName.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Welcome & Profile Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0">
              <Sliders className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {currentUser.fullName}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                  Faculty Portal
                </span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                  AICTE Approved Cadre
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral-500 font-mono">
                <span>Employee ID: <strong className="text-neutral-800 dark:text-neutral-200">{currentUser.employeeId || 'KJSCE-FAC-2016-084'}</strong></span>
                <span>·</span>
                <span>{currentUser.designation || 'Associate Professor'}</span>
                <span>·</span>
                <span>{currentUser.department || 'Dept. of Computer Engineering'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              My Faculty Dossier
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 mb-1 flex items-center justify-between">
            <span>Verified Degrees</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            Ph.D. & M.Tech
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">IIT Bombay (NAD Verified)</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 mb-1 flex items-center justify-between">
            <span>Approved Pay Scale</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            Level 13A
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">7th Central Pay Commission</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 mb-1 flex items-center justify-between">
            <span>Student Cadre Ratio</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl font-bold font-mono text-amber-600 dark:text-amber-400">
            1:20 SFR
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Compliance review in progress</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 mb-1 flex items-center justify-between">
            <span>Institutional Status</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            Autonomous
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">NAAC A+ Accredited</div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Faculty Documents */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Registered Qualification & Service Certificates
                </h2>
                <p className="text-xs text-neutral-500">
                  Credentials submitted to AICTE Western Regional Directorate
                </p>
              </div>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                All Documents
              </button>
            </div>

            <div className="space-y-2.5">
              {facultyDocs.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => openDocumentModal(doc.id)}
                  className="p-3.5 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-200 dark:border-neutral-700/60 flex items-center justify-between cursor-pointer hover:bg-neutral-100 transition-colors text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">
                        {doc.internalCode}
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">
                        {doc.documentName}
                      </span>
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      Issuer: {doc.issuingAuthority} · Cert Ref: <span className="font-mono">{doc.certificateNumber}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Verified
                    </span>
                    <button className="px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded">
                      Inspect
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Departmental Cadre Regularization Notice */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs text-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Departmental Cadre & Ratio Regularization (EoA 2026-27)
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              The Department of Computer Engineering is currently responding to a scrutiny inquiry regarding Professor cadre distribution. Institutional Representatives are submitting the Governing Body sanctioned recruitment timeline.
            </p>
            <button
              onClick={() => openApplicationModal('app-001')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>View Departmental Extension of Approval Dossier</span>
              &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Institutional Approvals & Faculty Conduct */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs text-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Academic Approvals Office
            </h3>
            <div className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl space-y-1">
              <div className="font-semibold text-neutral-800 dark:text-neutral-200">
                Dean of Academic Approvals
              </div>
              <div className="text-neutral-500">Prof. Arvind S. Joshi</div>
              <div className="text-[11px] font-mono text-neutral-400">arvind.joshi@somaiya.edu</div>
            </div>
            <p className="text-[11px] text-neutral-400">
              For updating research publications, patents, or NBA Tier-1 course dossiers, contact the institutional liaison office.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
