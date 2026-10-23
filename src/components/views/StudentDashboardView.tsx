import React from 'react';
import {
  GraduationCap,
  FileCheck,
  CheckCircle2,
  Building2,
  Award,
  BookOpen,
  Calendar,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StudentDashboardView: React.FC = () => {
  const {
    currentUser,
    documents,
    openDocumentModal,
    openApplicationModal,
    setActiveTab,
  } = useApp();

  const studentDocs = documents.filter(
    (d) =>
      d.category === 'student_records' ||
      d.institutionOrPerson.toLowerCase().includes(currentUser.fullName.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Student Banner */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-400 shrink-0">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {currentUser.fullName}
                </h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400">
                  Student Portal
                </span>
                <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                  Enrolment Active
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-neutral-500 font-mono">
                <span>PRN: <strong className="text-neutral-800 dark:text-neutral-200">{currentUser.studentId || '2022-BTECH-CS-041'}</strong></span>
                <span>·</span>
                <span>{currentUser.course || 'B.Tech in Computer Engineering'}</span>
                <span>·</span>
                <span>{currentUser.yearSemester || 'Final Year / Semester VII'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-3.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              My Student Profile
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 mb-1 flex items-center justify-between">
            <span>Cumulative CGPA</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold font-mono text-blue-600 dark:text-blue-400">
            9.24 / 10.0
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">First Class with Distinction</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 mb-1 flex items-center justify-between">
            <span>AICTE Approval</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            Approved
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Council Regulated Program</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 mb-1 flex items-center justify-between">
            <span>NBA Accreditation</span>
            <ShieldCheck className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            Tier-I
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Washington Accord Equivalent</div>
        </div>

        <div className="p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl">
          <div className="text-neutral-500 mb-1 flex items-center justify-between">
            <span>Anti-Ragging Compliance</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold font-mono text-neutral-900 dark:text-neutral-100">
            Verified
          </div>
          <div className="text-[11px] text-neutral-400 mt-1">Annual Affidavit Recorded</div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Academic Transcript Record */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Verified Academic Transcripts & University Record
                </h2>
                <p className="text-xs text-neutral-500">
                  Ingested into AICTE National Verification Archive
                </p>
              </div>
              <button
                onClick={() => setActiveTab('documents')}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Browse Repository
              </button>
            </div>

            <div className="space-y-2.5">
              {studentDocs.length === 0 ? (
                <div className="p-6 text-center text-xs text-neutral-400">
                  No direct personal records attached.
                </div>
              ) : (
                studentDocs.map((doc) => (
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
                        Issued by: {doc.issuingAuthority} · Cert No: <span className="font-mono">{doc.certificateNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-emerald-700 dark:text-emerald-400 font-medium text-[11px] bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        Verified
                      </span>
                      <button className="px-2.5 py-1 text-xs text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded">
                        View
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Institutional Affiliation Details */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs text-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              College AICTE Regulatory Affiliation
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Your college, <strong>K.J. Somaiya College of Engineering, Mumbai</strong> (AICTE Permanent ID: 1-10972341), is an autonomous engineering institution approved by AICTE and affiliated to Somaiya Vidyavihar University. Degrees awarded under this program are recognized nationally and internationally.
            </p>
            <button
              onClick={() => openApplicationModal('app-001')}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
            >
              <span>Inspect Institutional Regulatory Approval Dossier</span>
              &rarr;
            </button>
          </div>
        </div>

        {/* Right Column: Student Safety & Welfare */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-xs text-xs space-y-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              Student Grievance & Safety
            </h3>
            <p className="text-neutral-500">
              Mandatory Anti-Ragging Committee and Internal Complaints Committee statutory filings are verified for the current academic session.
            </p>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl text-emerald-800 dark:text-emerald-300 text-[11px] font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Compliant with AICTE Gazette Regulations</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
