import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  UserRole,
  Application,
  DocumentItem,
  ComplianceRule,
  NotificationItem,
  CalendarEvent,
  ActivityLog,
  ApplicationCategory,
  ApplicationStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_DOCUMENTS,
  INITIAL_APPLICATIONS,
  INITIAL_COMPLIANCE_RULES,
  INITIAL_NOTIFICATIONS,
  INITIAL_CALENDAR_EVENTS,
  INITIAL_ACTIVITY_LOGS,
  APPLICATION_CATEGORY_CONFIG,
  DEMO_CREDENTIALS,
} from '../mock/initialData';

interface AppContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  activeTab: string;
  selectedApplicationId: string | null;
  selectedDocumentId: string | null;

  // Navigation & View Controls
  setActiveTab: (tab: string) => void;
  openApplicationModal: (id: string) => void;
  closeApplicationModal: () => void;
  openDocumentModal: (id: string) => void;
  closeDocumentModal: () => void;
  toggleTheme: () => void;

  // Auth & Roles
  login: (usernameOrEmail: string, password?: string) => { success: boolean; error?: string };
  logout: () => void;
  switchRole: (role: UserRole) => void;
  switchUser: (userId: string) => void;
  registerUser: (userData: Partial<UserProfile>) => { success: boolean; error?: string };
  updateProfile: (updates: Partial<UserProfile>) => void;

  // Data Collections
  applications: Application[];
  documents: DocumentItem[];
  complianceRules: ComplianceRule[];
  notifications: NotificationItem[];
  calendarEvents: CalendarEvent[];
  activityLogs: ActivityLog[];

  // Application Workflows
  createApplication: (
    category: ApplicationCategory,
    summary: string,
    requestedIntakeChange?: string
  ) => Application;
  updateApplicationDraft: (id: string, updates: Partial<Application>) => void;
  submitApplication: (id: string) => void;
  adminUpdateStatus: (
    id: string,
    status: ApplicationStatus,
    remarks?: string,
    reviewerNotes?: string
  ) => void;
  adminRequestCorrection: (appId: string, item: string, reason: string) => void;
  institutionRespondCorrection: (
    appId: string,
    correctionId: string,
    response: string,
    replacementDocId?: string
  ) => void;

  // Document Management
  addDocument: (doc: Omit<DocumentItem, 'id' | 'isSimulated' | 'versions'>) => DocumentItem;
  replaceDocumentFile: (
    docId: string,
    newFileName: string,
    changeSummary: string
  ) => void;

  // Compliance & Verification
  toggleComplianceRule: (ruleId: string) => void;
  reviewComplianceRule: (ruleId: string, notes: string) => void;

  // Notifications & Logging
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  logActivity: (action: string, details: string, referenceId?: string) => void;

  // Demo Reset
  resetToMockData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'aicte_portal_users_v3',
  CURRENT_USER_ID: 'aicte_current_user_id_v3',
  AUTH: 'aicte_is_authenticated_v3',
  THEME: 'aicte_portal_theme_v2',
  APPLICATIONS: 'aicte_portal_apps_v2',
  DOCUMENTS: 'aicte_portal_docs_v2',
  RULES: 'aicte_portal_rules_v2',
  NOTIFS: 'aicte_portal_notifs_v2',
  CALENDAR: 'aicte_portal_cal_v2',
  LOGS: 'aicte_portal_logs_v2',
};

