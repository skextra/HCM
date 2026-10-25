import React, { useState } from 'react';

interface SignUpViewProps {
  onSignUpSuccess: (user: any, token: string) => void;
  onNavigateLogin: () => void;
  onBypassDemo?: () => void;
}

export const SignUpView: React.FC<SignUpViewProps> = ({
  onSignUpSuccess,
  onNavigateLogin,
  onBypassDemo,
}) => {
  // Step tracker
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [workEmail, setWorkEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySize, setCompanySize] = useState('50-250');
  const [countryLocation, setCountryLocation] = useState('US');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'enterprise-trial' | 'professional' | 'custom'>('enterprise-trial');
  const [termsAgreement, setTermsAgreement] = useState(false);

  // UI status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  // Password Strength Calculation
  const hasMinLen = password.length >= 12;
  const hasNum = /\d/.test(password);
  const hasSym = /[^A-Za-z0-9]/.test(password);
  const hasUpperLower = /[a-z]/.test(password) && /[A-Z]/.test(password);

  let score = 0;
  if (password.length > 0) score++;
  if (hasMinLen) score++;
  if (hasNum && hasSym) score++;
  if (hasMinLen && hasNum && hasSym && hasUpperLower) score++;

  const getStrengthLabel = () => {
    if (score === 0) return { label: 'Min. 12 chars', color: 'text-[#757682] dark:text-[#94a3b8]' };
    if (score === 1) return { label: 'Weak', color: 'text-[#ba1a1a] dark:text-[#ffb4ab]' };
    if (score === 2) return { label: 'Fair', color: 'text-amber-500' };
    if (score === 3) return { label: 'Strong', color: 'text-[#0058be] dark:text-[#6ffbbe]' };
    return { label: 'Enterprise Grade', color: 'text-[#27c38a] font-bold' };
  };

  const handleCreateWorkspace = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!termsAgreement) {
      setErrorMessage('Please accept the Master Services Agreement to proceed.');
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workEmail,
          firstName,
          lastName,
          companyName,
          companySize,
          countryLocation,
          password: password || 'Enterprise2025#',
          plan: selectedPlan,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        setErrorMessage(data.error || 'Failed to provision workspace.');
        return;
      }

      setSuccessNotice(true);
      setTimeout(() => {
        onSignUpSuccess(data.user, data.token);
      }, 1000);
    } catch {
      // Local fallback
      setSuccessNotice(true);
      setTimeout(() => {
        onSignUpSuccess(
          {
            id: `user-${Date.now()}`,
            name: `${firstName || 'Jane'} ${lastName || 'Sterling'}`,
            email: workEmail || 'admin@company.com',
            role: 'Workspace Owner & Administrator',
            companyName: companyName || 'Acme Global Technologies',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          },
          'new-workspace-token'
        );
      }, 800);
    }
  };

  return (
    <div className="bg-[#f8f9ff] dark:bg-[#0b1320] text-[#0b1c30] dark:text-[#f1f5f9] flex min-h-screen flex-col justify-between selection:bg-[#dce1ff] dark:selection:bg-[#1e3a8a] selection:text-[#00164e] transition-colors">
      {/* Top Navbar */}
      <header className="w-full bg-white/80 dark:bg-[#0f1b2d]/80 backdrop-blur-xl border-b border-[#e5eeff] dark:border-[#1e2e48] shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00236f] dark:bg-[#1e3a8a] flex items-center justify-center text-white font-bold text-base shadow-sm">
              <span className="material-symbols-outlined text-[20px]">hub</span>
            </div>
            <span className="font-bold text-lg text-[#00236f] dark:text-[#90a8ff] tracking-tight">
              Pulse<span className="text-[#0058be] dark:text-[#6ffbbe]">HR</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854]">
              <span className="w-2 h-2 rounded-full bg-[#27c38a] animate-pulse"></span>
              Enterprise SSO Active
            </span>

            <button
              onClick={onNavigateLogin}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#132238] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] text-[#0058be] dark:text-[#6ffbbe] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854] transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Hub */}
      <main className="flex-1 flex items-center justify-center w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col w-full max-w-7xl mx-auto py-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] transition-colors">
            {/* Left Hero/Branding Pane */}
            <div className="lg:col-span-5 bg-[#1e3a8a] dark:bg-[#111f38] text-white flex flex-col justify-between p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              {/* Ambient decorative backdrop glow */}
              <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2170e4]/20 rounded-full blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#27c38a]/15 rounded-full blur-3xl pointer-events-none"></div>

              {/* Top Brand Identity Segment */}
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#132238] text-[#00236f] dark:text-[#6ffbbe] flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-[24px]">hub</span>
                  </div>
                  <div>
                    <span className="text-xl text-white font-bold tracking-tight">
                      Pulse<span className="text-[#90a8ff]">HR</span>
                    </span>
                    <span className="block text-[10px] uppercase tracking-wider text-[#90a8ff]/80 font-mono">
                      Enterprise HCM Suite
                    </span>
                  </div>
                </div>

                {/* Editorial Accent Tag */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md mb-4 border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-[#4edea3] animate-pulse"></span>
                  <span className="text-xs text-white tracking-wide font-medium">Next-Gen Workforce Operating System</span>
                </div>

                <h1 className="text-2xl sm:text-3xl text-white font-bold tracking-tight mb-3 leading-tight">
                  Transform Your People Operations with PulseHR
                </h1>

                <p className="text-sm text-[#90a8ff] leading-relaxed mb-6">
                  Unify global talent, automated compliance, and real-time attendance in one frictionless platform engineered for modern enterprises.
                </p>

                {/* Core Value Propositions */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm transition-all hover:bg-white/10 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-[#004a31] text-[#27c38a] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">currency_exchange</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Multi-Currency Global Payroll</h4>
                      <p className="text-xs text-[#90a8ff]/90 mt-0.5">Automate global payroll &amp; statutory tax compliance across 140+ currencies with unified banking rails.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm transition-all hover:bg-white/10 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-[#004a31] text-[#27c38a] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">fingerprint</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Intelligent Precision Timekeeping</h4>
                      <p className="text-xs text-[#90a8ff]/90 mt-0.5">Real-time biometric attendance, geo-fenced mobile shifts &amp; automated overtime rule verification.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm transition-all hover:bg-white/10 border border-white/10">
                    <div className="w-8 h-8 rounded-lg bg-[#004a31] text-[#27c38a] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-[20px]">approval_delegation</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">Autonomous Leave Management</h4>
                      <p className="text-xs text-[#90a8ff]/90 mt-0.5">Self-service leave management &amp; smart approval workflows with automatic manager escalations.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metric & Trust Banner */}
              <div className="relative z-10 pt-6 mt-6 border-t border-white/10">
                {/* Rich SVG Metric Visualization */}
                <div className="p-3.5 rounded-2xl bg-white/5 backdrop-blur-md mb-3 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#90a8ff] uppercase tracking-wider">Payroll Processing Speedup</span>
                    <span className="text-base font-bold text-[#4edea3]">94.8%</span>
                  </div>
                  <div className="w-full bg-white/15 h-2 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-[#d8e2ff] to-[#4edea3] h-full rounded-full" style={{ width: '95%' }}></div>
                  </div>
                  <div className="flex justify-between items-center mt-2 text-[#90a8ff]/80 text-[11px]">
                    <span>Legacy Manual Audits: 14 hrs</span>
                    <span className="text-white font-semibold">PulseHR AI: 42 secs</span>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="rounded-xl bg-white/10 p-3 flex items-center gap-3 text-white border border-white/10">
                  <span className="material-symbols-outlined text-[#4edea3] text-[22px]">verified</span>
                  <p className="text-xs leading-snug">
                    <span className="font-bold text-white">14-Day Free Enterprise Trial</span> • No credit card required • Instant sandbox access
                  </p>
                </div>
              </div>
            </div>

            {/* Right Form / Registration Pane */}
            <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
              <div>
                {/* Header and Context */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-[#0b1c30] dark:text-white">Start your PulseHR workspace</h2>
                    <p className="text-xs text-[#444651] dark:text-[#94a3b8] mt-0.5">Get started with modern workforce management</p>
                  </div>
                  <span className="self-start md:self-auto text-xs bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#6ffbbe] px-3 py-1 rounded-full font-semibold border border-[#dce9ff] dark:border-[#223854]">
                    Deployment v4.12
                  </span>
                </div>

                {/* Multi-Step Progress Indicator */}
                <div className="w-full bg-[#eff4ff] dark:bg-[#18283f] rounded-2xl p-2 mb-6 border border-[#dce9ff] dark:border-[#223854]">
                  <div className="grid grid-cols-3 gap-2">
                    {/* Step 1 */}
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                        currentStep === 1
                          ? 'bg-white dark:bg-[#132238] shadow-sm border border-[#dce9ff] dark:border-[#223854]'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        currentStep === 1 ? 'bg-[#00236f] text-white' : 'bg-[#e5eeff] dark:bg-[#1f324e] text-[#444651] dark:text-white'
                      }`}>
                        1
                      </span>
                      <div className="min-w-0">
                        <span className="block text-xs font-semibold text-[#0b1c30] dark:text-white truncate">Company Details</span>
                        <span className="block text-[10px] text-[#27c38a] font-medium">{currentStep === 1 ? 'In Progress' : 'Completed'}</span>
                      </div>
                    </button>

                    {/* Step 2 */}
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                        currentStep === 2
                          ? 'bg-white dark:bg-[#132238] shadow-sm border border-[#dce9ff] dark:border-[#223854]'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        currentStep === 2 ? 'bg-[#00236f] text-white' : 'bg-[#e5eeff] dark:bg-[#1f324e] text-[#444651] dark:text-white'
                      }`}>
                        2
                      </span>
                      <div className="min-w-0">
                        <span className="block text-xs font-medium text-[#0b1c30] dark:text-white truncate">Administrator</span>
                        <span className="block text-[10px] text-[#757682] dark:text-[#94a3b8]">{currentStep === 2 ? 'Active' : 'Security'}</span>
                      </div>
                    </button>

                    {/* Step 3 */}
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className={`flex items-center gap-2 p-2 rounded-xl text-left transition-all ${
                        currentStep === 3
                          ? 'bg-white dark:bg-[#132238] shadow-sm border border-[#dce9ff] dark:border-[#223854]'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center shrink-0 ${
                        currentStep === 3 ? 'bg-[#00236f] text-white' : 'bg-[#e5eeff] dark:bg-[#1f324e] text-[#444651] dark:text-white'
                      }`}>
                        3
                      </span>
                      <div className="min-w-0">
                        <span className="block text-xs font-medium text-[#0b1c30] dark:text-white truncate">Plan Selection</span>
                        <span className="block text-[10px] text-[#757682] dark:text-[#94a3b8]">Tier &amp; Seats</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-xl bg-[#ffdad6] dark:bg-[#93000a]/20 border border-[#ba1a1a]/30 text-[#ba1a1a] dark:text-[#ffb4ab] text-xs flex items-center gap-2 animate-shake">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Registration Form Body */}
                <form onSubmit={(e) => { e.preventDefault(); if (currentStep < 3) setCurrentStep((currentStep + 1) as any); else handleCreateWorkspace(); }}>
                  {/* STEP 1: Company Details */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-fadeIn">
                      {/* Work Email Field */}
                      <div>
                        <label className="block text-xs font-semibold text-[#0b1c30] dark:text-white mb-1" htmlFor="workEmail">
                          Work Email Address <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682] dark:text-[#94a3b8]">
                            <span className="material-symbols-outlined text-[20px]">mail</span>
                          </div>
                          <input
                            className="w-full h-12 pl-11 pr-4 bg-[#eff4ff] dark:bg-[#18283f] text-[#0b1c30] dark:text-white text-sm rounded-xl border border-[#dce9ff] dark:border-[#223854] shadow-2xs focus:ring-2 focus:ring-[#0058be]/20 dark:focus:ring-[#6ffbbe]/20 outline-none"
                            id="workEmail"
                            placeholder="you@company.com"
                            required
                            type="email"
                            value={workEmail}
                            onChange={(e) => setWorkEmail(e.target.value)}
                          />
                        </div>
                        <p className="text-[11px] text-[#757682] dark:text-[#94a3b8] mt-1">Please use your enterprise organizational email domain.</p>
                      </div>

                      {/* Full Name Columns */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#0b1c30] dark:text-white mb-1" htmlFor="firstName">
                            First Name <span className="text-[#ba1a1a]">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682] dark:text-[#94a3b8]">
                              <span className="material-symbols-outlined text-[20px]">person</span>
                            </div>
                            <input
                              className="w-full h-12 pl-11 pr-4 bg-[#eff4ff] dark:bg-[#18283f] text-[#0b1c30] dark:text-white text-sm rounded-xl border border-[#dce9ff] dark:border-[#223854] shadow-2xs focus:ring-2 focus:ring-[#0058be]/20 outline-none"
                              id="firstName"
                              placeholder="Jane"
                              required
                              type="text"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#0b1c30] dark:text-white mb-1" htmlFor="lastName">
                            Last Name <span className="text-[#ba1a1a]">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682] dark:text-[#94a3b8]">
                              <span className="material-symbols-outlined text-[20px]">badge</span>
                            </div>
                            <input
                              className="w-full h-12 pl-11 pr-4 bg-[#eff4ff] dark:bg-[#18283f] text-[#0b1c30] dark:text-white text-sm rounded-xl border border-[#dce9ff] dark:border-[#223854] shadow-2xs focus:ring-2 focus:ring-[#0058be]/20 outline-none"
                              id="lastName"
                              placeholder="Sterling"
                              required
                              type="text"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Company Name & Size */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-[#0b1c30] dark:text-white mb-1" htmlFor="companyName">
                            Company / Organization <span className="text-[#ba1a1a]">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682] dark:text-[#94a3b8]">
                              <span className="material-symbols-outlined text-[20px]">domain</span>
                            </div>
                            <input
                              className="w-full h-12 pl-11 pr-4 bg-[#eff4ff] dark:bg-[#18283f] text-[#0b1c30] dark:text-white text-sm rounded-xl border border-[#dce9ff] dark:border-[#223854] shadow-2xs focus:ring-2 focus:ring-[#0058be]/20 outline-none"
                              id="companyName"
                              placeholder="Acme Global Technologies"
                              required
                              type="text"
                              value={companyName}
                              onChange={(e) => setCompanyName(e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#0b1c30] dark:text-white mb-1" htmlFor="companySize">
                            Company Size <span className="text-[#ba1a1a]">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682] dark:text-[#94a3b8]">
                              <span className="material-symbols-outlined text-[20px]">groups</span>
                            </div>
                            <select
                              className="w-full h-12 pl-11 pr-10 bg-[#eff4ff] dark:bg-[#18283f] text-[#0b1c30] dark:text-white text-sm rounded-xl border border-[#dce9ff] dark:border-[#223854] shadow-2xs focus:ring-2 focus:ring-[#0058be]/20 appearance-none cursor-pointer outline-none"
                              id="companySize"
                              required
                              value={companySize}
                              onChange={(e) => setCompanySize(e.target.value)}
                            >
                              <option value="1-49">1 - 49 Employees</option>
                              <option value="50-250">50 - 250 Employees</option>
                              <option value="250-1000">250 - 1,000 Employees</option>
                              <option value="1000+">1,000+ Enterprise Tier</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#757682]">
                              <span className="material-symbols-outlined text-[20px]">expand_more</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Country Selector */}
                      <div>
                        <label className="block text-xs font-semibold text-[#0b1c30] dark:text-white mb-1" htmlFor="countryLocation">
                          Work Country / Global Headquarters <span className="text-[#ba1a1a]">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682] dark:text-[#94a3b8]">
                            <span className="material-symbols-outlined text-[20px]">public</span>
                          </div>
                          <select
                            className="w-full h-12 pl-11 pr-10 bg-[#eff4ff] dark:bg-[#18283f] text-[#0b1c30] dark:text-white text-sm rounded-xl border border-[#dce9ff] dark:border-[#223854] shadow-2xs focus:ring-2 focus:ring-[#0058be]/20 appearance-none cursor-pointer outline-none"
                            id="countryLocation"
                            required
                            value={countryLocation}
                            onChange={(e) => setCountryLocation(e.target.value)}
                          >
                            <option value="US">United States (Delaware, CA, NY &amp; Nationwide)</option>
                            <option value="GB">United Kingdom (England, Scotland &amp; Wales)</option>
                            <option value="CA">Canada (Federal &amp; Provincial)</option>
                            <option value="DE">Germany (Bundesrepublik)</option>
                            <option value="SG">Singapore (ACRA Compliant)</option>
                            <option value="AU">Australia (Fair Work Verified)</option>
                            <option value="OTHER">Other Global Jurisdiction (140+ countries)</option>
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#757682]">
                            <span className="material-symbols-outlined text-[20px]">expand_more</span>
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          if (!workEmail || !firstName || !companyName) {
                            setErrorMessage('Please fill in your work email, name, and company.');
                            return;
                          }
                          setErrorMessage(null);
                          setCurrentStep(2);
                        }}
                        className="w-full h-12 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group mt-2"
                      >
                        <span>Next: Administrator Setup</span>
                        <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                      </button>
                    </div>
                  )}

                  {/* STEP 2: Administrator & Password */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-semibold text-[#0b1c30] dark:text-white" htmlFor="password">
                            Create Master Password <span className="text-[#ba1a1a]">*</span>
                          </label>
                          <span className={`text-xs ${getStrengthLabel().color}`}>
                            {getStrengthLabel().label}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#757682] dark:text-[#94a3b8]">
                            <span className="material-symbols-outlined text-[20px]">lock</span>
                          </div>
                          <input
                            className="w-full h-12 pl-11 pr-11 bg-[#eff4ff] dark:bg-[#18283f] text-[#0b1c30] dark:text-white text-sm rounded-xl border border-[#dce9ff] dark:border-[#223854] shadow-2xs focus:ring-2 focus:ring-[#0058be]/20 outline-none"
                            id="password"
                            placeholder="Min. 12 chars (e.g. EnterpriseSecret2025#)"
                            required
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <button
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#757682] hover:text-[#0b1c30] dark:hover:text-white"
                            id="togglePassword"
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            <span className="material-symbols-outlined text-[20px]">
                              {showPassword ? 'visibility_off' : 'visibility'}
                            </span>
                          </button>
                        </div>

                        {/* Real-time Password Strength Meter */}
                        <div className="mt-2.5 space-y-1.5">
                          <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-[#eff4ff] dark:bg-[#18283f] rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-colors duration-300 ${score >= 1 ? (score === 1 ? 'bg-[#ba1a1a]' : score === 2 ? 'bg-amber-500' : score === 3 ? 'bg-[#0058be]' : 'bg-[#27c38a]') : 'bg-transparent'}`} />
                            <div className={`h-full rounded-full transition-colors duration-300 ${score >= 2 ? (score === 2 ? 'bg-amber-500' : score === 3 ? 'bg-[#0058be]' : 'bg-[#27c38a]') : 'bg-transparent'}`} />
                            <div className={`h-full rounded-full transition-colors duration-300 ${score >= 3 ? (score === 3 ? 'bg-[#0058be]' : 'bg-[#27c38a]') : 'bg-transparent'}`} />
                            <div className={`h-full rounded-full transition-colors duration-300 ${score >= 4 ? 'bg-[#27c38a]' : 'bg-transparent'}`} />
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-[#757682] dark:text-[#94a3b8] pt-1">
                            <span className={`flex items-center gap-1 ${hasMinLen ? 'text-[#27c38a] font-semibold' : ''}`}>
                              <span className="material-symbols-outlined text-[14px]">{hasMinLen ? 'check_circle' : 'radio_button_unchecked'}</span> 12+ chars
                            </span>
                            <span className={`flex items-center gap-1 ${hasNum ? 'text-[#27c38a] font-semibold' : ''}`}>
                              <span className="material-symbols-outlined text-[14px]">{hasNum ? 'check_circle' : 'radio_button_unchecked'}</span> 1+ number
                            </span>
                            <span className={`flex items-center gap-1 ${hasSym ? 'text-[#27c38a] font-semibold' : ''}`}>
                              <span className="material-symbols-outlined text-[14px]">{hasSym ? 'check_circle' : 'radio_button_unchecked'}</span> 1+ symbol
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Master Services Agreement Checkbox */}
                      <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
                        <label className="flex items-start gap-3 cursor-pointer select-none">
                          <input
                            className="mt-1 w-4 h-4 rounded text-[#00236f] accent-[#00236f] cursor-pointer"
                            id="termsAgreement"
                            required
                            type="checkbox"
                            checked={termsAgreement}
                            onChange={(e) => setTermsAgreement(e.target.checked)}
                          />
                          <span className="text-xs text-[#444651] dark:text-[#cbd5e1] leading-relaxed">
                            I agree to the <span className="font-semibold text-[#0058be] dark:text-[#6ffbbe] hover:underline">PulseHR Master Services Agreement</span>, Data Processing Addendum (DPA), and acknowledge the <span className="font-semibold text-[#0058be] dark:text-[#6ffbbe] hover:underline">Privacy Policy</span>.
                          </span>
                        </label>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(1)}
                          className="flex-1 h-12 bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] text-sm font-semibold rounded-xl hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] transition-all"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrentStep(3)}
                          className="flex-2 h-12 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                        >
                          <span>Next: Plan Selection</span>
                          <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* STEP 3: Plan Selection & Submission */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <label className="block text-xs font-semibold text-[#0b1c30] dark:text-white mb-2">
                          Choose Deployment Tier
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {/* Enterprise Trial */}
                          <div
                            onClick={() => setSelectedPlan('enterprise-trial')}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              selectedPlan === 'enterprise-trial'
                                ? 'bg-[#eff4ff] dark:bg-[#18283f] border-[#0058be] dark:border-[#6ffbbe] shadow-sm'
                                : 'bg-white dark:bg-[#132238] border-[#e5eeff] dark:border-[#1e2e48]'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-[#27c38a] uppercase tracking-wider">Free 14 Days</span>
                            <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white mt-1">Enterprise Trial</h4>
                            <p className="text-[11px] text-[#757682] dark:text-[#94a3b8] mt-1">Full suite sandbox access, up to 250 seats.</p>
                          </div>

                          {/* Professional */}
                          <div
                            onClick={() => setSelectedPlan('professional')}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              selectedPlan === 'professional'
                                ? 'bg-[#eff4ff] dark:bg-[#18283f] border-[#0058be] dark:border-[#6ffbbe] shadow-sm'
                                : 'bg-white dark:bg-[#132238] border-[#e5eeff] dark:border-[#1e2e48]'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-[#0058be] uppercase tracking-wider">$14 / user / mo</span>
                            <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white mt-1">Professional</h4>
                            <p className="text-[11px] text-[#757682] dark:text-[#94a3b8] mt-1">Multi-currency payroll, timesheets, and biometric sync.</p>
                          </div>

                          {/* Custom */}
                          <div
                            onClick={() => setSelectedPlan('custom')}
                            className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                              selectedPlan === 'custom'
                                ? 'bg-[#eff4ff] dark:bg-[#18283f] border-[#0058be] dark:border-[#6ffbbe] shadow-sm'
                                : 'bg-white dark:bg-[#132238] border-[#e5eeff] dark:border-[#1e2e48]'
                            }`}
                          >
                            <span className="text-[10px] font-bold text-[#1e3a8a] dark:text-[#90a8ff] uppercase tracking-wider">Unlimited</span>
                            <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white mt-1">Custom Scale</h4>
                            <p className="text-[11px] text-[#757682] dark:text-[#94a3b8] mt-1">Dedicated cloud tenant &amp; 99.99% custom SLA.</p>
                          </div>
                        </div>
                      </div>

                      {/* Summary Review */}
                      <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] text-xs space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-[#757682] dark:text-[#94a3b8]">Workspace Name:</span>
                          <span className="font-semibold text-[#0b1c30] dark:text-white">{companyName || 'Acme Global Technologies'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#757682] dark:text-[#94a3b8]">Primary Admin:</span>
                          <span className="font-semibold text-[#0b1c30] dark:text-white">{firstName} {lastName} ({workEmail})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#757682] dark:text-[#94a3b8]">Jurisdiction:</span>
                          <span className="font-semibold text-[#0b1c30] dark:text-white">{countryLocation} • {companySize} Employees</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => setCurrentStep(2)}
                          className="flex-1 h-12 bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] text-sm font-semibold rounded-xl hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] transition-all"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() => handleCreateWorkspace()}
                          className="flex-2 h-12 bg-[#00236f] hover:bg-[#1e3a8a] text-white text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group active:scale-[0.99]"
                        >
                          <span>{isLoading ? 'Provisioning...' : successNotice ? 'Workspace Ready!' : 'Create Enterprise Workspace'}</span>
                          {isLoading ? (
                            <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                          ) : successNotice ? (
                            <span className="material-symbols-outlined text-[20px] text-[#27c38a]">check_circle</span>
                          ) : (
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </form>

                {/* Sign-in Escalation */}
                <div className="text-center mt-6">
                  <p className="text-xs text-[#444651] dark:text-[#cbd5e1]">
                    Already have an enterprise account?
                    <button
                      onClick={onNavigateLogin}
                      className="font-semibold text-[#0058be] dark:text-[#6ffbbe] hover:underline ml-1 inline-flex items-center gap-0.5"
                    >
                      Sign In
                      <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    </button>
                  </p>
                </div>
              </div>

              {/* Security and Compliance Footer */}
              <div className="mt-6 pt-4 bg-[#eff4ff]/60 dark:bg-[#18283f]/60 -mx-6 -mb-6 p-4 rounded-b-3xl border-t border-[#e5eeff] dark:border-[#1e2e48]">
                <div className="flex items-center justify-between flex-wrap gap-2 text-[#757682] dark:text-[#94a3b8] text-[11px]">
                  <span className="uppercase font-bold tracking-wider text-[#0b1c30] dark:text-white">Compliance Standards:</span>
                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0b1c30] dark:text-white">
                      <span className="material-symbols-outlined text-[16px] text-[#27c38a]">verified_user</span> ISO 27001
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0b1c30] dark:text-white">
                      <span className="material-symbols-outlined text-[16px] text-[#27c38a]">gite</span> SOC 2 Type II
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0b1c30] dark:text-white">
                      <span className="material-symbols-outlined text-[16px] text-[#27c38a]">security</span> GDPR Ready
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-[#0b1c30] dark:text-white">
                      <span className="material-symbols-outlined text-[16px] text-[#27c38a]">health_and_safety</span> HIPAA Compliant
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global Footer */}
      <footer className="w-full bg-[#eff4ff]/70 dark:bg-[#0f1b2d]/70 py-6 border-t border-[#e5eeff] dark:border-[#1e2e48] transition-colors">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5 text-[#444651] dark:text-[#cbd5e1] text-xs">
              <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[16px]">verified_user</span>
              <span>SOC-2 Type II Certified</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#444651] dark:text-[#cbd5e1] text-xs">
              <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[16px]">gite</span>
              <span>ISO 27001 Validated</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#444651] dark:text-[#cbd5e1] text-xs">
              <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[16px]">lock</span>
              <span>256-Bit AES Encryption</span>
            </div>
          </div>

          <div className="text-[#757682] dark:text-[#94a3b8] text-xs flex items-center gap-4">
            <span>© 2025 PulseHR Systems Inc.</span>
            <span className="text-[#c5c5d3] dark:text-[#334155]">•</span>
            <span className="hover:text-[#0b1c30] dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-[#c5c5d3] dark:text-[#334155]">•</span>
            <span className="hover:text-[#0b1c30] dark:hover:text-white transition-colors cursor-pointer">Compliance Portal</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
