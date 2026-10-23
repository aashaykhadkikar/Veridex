export type UserRole = 'admin' | 'institution' | 'faculty' | 'student';

export interface UserProfile {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  dob: string; // YYYY-MM-DD
  age?: number;
  gender?: 'Male' | 'Female' | 'Other' | 'Prefer not to say';
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;

  // Student specific
  studentId?: string;
  course?: string;
  yearSemester?: string;

  // Faculty specific
  employeeId?: string;

  // Shared Institutional info (for Student, Faculty, Institution Rep)
  institution?: string;
  institutionId?: string;
  department?: string;

  // Representative / Faculty designation
  designation?: string;

  // Admin specific
  permissionLevel?: 'Super Admin' | 'Regional Director' | 'Scrutiny Officer' | 'Compliance Auditor';
  authorizedProcessId?: string;
}

export type ApplicationCategory =
  | 'eoa'
  | 'new_course'
  | 'intake_increase'
  | 'faculty_cadre'
  | 'infrastructure_compliance';

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'needs_corrections'
  | 'approved'
  | 'rejected';

export interface RequiredDocumentItem {
  id: string;
  name: string;
  category: DocumentCategory;
  isMandatory: boolean;
  uploadedDocId?: string;
  status: 'pending' | 'uploaded' | 'verified' | 'correction_needed';
  notes?: string;
}

export interface CorrectionRequest {
  id: string;
  requestedAt: string;
  requestedBy: string;
  item: string;
  reason: string;
  resolutionStatus: 'open' | 'resolved';
  resolvedAt?: string;
  institutionalResponse?: string;
}

export interface ApplicationHistoryItem {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole;
  action: string;
  details: string;
}

export interface Application {
  id: string;
  applicationNumber: string; // e.g. AICTE/2026-27/WR/1-10972341/EOA
  institutionName: string;
  institutionId: string; // AICTE Permanent ID
  category: ApplicationCategory;
  categoryTitle: string;
  academicYear: string;
  submissionDate: string;
  lastUpdated: string;
  status: ApplicationStatus;
  progressPercentage: number;
  assignedOfficer?: string;
  summary: string;
  requestedIntakeChange?: string;
  requiredDocuments: RequiredDocumentItem[];
  correctionRequests: CorrectionRequest[];
  history: ApplicationHistoryItem[];
  reviewerNotes?: string;
  approvalRemarks?: string;
}

export type DocumentCategory =
  | 'student_records'
  | 'faculty_qualifications'
  | 'faculty_experience'
  | 'infrastructure'
  | 'institutional_approvals';

export type DocumentStatus =
  | 'valid'
  | 'expiring_soon'
  | 'expired'
  | 'missing'
  | 'flagged';

export interface DocumentVersion {
  version: number;
  uploadedAt: string;
  uploadedBy: string;
  fileName: string;
  fileSize: string;
  changeSummary: string;
}

export interface ExtractedField {
  label: string;
  extractedValue: string;
  confidence: number; // 0-100
  matchStatus: 'exact' | 'partial' | 'mismatch' | 'unverified';
  expectedValue?: string;
}

export interface ConsistencyCheck {
  id: string;
  title: string;
  sourceA: string;
  sourceB: string;
  finding: string;
  status: 'pass' | 'anomaly' | 'warning';
  evidence: string;
}

export interface DocumentItem {
  id: string;
  internalCode: string; // e.g. FAC-QUA-KAS-02
  documentName: string;
  category: DocumentCategory;
  institutionOrPerson: string;
  certificateNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string; // or 'Permanent'
  status: DocumentStatus;
  linkedApplicationId?: string;
  linkedApplicationNumber?: string;
  lastUpdated: string;
  fileType: 'PDF' | 'IMAGE' | 'DOC';
  fileSize: string;
  versions: DocumentVersion[];
  simulatedOcr: {
    engine: string;
    overallConfidence: number;
    extractedAt: string;
    documentClassification: string;
    classificationConfidence: number;
    fields: ExtractedField[];
  };
  consistencyChecks?: ConsistencyCheck[];
  flagReason?: string;
  isSimulated: boolean;
}

export interface ComplianceRule {
  id: string;
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  enabled: boolean;
  status: 'pass' | 'flagged' | 'reviewed';
  explanation: string;
  evidence: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'correction_request' | 'status_change' | 'review_update' | 'expiry_reminder';
  read: boolean;
  timestamp: string;
  targetRole?: UserRole | 'all';
  targetInstitutionId?: string;
  linkRoute?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'expiry' | 'review_deadline' | 'inspection' | 'submission_milestone';
  institution: string;
  statusText: string;
  description: string;
  urgency: 'high' | 'medium' | 'normal';
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  details: string;
  referenceId?: string;
}
