import React, { useState } from 'react';

interface LoginViewProps {
  onLoginSuccess: (user: any, token: string) => void;
  onNavigateSignUp: () => void;
  onBypassDemo?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({
  onLoginSuccess,
  onNavigateSignUp,
  onBypassDemo,
}) => {
  const [email, setEmail] = useState('evelyn.vance@omniahealth.org');
  const [password, setPassword] = useState('EnterpriseSecret2025#');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Sign In to Workspace');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingText('Verifying Domain & SAML...');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          rememberDevice,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        setLoadingText('Sign In to Workspace');
        setErrorMessage(data.error || 'Authentication failed. Please check your credentials.');
        return;
      }

      setLoadingText('Authenticated. Redirecting...');
      setIsSuccess(true);

      setTimeout(() => {
        onLoginSuccess(data.user, data.token);
      }, 900);
    } catch {
      // Offline fallback
      setLoadingText('Authenticated. Redirecting...');
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(
          {
            id: 'user-evelyn',
            name: 'Evelyn Chen-Vance',
            email: email || 'evelyn.vance@omniahealth.org',
            role: 'VP of Global People Ops',
            companyName: 'Omnia Health Group',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
          },
          'demo-session-token'
        );
      }, 700);
    }
  };

  const handleSSO = async (provider: 'okta' | 'google' | 'azure') => {
    setErrorMessage(null);
    setIsLoading(true);
    setLoadingText(`Connecting to ${provider.toUpperCase()} Identity Provider...`);

    try {
      const res = await fetch('/api/auth/sso', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider }),
      });

      const data = await res.json();
      setIsSuccess(true);
      setLoadingText(`${provider.toUpperCase()} Handshake Verified!`);

      setTimeout(() => {
        onLoginSuccess(data.user, data.token);
      }, 800);
    } catch {
      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(
          {
            id: `user-${provider}`,
            name: 'Evelyn Chen-Vance',
            email: 'evelyn.vance@omniahealth.org',
            role: 'VP of Global People Ops',
            companyName: 'Omnia Health Group',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
          },
          `sso-${provider}-token`
        );
      }, 600);
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

            {onBypassDemo && (
              <button
                onClick={onBypassDemo}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#132238] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] text-[#0058be] dark:text-[#6ffbbe] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854] transition-all shadow-2xs"
              >
                <span>Demo Workspace</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Hub */}
      <main className="flex-1 flex items-center justify-center w-full px-4 sm:px-6 py-8">
        <div className="flex flex-col w-full max-w-7xl mx-auto py-2">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Hero / Enterprise Brand Showcase (Left 5 Cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between bg-[#1e3a8a] dark:bg-[#111f38] text-white rounded-3xl p-6 md:p-10 relative overflow-hidden shadow-2xl border border-white/10">
              {/* Background Ambient Glow Accents */}
              <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-[#2170e4]/20 blur-3xl pointer-events-none"></div>
              <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#6ffbbe]/10 blur-3xl pointer-events-none"></div>

              {/* Top Metadata & Brand Statement */}
              <div className="relative z-10 flex flex-col gap-6">
                <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[#dce1ff] text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#6ffbbe] animate-pulse"></span>
                  <span>v4.18 Core HCM &amp; Payroll Engine</span>
                </div>

                <div className="space-y-3">
                  <h1 className="text-2xl sm:text-3xl lg:text-[32px] tracking-tight text-white leading-snug font-bold">
                    Enterprise Workforce Intelligence &amp; Global Payroll Platform
                  </h1>
                  <p className="text-sm text-[#b6c4ff] leading-relaxed">
                    Consolidate cross-border talent operations, unified shift scheduling, compliance automation, and real-time compensation in a single zero-trust architecture.
                  </p>
                </div>

                {/* Dynamic Live Metric Badges Grid */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm flex flex-col border border-white/10">
                    <span className="text-xl font-bold text-[#6ffbbe]">99.98%</span>
                    <span className="text-xs text-[#b6c4ff] mt-0.5">SLA Core Uptime</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm flex flex-col border border-white/10">
                    <span className="text-xl font-bold text-white">250k+</span>
                    <span className="text-xs text-[#b6c4ff] mt-0.5">Active Global Seats</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm flex flex-col border border-white/10">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-white">48</span>
                      <span className="text-[11px] text-[#6ffbbe]">Countries</span>
                    </div>
                    <span className="text-xs text-[#b6c4ff] mt-0.5">Multi-Jurisdiction Tax</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-sm shadow-sm flex flex-col justify-center border border-white/10">
                    <div className="flex items-center gap-1.5 text-[#d8e2ff]">
                      <span className="material-symbols-outlined text-[18px] text-[#6ffbbe]">verified</span>
                      <span className="text-xs font-semibold text-white">SOC-2 Type II</span>
                    </div>
                    <span className="text-[11px] text-[#b6c4ff] mt-0.5">Audited &amp; Compliant</span>
                  </div>
                </div>
              </div>

              {/* Testimonial & VP Verified Credential Card */}
              <div className="relative z-10 mt-8 pt-6">
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md flex flex-col gap-3 shadow-md border border-white/15">
                  <div className="flex items-center gap-1 text-[#6ffbbe]">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span key={i} className="material-symbols-outlined text-[18px]">star</span>
                    ))}
                    <span className="ml-2 text-[10px] text-[#dce1ff] font-bold tracking-wider uppercase">Leader in Enterprise HCM</span>
                  </div>
                  <p className="text-xs text-white/95 italic leading-snug">
                    "PulseHR reduced our end-of-month reconciliation cycle from 9 business days to under four hours across 14 European and APAC entities."
                  </p>
                  <div className="flex items-center gap-3 pt-1">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 ring-2 ring-white/20">
                      <img
                        className="w-full h-full object-cover"
                        alt="Evelyn Chen-Vance"
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256"
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm text-white font-bold truncate">Evelyn Chen-Vance</span>
                      <span className="text-xs text-[#b6c4ff] truncate">VP of Global People Ops, Omnia Health Group</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-[#b6c4ff] text-[11px]">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-[#6ffbbe]">terminal</span>
                    API Gateway: US-EAST-1
                  </span>
                  <span className="tracking-widest uppercase font-mono">ID: PLSE-NODE-9804</span>
                </div>
              </div>
            </div>

            {/* Right Column: Authentication Hub & Interactive Form (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="bg-white dark:bg-[#132238] rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl border border-[#e5eeff] dark:border-[#1e2e48] flex flex-col transition-colors">
                {/* Header Tier */}
                <div className="flex flex-col gap-1.5 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-wider text-[#0058be] dark:text-[#6ffbbe] font-bold">
                      Enterprise Access Portal
                    </span>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#27c38a]"></span>
                      TLS 1.3 Strict
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold text-[#0b1c30] dark:text-white tracking-tight">
                    Welcome back to PulseHR
                  </h2>
                  <p className="text-sm text-[#444651] dark:text-[#94a3b8]">
                    Sign in with your corporate single sign-on (SSO) or verified work credentials.
                  </p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                  <div className="mb-4 p-3.5 rounded-xl bg-[#ffdad6] dark:bg-[#93000a]/20 border border-[#ba1a1a]/30 text-[#ba1a1a] dark:text-[#ffb4ab] text-xs flex items-center gap-2 animate-shake">
                    <span className="material-symbols-outlined text-[18px]">error</span>
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* SSO Fast-Track Quick Action Tiers */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
                  {/* Okta / SAML SSO */}
                  <button
                    onClick={() => handleSSO('okta')}
                    disabled={isLoading}
                    className="group flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] transition-all shadow-2xs text-[#0b1c30] dark:text-white active:scale-[0.98] border border-[#dce9ff] dark:border-[#223854]"
                    type="button"
                  >
                    <svg className="w-4 h-4 shrink-0 text-[#0058be] dark:text-[#6ffbbe]" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" fill="none" r="10" stroke="currentColor" strokeWidth="2.5"></circle>
                      <circle cx="12" cy="12" fill="currentColor" r="4"></circle>
                    </svg>
                    <span className="text-xs font-semibold truncate">Okta SSO</span>
                  </button>

                  {/* Google Workspace */}
                  <button
                    onClick={() => handleSSO('google')}
                    disabled={isLoading}
                    className="group flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] transition-all shadow-2xs text-[#0b1c30] dark:text-white active:scale-[0.98] border border-[#dce9ff] dark:border-[#223854]"
                    type="button"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                    </svg>
                    <span className="text-xs font-semibold truncate">Google</span>
                  </button>

                  {/* Microsoft Azure AD */}
                  <button
                    onClick={() => handleSSO('azure')}
                    disabled={isLoading}
                    className="group flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] transition-all shadow-2xs text-[#0b1c30] dark:text-white active:scale-[0.98] border border-[#dce9ff] dark:border-[#223854]"
                    type="button"
                  >
                    <svg className="w-4 h-4 shrink-0" viewBox="0 0 23 23">
                      <path d="M1 1h10v10H1z" fill="#f35325"></path>
                      <path d="M12 1h10v10H12z" fill="#81bc06"></path>
                      <path d="M1 12h10v10H1z" fill="#05a6f0"></path>
                      <path d="M12 12h10v10H12z" fill="#ffba08"></path>
                    </svg>
                    <span className="text-xs font-semibold truncate">Azure AD</span>
                  </button>
                </div>

                {/* Semantic Separator */}
                <div className="relative flex items-center justify-center my-4">
                  <div className="w-full h-px bg-[#dce9ff] dark:bg-[#1e2e48]"></div>
                  <span className="absolute px-4 bg-white dark:bg-[#132238] text-[11px] font-bold text-[#757682] dark:text-[#94a3b8] uppercase tracking-wider">
                    Or sign in with work email
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="flex flex-col gap-4 mt-2">
                  {/* Work Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-[#0b1c30] dark:text-white flex items-center justify-between" htmlFor="work-email">
                      <span>Work Email Address</span>
                      <span className="text-[#0058be] dark:text-[#6ffbbe] text-[11px]">SSO-Integrated Domain</span>
                    </label>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-[#757682] dark:text-[#94a3b8] pointer-events-none">
                        mail
                      </span>
                      <input
                        className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-[#0b1c30] dark:text-white text-sm shadow-2xs border border-[#dce9ff] dark:border-[#223854] outline-none transition-all placeholder:text-[#757682] dark:placeholder:text-[#64748b] focus:ring-2 focus:ring-[#0058be]/20 dark:focus:ring-[#6ffbbe]/20"
                        id="work-email"
                        name="work-email"
                        placeholder="name@company.com"
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-[#0b1c30] dark:text-white" htmlFor="password">
                        Master Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPassword('EnterpriseSecret2025#');
                          setErrorMessage('Demo password autofilled: EnterpriseSecret2025#');
                        }}
                        className="text-[11px] text-[#0058be] dark:text-[#6ffbbe] hover:underline font-medium"
                      >
                        Reset / Autofill Demo Key
                      </button>
                    </div>
                    <div className="relative flex items-center">
                      <span className="material-symbols-outlined absolute left-3.5 text-[20px] text-[#757682] dark:text-[#94a3b8] pointer-events-none">
                        lock
                      </span>
                      <input
                        className="w-full h-12 pl-11 pr-11 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-[#0b1c30] dark:text-white text-sm shadow-2xs border border-[#dce9ff] dark:border-[#223854] outline-none transition-all placeholder:text-[#757682] dark:placeholder:text-[#64748b] focus:ring-2 focus:ring-[#0058be]/20 dark:focus:ring-[#6ffbbe]/20"
                        id="password"
                        name="password"
                        placeholder="••••••••••••••••"
                        required
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <button
                        aria-label="Toggle password visibility"
                        className="absolute right-3.5 text-[#757682] dark:text-[#94a3b8] hover:text-[#0b1c30] dark:hover:text-white transition-colors flex items-center justify-center p-1"
                        id="toggle-pwd-btn"
                        onClick={() => setShowPassword(!showPassword)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {showPassword ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Trust Options & Security Device Checkbox */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                      <input
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="w-4 h-4 rounded text-[#00236f] focus:ring-0 cursor-pointer accent-[#00236f]"
                        type="checkbox"
                      />
                      <span className="text-xs text-[#444651] dark:text-[#cbd5e1] group-hover:text-[#0b1c30] dark:group-hover:text-white transition-colors">
                        Remember corporate device
                      </span>
                    </label>

                    <div className="relative group cursor-pointer inline-flex items-center gap-1 text-[#757682] dark:text-[#94a3b8] hover:text-[#0058be] dark:hover:text-[#6ffbbe] transition-colors">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span className="text-[11px] font-medium">14-day token</span>
                      {/* Tooltip */}
                      <div className="absolute bottom-full right-0 mb-2 hidden group-hover:flex flex-col w-56 p-2.5 bg-[#0b1c30] text-white rounded-xl shadow-xl text-[11px] z-30 pointer-events-none">
                        <span>Keep me signed in for 14 days on this secure, encrypted workstation.</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTA Button */}
                  <button
                    className={`mt-2 w-full h-12 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] ${
                      isSuccess
                        ? 'bg-[#004a31] text-[#6ffbbe]'
                        : 'bg-[#00236f] hover:bg-[#1e3a8a] dark:bg-[#1e3a8a] dark:hover:bg-[#2563eb]'
                    }`}
                    id="submit-btn"
                    type="submit"
                    disabled={isLoading}
                  >
                    <span>{loadingText}</span>
                    {isLoading && !isSuccess ? (
                      <span className="material-symbols-outlined text-[20px] animate-spin">
                        progress_activity
                      </span>
                    ) : isSuccess ? (
                      <span className="material-symbols-outlined text-[20px] text-[#27c38a]">
                        check_circle
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                        arrow_forward
                      </span>
                    )}
                  </button>
                </form>

                {/* Secondary Navigation / Lead Acquisition */}
                <div className="mt-6 pt-4 text-center bg-[#eff4ff] dark:bg-[#18283f] rounded-2xl p-3 border border-[#dce9ff] dark:border-[#223854]">
                  <p className="text-xs text-[#444651] dark:text-[#cbd5e1]">
                    Don't have a PulseHR enterprise instance?
                    <button
                      onClick={onNavigateSignUp}
                      className="font-bold text-[#0058be] dark:text-[#6ffbbe] hover:underline ml-1.5 inline-flex items-center gap-0.5"
                    >
                      Sign Up / Request Demo
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </p>
                </div>

                {/* Bottom Trust & Compliance Bar */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[#757682] dark:text-[#94a3b8] text-[11px] pt-4 border-t border-[#eff4ff] dark:border-[#1e2e48]">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[16px]">cloud_done</span>
                    <span>Protected by Cloudflare Enterprise Edge</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[#27c38a] text-[16px]">fingerprint</span>
                    <span>MFA / FIDO2 Passkeys Ready</span>
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
