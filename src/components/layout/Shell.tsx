import React, { useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  FileText,
  FolderArchive,
  ShieldCheck,
  Calendar,
  BarChart3,
  User,
  Sun,
  Moon,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  RotateCcw,
  Building2,
  GraduationCap,
  Briefcase,
  Sliders,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { SimulatedBanner } from '../common/SimulatedBanner';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const {
    currentUser,
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    logout,
    switchRole,
    applications,
    documents,
    complianceRules,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetToMockData,
    openApplicationModal,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadNotifs = notifications.filter((n) => !n.read);
  const flaggedRulesCount = complianceRules.filter((r) => r.status === 'flagged').length;
  const expiringDocsCount = documents.filter((d) => d.status === 'expiring_soon' || d.status === 'expired').length;
  const needsCorrectionsCount = applications.filter((a) => a.status === 'needs_corrections').length;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: currentUser.role === 'institution' && needsCorrectionsCount > 0 ? `${needsCorrectionsCount}` : undefined },
    { id: 'applications', label: 'Applications', icon: FileText, badge: `${applications.length}` },
    { id: 'documents', label: 'Document Repository', icon: FolderArchive, badge: expiringDocsCount > 0 ? `${expiringDocsCount}` : undefined },
    { id: 'verification', label: 'Verification & Rules', icon: ShieldCheck, badge: flaggedRulesCount > 0 ? `${flaggedRulesCount} flags` : undefined },
    { id: 'calendar', label: 'Calendar & Deadlines', icon: Calendar },
    { id: 'reports', label: 'Reports & Exports', icon: BarChart3 },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-950 font-sans text-neutral-800 dark:text-neutral-200">
      {/* Simulated Verification Top Notice */}
      <SimulatedBanner />

      {/* macOS Window Title Bar */}
      <header className="h-10 bg-neutral-200/80 dark:bg-neutral-900/90 backdrop-blur border-b border-neutral-300 dark:border-neutral-800 px-4 flex items-center justify-between select-none">
        {/* macOS Traffic Lights */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-3">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 border border-rose-600/30" />
            <span className="w-3 h-3 rounded-full bg-amber-400/90 border border-amber-500/30" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 border border-emerald-600/30" />
          </div>
          <span className="text-xs font-semibold tracking-tight text-neutral-700 dark:text-neutral-300">
            AICTE National Scrutiny & Approval Portal
          </span>
          <span className="text-[11px] text-neutral-400 dark:text-neutral-500">·</span>
          <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            WRO-Mumbai Node
          </span>
        </div>

        {/* Center Title */}
        <div className="hidden md:flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Active Role:</span>
          <span className="font-semibold text-blue-700 dark:text-blue-400 capitalize">
            {currentUser.role === 'institution' ? 'Institutional Representative' : currentUser.role}
          </span>
        </div>

        {/* Right Quick Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
          </button>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <button
            onClick={() => {
              if (confirm('Reset prototype demo state to fresh default mock data?')) {
                resetToMockData();
              }
            }}
            className="text-[11px] text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            Reset Demo
          </button>
        </div>
      </header>

      {/* Main App Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0">
          {/* Logo & Portal Identity */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
                AICTE
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  Verification Portal
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Govt of India Statutory Body
                </span>
              </div>
            </div>
          </div>

          {/* Role Presentation Switcher */}
          <div className="px-3 pt-3 pb-2">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 mb-1.5 flex items-center justify-between">
              <span>Demo Role</span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-normal">Instant Switch</span>
            </div>
            <div className="grid grid-cols-2 gap-1 p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-lg text-xs">
              <button
                onClick={() => switchRole('admin')}
                className={`px-2 py-1.5 rounded font-medium text-left transition-colors flex items-center gap-1.5 ${
                  currentUser.role === 'admin'
                    ? 'bg-white dark:bg-neutral-700 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <Briefcase className="w-3 h-3 shrink-0" />
                <span className="truncate">Admin</span>
              </button>
              <button
                onClick={() => switchRole('institution')}
                className={`px-2 py-1.5 rounded font-medium text-left transition-colors flex items-center gap-1.5 ${
                  currentUser.role === 'institution'
                    ? 'bg-white dark:bg-neutral-700 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <Building2 className="w-3 h-3 shrink-0" />
                <span className="truncate">Institute</span>
              </button>
              <button
                onClick={() => switchRole('faculty')}
                className={`px-2 py-1.5 rounded font-medium text-left transition-colors flex items-center gap-1.5 ${
                  currentUser.role === 'faculty'
                    ? 'bg-white dark:bg-neutral-700 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <Sliders className="w-3 h-3 shrink-0" />
                <span className="truncate">Faculty</span>
              </button>
              <button
                onClick={() => switchRole('student')}
                className={`px-2 py-1.5 rounded font-medium text-left transition-colors flex items-center gap-1.5 ${
                  currentUser.role === 'student'
                    ? 'bg-white dark:bg-neutral-700 text-blue-700 dark:text-blue-300 shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                }`}
              >
                <GraduationCap className="w-3 h-3 shrink-0" />
                <span className="truncate">Student</span>
              </button>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
            <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300'
                      : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-blue-700 dark:text-blue-300' : 'text-neutral-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Current User Card in Sidebar Bottom */}
          <div className="p-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-semibold shrink-0">
                {currentUser.avatarUrl ? (
                  <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(currentUser.fullName)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                  {currentUser.fullName}
                </div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                  {currentUser.designation || currentUser.role}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Main Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-neutral-50 dark:bg-neutral-950">
          {/* Top Bar Contract (Single-row clean header) */}
          <header className="h-14 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 px-6 flex items-center justify-between gap-6 shrink-0">
            {/* Zone 1: Contextual Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                {activeTab.replace('_', ' ')}
              </span>
              <span>/</span>
              <span className="text-xs font-mono text-neutral-500">
                {currentUser.role === 'admin'
                  ? 'Regional Scrutiny Hub'
                  : currentUser.institution || 'Somaiya Vidyavihar'}
              </span>
            </div>

            {/* Zone 2: Search Affordance */}
            <div className="hidden lg:flex items-center flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applications, docs, codes (e.g. FAC-QUA, KJSCE)..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-600 dark:focus:ring-blue-500 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                />
              </div>
            </div>

            {/* Zone 3: Actions & Profile */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Direct Logout Button */}
              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors"
                title="Sign out and return to Login page"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="p-3 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Notifications ({unreadNotifs.length} unread)
                      </span>
                      {unreadNotifs.length > 0 && (
                        <button
                          onClick={markAllNotificationsAsRead}
                          className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-neutral-400">
                          No notifications
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markNotificationAsRead(n.id);
                              if (n.linkRoute) setActiveTab(n.linkRoute);
                              setShowNotifications(false);
                            }}
                            className={`p-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/60 cursor-pointer transition-colors ${
                              !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {n.type === 'correction_request' ? (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                                  {n.title}
                                </div>
                                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-0.5">
                                  {n.message}
                                </div>
                                <div className="text-[10px] text-neutral-400 mt-1 font-mono">
                                  {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu Dropdown */}
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-semibold">
                    {currentUser.avatarUrl ? (
                      <img src={currentUser.avatarUrl} alt={currentUser.fullName} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      getInitials(currentUser.fullName)
                    )}
                  </div>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-lg z-50 py-1 overflow-hidden">
                    <div className="px-3 py-2 border-b border-neutral-100 dark:border-neutral-800">
                      <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        {currentUser.fullName}
                      </div>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        {currentUser.email}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-xs text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <User className="w-3.5 h-3.5" />
                      My Profile & Credentials
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Reset prototype demo state to fresh default mock data?')) {
                          resetToMockData();
                        }
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-xs text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Reset Demo State
                    </button>
                    <div className="border-t border-neutral-100 dark:border-neutral-800 my-1" />
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full px-3 py-2 text-xs text-left text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* View Content Area */}
          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
