import React, { useState } from 'react';
import {
  User,
  Shield,
  Building,
  GraduationCap,
  Briefcase,
  Sliders,
  Mail,
  Phone,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Camera,
  Trash2,
  Edit3,
  RotateCcw,
  LogOut,
  Info,
} from 'lucide-react';
import { useApp, calculateAgeFromDob } from '../../context/AppContext';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    updateProfile,
    allUsers,
    logout,
    resetToMockData,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [dob, setDob] = useState(currentUser.dob);
  const [gender, setGender] = useState(currentUser.gender || 'Prefer not to say');
  const [designation, setDesignation] = useState(currentUser.designation || '');
  const [department, setDepartment] = useState(currentUser.department || '');
  const [institution, setInstitution] = useState(currentUser.institution || '');
  const [studentId, setStudentId] = useState(currentUser.studentId || '');
  const [course, setCourse] = useState(currentUser.course || '');
  const [yearSemester, setYearSemester] = useState(currentUser.yearSemester || '');
  const [employeeId, setEmployeeId] = useState(currentUser.employeeId || '');

  const [avatarUrl, setAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const calculatedAge = calculateAgeFromDob(dob);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      fullName,
      email,
      phone,
      dob,
      gender: gender as any,
      designation: designation || undefined,
      department: department || undefined,
      institution: institution || undefined,
      studentId: studentId || undefined,
      course: course || undefined,
      yearSemester: yearSemester || undefined,
      employeeId: employeeId || undefined,
      avatarUrl,
    });
    setIsEditing(false);
    setFeedbackMessage('Profile information saved in local prototype store.');
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handlePhotoUploadSim = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
        updateProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setAvatarUrl('');
    updateProfile({ avatarUrl: '' });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            User Profile & Authorization Credentials
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Role-based institutional identity and simulated verification clearance
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-900"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6">
        {/* Top Avatar & Identity Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-20 h-20 rounded-2xl bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xl font-bold border-2 border-white dark:border-neutral-800 shadow-sm overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={currentUser.fullName} className="w-full h-full object-cover" />
                ) : (
                  getInitials(currentUser.fullName)
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-full shadow-xs cursor-pointer hover:bg-neutral-100">
                <Camera className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300" />
                <input type="file" accept="image/*" onChange={handlePhotoUploadSim} className="hidden" />
              </label>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {currentUser.fullName}
                </h2>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 capitalize">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-mono mt-0.5">
                Username: @{currentUser.username} · Member since {new Date(currentUser.createdAt).toLocaleDateString()}
              </p>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="text-[11px] text-rose-500 hover:underline flex items-center gap-1 mt-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove Photo
                </button>
              )}
            </div>
          </div>

          <div className="text-left sm:text-right text-xs text-neutral-500">
            <div className="font-semibold text-neutral-800 dark:text-neutral-200">
              {currentUser.role === 'admin' ? 'Statutory Scrutiny Body' : currentUser.institution}
            </div>
            {currentUser.designation && (
              <div className="text-[11px] text-neutral-400 mt-0.5">
                {currentUser.designation}
              </div>
            )}
          </div>
        </div>

        {/* Profile Details / Edit Form */}
        {!isEditing ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl space-y-2.5">
              <div className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px]">
                Personal & Contact Info
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">Email:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{currentUser.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">Phone:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100 font-mono">{currentUser.phone}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">Date of Birth:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100 font-mono">{currentUser.dob}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="text-neutral-500">Calculated Age:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100 font-mono">{calculatedAge} years</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-neutral-500">Gender:</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-100">{currentUser.gender || 'Not specified'}</span>
              </div>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 rounded-xl space-y-2.5">
              <div className="font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider text-[11px]">
                Role & Institutional Credentials
              </div>
              {currentUser.role === 'admin' && (
                <>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                    <span className="text-neutral-500">Permission Level:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{currentUser.permissionLevel}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                    <span className="text-neutral-500">Authorized Process ID:</span>
                    <span className="font-mono text-neutral-800 dark:text-neutral-200">{currentUser.authorizedProcessId}</span>
                  </div>
                </>
              )}
              {currentUser.role === 'student' && (
                <>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                    <span className="text-neutral-500">Student Roll / ID:</span>
                    <span className="font-mono font-medium">{currentUser.studentId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                    <span className="text-neutral-500">Course:</span>
                    <span className="font-medium">{currentUser.course}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                    <span className="text-neutral-500">Year / Semester:</span>
                    <span className="font-medium">{currentUser.yearSemester}</span>
                  </div>
                </>
              )}
              {currentUser.role === 'faculty' && (
                <>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                    <span className="text-neutral-500">Employee ID:</span>
                    <span className="font-mono font-medium">{currentUser.employeeId}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                    <span className="text-neutral-500">Department:</span>
                    <span className="font-medium">{currentUser.department}</span>
                  </div>
                </>
              )}
              {currentUser.institution && (
                <div className="flex justify-between py-1 border-b border-neutral-200/60 dark:border-neutral-700">
                  <span className="text-neutral-500">Institution:</span>
                  <span className="font-medium text-right line-clamp-1">{currentUser.institution}</span>
                </div>
              )}
              {currentUser.institutionId && (
                <div className="flex justify-between py-1">
                  <span className="text-neutral-500">AICTE Permanent ID:</span>
                  <span className="font-mono font-bold">{currentUser.institutionId}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Legal Name
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Date of Birth (Calculated Age: {calculatedAge} yrs)
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-neutral-200 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 text-neutral-600 hover:text-neutral-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-xs"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Prototype Account Management Notice */}
        <div className="p-4 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl text-xs text-neutral-500 space-y-2">
          <div className="flex items-center gap-2 text-neutral-700 dark:text-neutral-300 font-semibold">
            <Info className="w-4 h-4 text-blue-500" />
            <span>Prototype Account & Storage Notice:</span>
          </div>
          <p>
            Changes made to this profile or demo accounts are stored in your browser&apos;s localStorage for testing and demonstration purposes. No external user database is configured.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => {
                if (confirm('Reset all demo state back to default initial values?')) {
                  resetToMockData();
                }
              }}
              className="text-neutral-700 dark:text-neutral-300 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Demo Accounts
            </button>
            <span>·</span>
            <button
              onClick={logout}
              className="text-rose-600 hover:underline inline-flex items-center gap-1 font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out of Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
