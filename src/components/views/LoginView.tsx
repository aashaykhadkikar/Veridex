import React, { useState } from 'react';
import {
  Shield,
  Eye,
  EyeOff,
  User,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Building2,
  Briefcase,
  Sliders,
  GraduationCap,
  Copy,
  Info,
  Check,
} from 'lucide-react';
import { useApp, calculateAgeFromDob } from '../../context/AppContext';
import { DEMO_CREDENTIALS } from '../../mock/initialData';
import { UserRole } from '../../types';

export const LoginView: React.FC = () => {
  const { login, registerUser } = useApp();

  // Form State
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('Admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Registration State
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regDob, setRegDob] = useState('1998-05-15');
  const [regGender, setRegGender] = useState<'Male' | 'Female' | 'Other' | 'Prefer not to say'>('Male');
  const [regRole, setRegRole] = useState<UserRole>('institution');
  const [regDesignation, setRegDesignation] = useState('Academic Coordinator');
  const [regInstitution, setRegInstitution] = useState('K.J. Somaiya College of Engineering, Mumbai');
  const [regStudentId, setRegStudentId] = useState('2023-BTECH-CS-089');
  const [regCourse, setRegCourse] = useState('B.Tech in Artificial Intelligence');
  const [regEmployeeId, setRegEmployeeId] = useState('KJSCE-FAC-2023-102');
  const [regDepartment, setRegDepartment] = useState('Computer Engineering');
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  const calculatedAge = calculateAgeFromDob(regDob);

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser) {
      setErrorMessage('Please enter your username or institutional email.');
      return;
    }

    if (!trimmedPass) {
      setErrorMessage('Please enter your password.');
      return;
    }

    const result = login(trimmedUser, trimmedPass);
    if (!result.success) {
      setErrorMessage(result.error || 'Invalid credentials. Please verify your details.');
    }
  };

  const handleSelectDemoAccount = (demo: typeof DEMO_CREDENTIALS[number], autoSubmit: boolean = false) => {
    setUsername(demo.username);
    setPassword(demo.password);
    setErrorMessage(null);

    if (autoSubmit) {
      login(demo.username, demo.password);
    }
  };

  const handleCopyCredentials = (u: string, p: string, key: string) => {
    navigator.clipboard?.writeText(`Username: ${u} | Password: ${p}`);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);
    setRegSuccess(null);

    if (!regFullName.trim() || !regUsername.trim() || !regEmail.trim() || !regPhone.trim() || !regDob) {
      setRegError('All personal details are mandatory.');
      return;
    }

    if (calculatedAge < 16) {
      setRegError('Minimum age requirement for institutional registration is 16.');
      return;
    }

    const result = registerUser({
      fullName: regFullName,
      username: regUsername,
      email: regEmail,
      phone: regPhone,
      dob: regDob,
      gender: regGender,
      role: regRole,
      institution: regInstitution,
      designation: regDesignation,
      studentId: regRole === 'student' ? regStudentId : undefined,
      course: regRole === 'student' ? regCourse : undefined,
      employeeId: regRole === 'faculty' ? regEmployeeId : undefined,
      department: regRole === 'faculty' || regRole === 'student' ? regDepartment : undefined,
    });

    if (!result.success) {
      setRegError(result.error || 'Failed to create account.');
    } else {
      setRegSuccess('Mock profile created successfully! Redirecting to dashboard...');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Briefcase className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'institution':
        return <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'faculty':
        return <Sliders className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'student':
        return <GraduationCap className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      default:
        return <User className="w-3.5 h-3.5 text-neutral-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex flex-col justify-center items-center py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-blue-600 selection:text-white">
      {/* Background subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] opacity-60 pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 space-y-4">
        {/* macOS Window Card Container */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-xs">
          {/* macOS Title Bar Chrome */}
          <div className="h-10 bg-neutral-100/90 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 px-4 flex items-center justify-between select-none">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/90 border border-rose-600/30" />
              <span className="w-3 h-3 rounded-full bg-amber-400/90 border border-amber-500/30" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/90 border border-emerald-600/30" />
              <span className="ml-2 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                AICTE Authentication Console
              </span>
            </div>
            <div className="text-[11px] font-mono text-neutral-400">
              macOS Strata UI · WRO Node
            </div>
          </div>

          <div className="p-6 sm:p-8">
            {/* Brand Emblem & Header */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-base tracking-wider shadow-sm mb-3">
                AICTE
              </div>
              <h1 className="text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                Application Validation & Document Authentication Portal
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md">
                All India Council for Technical Education · Western Regional Scrutiny System
              </p>
            </div>

            {/* Segmented Tab Switcher (macOS style) */}
            <div className="flex p-1 bg-neutral-100 dark:bg-neutral-800 rounded-xl mb-6 border border-neutral-200/60 dark:border-neutral-700/60">
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signin');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'signin'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                Sign In with Credentials
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === 'register'
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                Register Custom Persona
              </button>
            </div>

            {activeTab === 'signin' ? (
              <div className="space-y-6">
                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="flex-1 font-medium">{errorMessage}</div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                      Username or Institutional Email
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="e.g. admin, institution, faculty, or student"
                        className="w-full pl-10 pr-3 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          alert('Prototype notice: Use the predefined demo passwords from the table below (e.g. Admin123, Inst123, Faculty123, Student123).');
                        }}
                        className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setErrorMessage(null);
                        }}
                        placeholder="Enter password (case-sensitive)"
                        className="w-full pl-10 pr-10 py-2 text-xs bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/30 focus:border-blue-600 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 p-0.5"
                        title={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-4 h-4 rounded text-blue-600 border-neutral-300 dark:border-neutral-700 focus:ring-blue-500"
                      />
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Remember session on this device
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>

                {/* Predefined Demo Credentials Reference Section */}
                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-blue-600" />
                      <span>Predefined Demo Credentials</span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      Click any card to auto-fill
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {DEMO_CREDENTIALS.map((demo) => {
                      const isCurrentlyFilled = username.toLowerCase() === demo.username.toLowerCase();
                      return (
                        <div
                          key={demo.role}
                          onClick={() => handleSelectDemoAccount(demo, false)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            isCurrentlyFilled
                              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 ring-1 ring-blue-500/50'
                              : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40 hover:bg-white dark:hover:bg-neutral-800 hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5 font-bold text-neutral-900 dark:text-neutral-100">
                              {getRoleIcon(demo.role)}
                              <span className="truncate">{demo.roleLabel}</span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectDemoAccount(demo, true);
                              }}
                              className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              Instant In &rarr;
                            </button>
                          </div>

                          <div className="space-y-0.5 font-mono text-[11px] text-neutral-600 dark:text-neutral-300">
                            <div>
                              <span className="text-neutral-400">User:</span>{' '}
                              <strong className="text-neutral-900 dark:text-neutral-100">{demo.username}</strong>
                            </div>
                            <div>
                              <span className="text-neutral-400">Pass:</span>{' '}
                              <strong className="text-neutral-900 dark:text-neutral-100">{demo.password}</strong>
                            </div>
                          </div>

                          <div className="text-[10px] text-neutral-400 truncate mt-1">
                            {demo.name}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              /* Registration Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                {regError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-xl flex items-start gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                    Select Role <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="institution">Institutional Representative (Dean / Principal)</option>
                    <option value="admin">AICTE Scrutiny Officer / Admin</option>
                    <option value="faculty">Faculty Member / Professor</option>
                    <option value="student">Student / Candidate</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Full Legal Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regFullName}
                      onChange={(e) => setRegFullName(e.target.value)}
                      placeholder="e.g. Dr. Rajesh Verma"
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Unique Username <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="e.g. r_verma26"
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="rverma@college.edu"
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Date of Birth (Age: {calculatedAge} yrs) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={regDob}
                      onChange={(e) => setRegDob(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                      Gender
                    </label>
                    <select
                      value={regGender}
                      onChange={(e) => setRegGender(e.target.value as any)}
                      className="w-full px-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs"
                >
                  Create Mock Profile & Proceed
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Prototype Disclaimer */}
        <div className="text-center text-[11px] text-neutral-500 dark:text-neutral-400">
          Simulated AICTE Portal Prototype · No live backend or external authentication services
        </div>
      </div>
    </div>
  );
};