export const calculateAgeFromDob = (dobString: string): number => {
  if (!dobString) return 0;
  const birth = new Date(dobString);
  const now = new Date('2026-10-23'); // ground to portal current time
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  return Math.max(0, age);
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Auth & User state
  const [allUsers, setAllUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse users', e);
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID) || 'usr-admin-01';
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH);
    return saved === 'true'; // Default to false so user lands on login page
  });

  // Navigation and active modal
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  // Core Data Collections
  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_APPLICATIONS;
  });

  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_DOCUMENTS;
  });

  const [complianceRules, setComplianceRules] = useState<ComplianceRule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RULES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_COMPLIANCE_RULES;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CALENDAR);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_CALENDAR_EVENTS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ACTIVITY_LOGS;
  });

  // Apply dark mode class to html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Persist storage whenever state changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(complianceRules));
  }, [complianceRules]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CALENDAR, JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(activityLogs));
  }, [activityLogs]);

  // Derived current user
  const currentUser = allUsers.find((u) => u.id === currentUserId) || allUsers[0];

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const logActivity = (action: string, details: string, referenceId?: string) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action,
      details,
      referenceId,
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Auth Operations
  const login = (usernameOrEmail: string, passwordInput?: string) => {
    const trimmedUser = usernameOrEmail.trim().toLowerCase();
    const trimmedPass = (passwordInput || '').trim();

    if (!trimmedUser || !trimmedPass) {
      return {
        success: false,
        error: 'Please enter both username and password.',
      };
    }

    // 1. Check exact predefined demo credentials
    const demoCred = DEMO_CREDENTIALS.find(
      (c) => c.username.toLowerCase() === trimmedUser || (c.role === 'admin' && trimmedUser === 'admin_venkat')
    );

    if (demoCred) {
      if (demoCred.password !== trimmedPass && trimmedPass !== 'demo1234') {
        return {
          success: false,
          error: `Incorrect password for demo account "${demoCred.username}". Required: ${demoCred.password}`,
        };
      }

      let user = allUsers.find((u) => u.username.toLowerCase() === demoCred.username.toLowerCase()) ||
                 allUsers.find((u) => u.role === demoCred.role) ||
                 INITIAL_USERS.find((u) => u.role === demoCred.role) ||
                 allUsers[0];

      setCurrentUserId(user.id);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      logActivity('User Login', `Logged in as ${user.fullName} (${user.role}).`);
      return { success: true };
    }

    // 2. Check other registered mock users
    const customUser = allUsers.find(
      (u) =>
        u.username.toLowerCase() === trimmedUser ||
        u.email.toLowerCase() === trimmedUser
    );

    if (!customUser) {
      return {
        success: false,
        error: 'Invalid credentials. User not found. Please try one of the predefined demo accounts (admin, institution, faculty, student).',
      };
    }

    // Accept custom user
    setCurrentUserId(customUser.id);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    logActivity('User Login', `Logged into demo account ${customUser.username} (${customUser.role}).`);
    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    logActivity('User Logout', `Signed out of demo session.`);
  };

  const switchRole = (role: UserRole) => {
    const targetUser = allUsers.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      setIsAuthenticated(true);
      setActiveTab('dashboard');
      logActivity('Role Switched', `Switched active demo view to ${role} (${targetUser.fullName}).`);
    }
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUserId(user.id);
      setIsAuthenticated(true);
      logActivity('User Switched', `Switched account to ${user.fullName}.`);
    }
  };

  const registerUser = (userData: Partial<UserProfile>): { success: boolean; error?: string } => {
    if (!userData.fullName || !userData.username || !userData.email || !userData.phone || !userData.dob || !userData.role) {
      return { success: false, error: 'Please provide all mandatory personal fields.' };
    }

    // Check unique username
    const normalizedUsername = userData.username.trim().toLowerCase();
    const usernameExists = allUsers.some((u) => u.username.toLowerCase() === normalizedUsername);
    if (usernameExists) {
      return { success: false, error: `Username "${userData.username}" is already taken by another demo account.` };
    }

    // Check normalized phone uniqueness (digits only comparison)
    const normalizedNewPhone = userData.phone.replace(/\D/g, '');
    const phoneExists = allUsers.some((u) => u.phone.replace(/\D/g, '') === normalizedNewPhone);
    if (phoneExists) {
      return { success: false, error: 'Phone number is already associated with an existing account.' };
    }

    const calculatedAge = calculateAgeFromDob(userData.dob);

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      fullName: userData.fullName.trim(),
      username: normalizedUsername,
      email: userData.email.trim(),
      phone: userData.phone.trim(),
      dob: userData.dob,
      age: calculatedAge,
      gender: userData.gender || 'Prefer not to say',
      role: userData.role,
      createdAt: new Date().toISOString(),
      avatarUrl: userData.avatarUrl || '',
      // Role specific fields
      studentId: userData.studentId,
      course: userData.course,
      yearSemester: userData.yearSemester,
      employeeId: userData.employeeId,
      institution: userData.institution || 'K.J. Somaiya College of Engineering, Mumbai',
      institutionId: userData.institutionId || '1-10972341',
      department: userData.department,
      designation: userData.designation,
      permissionLevel: userData.role === 'admin' ? (userData.permissionLevel || 'Scrutiny Officer') : undefined,
      authorizedProcessId: userData.role === 'admin' ? `AICTE-PROV-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    };

    setAllUsers((prev) => [...prev, newUser]);
    setCurrentUserId(newUser.id);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    logActivity('Account Created', `Created profile for ${newUser.fullName} as ${newUser.role}.`);
    return { success: true };
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setAllUsers((prev) =>
      prev.map((user) => {
        if (user.id === currentUserId) {
          const updatedDob = updates.dob || user.dob;
          const calculatedAge = calculateAgeFromDob(updatedDob);
          return {
            ...user,
            ...updates,
            dob: updatedDob,
            age: calculatedAge,
          };
        }
        return user;
      })
    );
    logActivity('Profile Updated', 'Updated account credentials and profile attributes.');
  };

  // Applications
  const openApplicationModal = (id: string) => {
    setSelectedApplicationId(id);
  };

  const closeApplicationModal = () => {
    setSelectedApplicationId(null);
  };

  const openDocumentModal = (id: string) => {
    setSelectedDocumentId(id);
  };

  const closeDocumentModal = () => {
    setSelectedDocumentId(null);
  };

  const createApplication = (
    category: ApplicationCategory,
    summary: string,
    requestedIntakeChange?: string
  ): Application => {
    const config = APPLICATION_CATEGORY_CONFIG[category];
    const categoryCode = category.toUpperCase().slice(0, 3);
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const appNumber = `AICTE/2026-27/WR/${currentUser.institutionId || '1-10972341'}/${categoryCode}-${randomSuffix}`;

    const requiredDocs = config.requiredChecklist.map((name, idx) => ({
      id: `req-${Date.now()}-${idx}`,
      name,
      category: 'infrastructure' as const,
      isMandatory: true,
      status: 'pending' as const,
    }));

    const newApp: Application = {
      id: `app-${Date.now()}`,
      applicationNumber: appNumber,
      institutionName: currentUser.institution || 'K.J. Somaiya College of Engineering, Mumbai',
      institutionId: currentUser.institutionId || '1-10972341',
      category,
      categoryTitle: config.label,
      academicYear: '2026-2027',
      submissionDate: '',
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'draft',
      progressPercentage: 15,
      summary,
      requestedIntakeChange: requestedIntakeChange || 'N/A',
      requiredDocuments: requiredDocs,
      correctionRequests: [],
      history: [
        {
          id: `hist-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: currentUser.fullName,
          actorRole: currentUser.role,
          action: 'Draft Created',
          details: `Application initiated for ${config.label}.`,
        },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);
    logActivity('Application Created', `Initiated draft for ${config.label} (${appNumber}).`, newApp.id);
    return newApp;
  };

  const updateApplicationDraft = (id: string, updates: Partial<Application>) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, ...updates, lastUpdated: new Date().toISOString().split('T')[0] } : app))
    );
  };

  const submitApplication = (id: string) => {
    const today = new Date().toISOString().split('T')[0];
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const updatedHistory = [
            ...app.history,
            {
              id: `hist-${Date.now()}`,
              timestamp: new Date().toISOString(),
              actor: currentUser.fullName,
              actorRole: currentUser.role,
              action: 'Application Submitted',
              details: 'Formally submitted for AICTE regional automated scrutiny and officer review.',
            },
          ];
          return {
            ...app,
            status: 'submitted',
            submissionDate: today,
            lastUpdated: today,
            progressPercentage: 40,
            history: updatedHistory,
          };
        }
        return app;
      })
    );

    // Add notification for admin
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'New Application Submitted',
      message: `${currentUser.institution || 'Institution'} submitted application for review.`,
      type: 'review_update',
      read: false,
      timestamp: new Date().toISOString(),
      targetRole: 'admin',
      linkRoute: 'applications',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    logActivity('Application Submitted', `Application ID ${id} submitted for regulatory review.`, id);
  };

  const adminUpdateStatus = (
    id: string,
    status: ApplicationStatus,
    remarks?: string,
    reviewerNotes?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    let progress = 50;
    if (status === 'approved') progress = 100;
    if (status === 'under_review') progress = 60;
    if (status === 'needs_corrections') progress = 70;
    if (status === 'rejected') progress = 100;

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          const historyItem = {
            id: `hist-${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor: currentUser.fullName,
            actorRole: currentUser.role,
            action: `Status Changed to ${status.replace('_', ' ').toUpperCase()}`,
            details: remarks || `Review officer updated application status to ${status}.`,
          };
          return {
            ...app,
            status,
            progressPercentage: progress,
            lastUpdated: today,
            approvalRemarks: remarks || app.approvalRemarks,
            reviewerNotes: reviewerNotes || app.reviewerNotes,
            history: [...app.history, historyItem],
          };
        }
        return app;
      })
    );

    // Notify institution
    const app = applications.find((a) => a.id === id);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `Application Status: ${status.replace('_', ' ').toUpperCase()}`,
      message: `${app?.categoryTitle || 'Application'} status updated by ${currentUser.fullName}.`,
      type: 'status_change',
      read: false,
      timestamp: new Date().toISOString(),
      targetRole: 'institution',
      targetInstitutionId: app?.institutionId,
      linkRoute: 'applications',
    };
    setNotifications((prev) => [notif, ...prev]);

    logActivity('Application Status Update', `Updated application ${id} status to ${status}.`, id);
  };

  const adminRequestCorrection = (appId: string, item: string, reason: string) => {
    const today = new Date().toISOString().split('T')[0];
    const newCorrection = {
      id: `cor-${Date.now()}`,
      requestedAt: new Date().toISOString(),
      requestedBy: `${currentUser.fullName} (${currentUser.designation || 'Reviewer'})`,
      item,
      reason,
      resolutionStatus: 'open' as const,
    };

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'needs_corrections',
            lastUpdated: today,
            correctionRequests: [...app.correctionRequests, newCorrection],
            history: [
              ...app.history,
              {
                id: `hist-${Date.now()}`,
                timestamp: new Date().toISOString(),
                actor: currentUser.fullName,
                actorRole: currentUser.role,
                action: 'Correction Requested',
                details: `Requested clarification on "${item}": ${reason}`,
              },
            ],
          };
        }
        return app;
      })
    );

    const app = applications.find((a) => a.id === appId);
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Action Required: Corrections Requested',
      message: `Correction requested for "${item}" on ${app?.applicationNumber}. Resubmit compliance documents.`,
      type: 'correction_request',
      read: false,
      timestamp: new Date().toISOString(),
      targetRole: 'institution',
      targetInstitutionId: app?.institutionId,
      linkRoute: 'applications',
    };
    setNotifications((prev) => [notif, ...prev]);

    logActivity('Correction Requested', `Requested correction on ${item} for application ${appId}.`, appId);
  };

  const institutionRespondCorrection = (
    appId: string,
    correctionId: string,
    response: string,
    replacementDocId?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedCorrections = app.correctionRequests.map((c) => {
            if (c.id === correctionId) {
              return {
                ...c,
                resolutionStatus: 'resolved' as const,
                resolvedAt: new Date().toISOString(),
                institutionalResponse: response,
              };
            }
            return c;
          });

          // Check if all corrections are now resolved
          const allResolved = updatedCorrections.every((c) => c.resolutionStatus === 'resolved');

          return {
            ...app,
            status: allResolved ? 'under_review' : 'needs_corrections',
            lastUpdated: today,
            correctionRequests: updatedCorrections,
            history: [
              ...app.history,
              {
                id: `hist-${Date.now()}`,
                timestamp: new Date().toISOString(),
                actor: currentUser.fullName,
                actorRole: currentUser.role,
                action: 'Correction Resubmitted',
                details: `Institutional response provided: "${response}". ${replacementDocId ? `Linked replacement doc ${replacementDocId}.` : ''}`,
              },
            ],
          };
        }
        return app;
      })
    );

    // Notify admin
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Correction Resubmitted by Institution',
      message: `${currentUser.institution || 'Institution'} provided resolution for correction item on ${appId}. Ready for re-scrutiny.`,
      type: 'review_update',
      read: false,
      timestamp: new Date().toISOString(),
      targetRole: 'admin',
      linkRoute: 'applications',
    };
    setNotifications((prev) => [notif, ...prev]);

    logActivity('Correction Responded', `Responded to correction on ${appId}.`, appId);
  };

  // Documents
  const addDocument = (docData: Omit<DocumentItem, 'id' | 'isSimulated' | 'versions'>): DocumentItem => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `doc-${Date.now()}`,
      isSimulated: true,
      versions: [
        {
          version: 1,
          uploadedAt: new Date().toISOString(),
          uploadedBy: currentUser.fullName,
          fileName: `${docData.internalCode.toLowerCase()}.pdf`,
          fileSize: docData.fileSize || '1.8 MB',
          changeSummary: 'Initial document upload',
        },
      ],
    };

    setDocuments((prev) => [newDoc, ...prev]);
    logActivity('Document Uploaded', `Uploaded document ${newDoc.documentName} (${newDoc.internalCode}).`, newDoc.id);
    return newDoc;
  };

  const replaceDocumentFile = (
    docId: string,
    newFileName: string,
    changeSummary: string
  ) => {
    setDocuments((prev) =>
      prev.map((doc) => {
        if (doc.id === docId) {
          const nextVersion = doc.versions.length + 1;
          const newVersion = {
            version: nextVersion,
            uploadedAt: new Date().toISOString(),
            uploadedBy: currentUser.fullName,
            fileName: newFileName,
            fileSize: '2.1 MB',
            changeSummary: changeSummary || `Version ${nextVersion} renewal upload`,
          };

          return {
            ...doc,
            status: 'valid', // reset from expiring or flagged upon replacement!
            lastUpdated: new Date().toISOString(),
            versions: [newVersion, ...doc.versions],
            flagReason: undefined,
          };
        }
        return doc;
      })
    );

    logActivity('Document Replaced', `Uploaded new version for document ${docId}.`, docId);
  };

  // Compliance Rules
  const toggleComplianceRule = (ruleId: string) => {
    setComplianceRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
    logActivity('Compliance Rule Toggled', `Toggled rule ${ruleId}.`);
  };

  const reviewComplianceRule = (ruleId: string, notes: string) => {
    setComplianceRules((prev) =>
      prev.map((r) =>
        r.id === ruleId
          ? {
              ...r,
              status: 'reviewed',
              reviewedBy: currentUser.fullName,
              reviewedAt: new Date().toISOString(),
              explanation: `${r.explanation} [Reviewer decision: ${notes}]`,
            }
          : r
      )
    );
    logActivity('Rule Human Review', `Marked compliance rule ${ruleId} reviewed with decision: "${notes}".`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Reset to initial mock data
  const resetToMockData = () => {
    setAllUsers(INITIAL_USERS);
    setCurrentUserId('usr-admin-01');
    setIsAuthenticated(true);
    setApplications(INITIAL_APPLICATIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setComplianceRules(INITIAL_COMPLIANCE_RULES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setCalendarEvents(INITIAL_CALENDAR_EVENTS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setActiveTab('dashboard');
    setSelectedApplicationId(null);
    setSelectedDocumentId(null);

    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
    localStorage.removeItem(STORAGE_KEYS.RULES);
    localStorage.removeItem(STORAGE_KEYS.NOTIFS);
    localStorage.removeItem(STORAGE_KEYS.CALENDAR);
    localStorage.removeItem(STORAGE_KEYS.LOGS);

    logActivity('Portal Reset', 'Reset all fictional records to initial prototype state.');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated,
        theme,
        activeTab,
        selectedApplicationId,
        selectedDocumentId,
        setActiveTab,
        openApplicationModal,
        closeApplicationModal,
        openDocumentModal,
        closeDocumentModal,
        toggleTheme,
        login,
        logout,
        switchRole,
        switchUser,
        registerUser,
        updateProfile,
        applications,
        documents,
        complianceRules,
        notifications,
        calendarEvents,
        activityLogs,
        createApplication,
        updateApplicationDraft,
        submitApplication,
        adminUpdateStatus,
        adminRequestCorrection,
        institutionRespondCorrection,
        addDocument,
        replaceDocumentFile,
        toggleComplianceRule,
        reviewComplianceRule,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        logActivity,
        resetToMockData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
