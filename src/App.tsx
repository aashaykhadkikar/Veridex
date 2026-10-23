import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Shell } from './components/layout/Shell';
import { LoginView } from './components/views/LoginView';
import { AdminDashboardView } from './components/views/AdminDashboardView';
import { InstitutionDashboardView } from './components/views/InstitutionDashboardView';
import { FacultyDashboardView } from './components/views/FacultyDashboardView';
import { StudentDashboardView } from './components/views/StudentDashboardView';
import { ApplicationsView } from './components/views/ApplicationsView';
import { DocumentsView } from './components/views/DocumentsView';
import { VerificationView } from './components/views/VerificationView';
import { CalendarView } from './components/views/CalendarView';
import { ReportsView } from './components/views/ReportsView';
import { ProfileView } from './components/views/ProfileView';
import { CreateApplicationModal } from './components/modals/CreateApplicationModal';
import { ApplicationDetailModal } from './components/modals/ApplicationDetailModal';
import { DocumentViewerModal } from './components/modals/DocumentViewerModal';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, activeTab, currentUser } = useApp();
  const [showCreateModal, setShowCreateModal] = useState(false);

  // If not authenticated, render LoginView
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // Redirect to role-appropriate dashboard
  const renderDashboardView = () => {
    switch (currentUser.role) {
      case 'admin':
        return <AdminDashboardView />;
      case 'institution':
        return <InstitutionDashboardView onOpenCreateModal={() => setShowCreateModal(true)} />;
      case 'faculty':
        return <FacultyDashboardView />;
      case 'student':
        return <StudentDashboardView />;
      default:
        return <AdminDashboardView />;
    }
  };

  const renderCurrentView = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboardView();
      case 'applications':
        return <ApplicationsView onOpenCreateModal={() => setShowCreateModal(true)} />;
      case 'documents':
        return <DocumentsView />;
      case 'verification':
        return <VerificationView />;
      case 'calendar':
        return <CalendarView />;
      case 'reports':
        return <ReportsView />;
      case 'profile':
      case 'settings':
        return <ProfileView />;
      default:
        return renderDashboardView();
    }
  };

  return (
    <Shell>
      {renderCurrentView()}

      {/* Modals */}
      <CreateApplicationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
      <ApplicationDetailModal />
      <DocumentViewerModal />
    </Shell>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
