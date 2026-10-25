import React, { useState } from 'react';

interface SettingsViewProps {
  darkMode: boolean;
  onToggleDarkMode: (val: boolean) => void;
  currentUser?: any;
  onSignOut?: () => void;
  onNavigateAuth?: (route: 'login' | 'signup') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  darkMode,
  onToggleDarkMode,
  currentUser,
  onSignOut,
  onNavigateAuth,
}) => {
  const [autoClockOut, setAutoClockOut] = useState(true);
  const [beaconGeo, setBeaconGeo] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto pb-12">
      {/* Header card */}
      <div className="bg-white dark:bg-[#132238] p-5 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex items-center justify-between transition-colors">
        <div>
          <h2 className="text-xl font-bold text-[#0b1c30] dark:text-white">Workforce Core Settings</h2>
          <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-0.5">Preferences, Theme Appearance, & Security Standards</p>
        </div>
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl bg-[#00236f] hover:bg-[#1e3a8a] text-white text-xs font-semibold shadow-xs transition-colors"
        >
          {savedNotice ? 'Settings Saved!' : 'Save Preferences'}
        </button>
      </div>

      {savedNotice && (
        <div className="p-3 bg-[#27c38a]/15 text-[#004a31] dark:text-[#6ffbbe] border border-[#27c38a]/30 rounded-xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Your workforce preferences have been saved and synchronized with PulseHR Core.</span>
        </div>
      )}

      {/* Global Theme & Display Preferences (Feature Requested) */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#eff4ff] dark:bg-[#18283f] flex items-center justify-center text-[#0058be] dark:text-[#6ffbbe]">
              <span className="material-symbols-outlined text-[20px]">
                {darkMode ? 'dark_mode' : 'light_mode'}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30] dark:text-white">Appearance & Theme Mode</h3>
              <p className="text-xs text-[#757682] dark:text-[#94a3b8]">Customize interface illumination for daytime or low-light conditions</p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#6ffbbe] border border-[#dce9ff] dark:border-[#223854]">
            {darkMode ? 'Dark Active' : 'Light Active'}
          </span>
        </div>

        {/* Theme Visual Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Light Mode Selector Card */}
          <div
            onClick={() => onToggleDarkMode(false)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
              !darkMode
                ? 'bg-[#eff4ff] border-[#0058be] shadow-sm'
                : 'bg-white dark:bg-[#18283f] border-[#e5eeff] dark:border-[#1e2e48] hover:border-[#0058be]/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0058be] text-[20px]">light_mode</span>
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white">Light Mode</span>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                !darkMode ? 'border-[#0058be]' : 'border-[#757682]'
              }`}>
                {!darkMode && <div className="w-2 h-2 rounded-full bg-[#0058be]"></div>}
              </div>
            </div>
            {/* Mini preview strip */}
            <div className="p-2 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] flex items-center gap-2 text-[10px] text-[#444651]">
              <div className="w-4 h-4 rounded bg-[#00236f]"></div>
              <div className="w-8 h-2 rounded bg-[#0058be]"></div>
              <div className="flex-1 h-2 rounded bg-white border border-[#c5c5d3]"></div>
            </div>
            <p className="text-[11px] text-[#757682] dark:text-[#94a3b8]">
              Crisp Scandinavian high-contrast light surfaces for standard office lighting.
            </p>
          </div>

          {/* Dark Mode Selector Card */}
          <div
            onClick={() => onToggleDarkMode(true)}
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between h-36 ${
              darkMode
                ? 'bg-[#18283f] border-[#6ffbbe] shadow-sm'
                : 'bg-[#f8f9ff] dark:bg-[#18283f] border-[#e5eeff] dark:border-[#1e2e48] hover:border-[#0058be]/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#6ffbbe] text-[20px]">dark_mode</span>
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white">Dark Mode</span>
              </div>
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                darkMode ? 'border-[#6ffbbe]' : 'border-[#757682]'
              }`}>
                {darkMode && <div className="w-2 h-2 rounded-full bg-[#6ffbbe]"></div>}
              </div>
            </div>
            {/* Mini preview strip */}
            <div className="p-2 rounded-lg bg-[#0b1320] border border-[#1e2e48] flex items-center gap-2 text-[10px] text-[#94a3b8]">
              <div className="w-4 h-4 rounded bg-[#1e3a8a]"></div>
              <div className="w-8 h-2 rounded bg-[#2170e4]"></div>
              <div className="flex-1 h-2 rounded bg-[#132238] border border-[#223854]"></div>
            </div>
            <p className="text-[11px] text-[#757682] dark:text-[#94a3b8]">
              Deep midnight navy palette designed for reduced eye strain and low-light environments.
            </p>
          </div>
        </div>

        {/* Quick Toggle Switch Row */}
        <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">
              palette
            </span>
            <div>
              <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">
                Enable Global Dark Mode
              </span>
              <span className="text-[11px] text-[#757682] dark:text-[#94a3b8]">
                Dynamically inverts backgrounds, cards, and typography across all views
              </span>
            </div>
          </div>

          {/* Accessible Switch Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            onClick={() => onToggleDarkMode(!darkMode)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              darkMode ? 'bg-[#0058be]' : 'bg-[#c5c5d3]'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Biometric & Attendance Automation */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-2 pb-2 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">fingerprint</span>
          <h3 className="text-sm font-bold text-[#0b1c30] dark:text-white">Biometric & Geofencing Automation</h3>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <div>
              <span className="font-bold text-[#0b1c30] dark:text-white block">Automated Departure Clock-Out</span>
              <span className="text-[#757682] dark:text-[#94a3b8]">Automatically logs departure at 06:00 PM standard shift end</span>
            </div>
            <input
              type="checkbox"
              checked={autoClockOut}
              onChange={(e) => setAutoClockOut(e.target.checked)}
              className="w-4 h-4 accent-[#00236f]"
            />
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <div>
              <span className="font-bold text-[#0b1c30] dark:text-white block">802.11ax Beacon Geo-Fencing Tag</span>
              <span className="text-[#757682] dark:text-[#94a3b8]">HQ Main Campus Floor 4 automatic radius check-in handshake</span>
            </div>
            <input
              type="checkbox"
              checked={beaconGeo}
              onChange={(e) => setBeaconGeo(e.target.checked)}
              className="w-4 h-4 accent-[#00236f]"
            />
          </div>
        </div>
      </div>

      {/* Enterprise Identity & Session Profile */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">badge</span>
            <h3 className="text-sm font-bold text-[#0b1c30] dark:text-white">Enterprise Identity & Authentication</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#6ffbbe] border border-[#dce9ff] dark:border-[#223854]">
            SSO SAML 2.0 Connected
          </span>
        </div>

        <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#0058be] dark:ring-[#6ffbbe] shrink-0">
              <img
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256'}
                alt={currentUser?.name || 'User'}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[#0b1c30] dark:text-white">
                  {currentUser?.name || `${currentUser?.firstName || 'Evelyn'} ${currentUser?.lastName || 'Chen-Vance'}`}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#00236f] text-white text-[10px] font-bold">
                  {currentUser?.role || 'VP of People Ops'}
                </span>
              </div>
              <span className="text-xs text-[#757682] dark:text-[#94a3b8] block">
                {currentUser?.email || 'evelyn.vance@omniahealth.org'}
              </span>
              <span className="text-[11px] text-[#0058be] dark:text-[#6ffbbe] font-medium block mt-0.5">
                Workspace: {currentUser?.companyName || 'Omnia Health Systems'} ({currentUser?.companySize || '5,000+ Enterprise'})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateAuth && (
              <button
                type="button"
                onClick={() => onNavigateAuth('signup')}
                className="px-3 py-1.5 rounded-lg border border-[#0058be] text-[#0058be] dark:text-[#6ffbbe] dark:border-[#6ffbbe]/40 text-xs font-semibold hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors"
              >
                New Workspace
              </button>
            )}
            {onSignOut && (
              <button
                type="button"
                onClick={onSignOut}
                className="px-3 py-1.5 rounded-lg bg-[#ba1a1a] hover:bg-[#93000a] text-white text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Payroll Bank Details */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-2 pb-2 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">account_balance</span>
          <h3 className="text-sm font-bold text-[#0b1c30] dark:text-white">Disbursement Bank Account</h3>
        </div>

        <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#132238] flex items-center justify-center text-[#00236f] dark:text-[#6ffbbe] shadow-xs">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
            </div>
            <div>
              <span className="text-sm font-bold text-[#0b1c30] dark:text-white block">Standard Chartered Bank</span>
              <span className="text-xs text-[#757682] dark:text-[#94a3b8] font-mono">Routing: 021000021 • Account: •••• 4821</span>
            </div>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#27c38a]/15 text-[#004a31] dark:text-[#6ffbbe] text-xs font-bold border border-[#27c38a]/30">
            Primary Active
          </span>
        </div>
      </div>

      {/* Compliance Standard */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm space-y-3 transition-colors">
        <div className="flex items-center gap-2 pb-2 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <span className="material-symbols-outlined text-[#004a31] dark:text-[#27c38a] text-[20px]">verified_user</span>
          <h3 className="text-sm font-bold text-[#0b1c30] dark:text-white">Compliance & Certifications</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <span className="font-bold text-[#00236f] dark:text-[#90a8ff] block">SOC-2 Type II</span>
            <span className="text-[#757682] dark:text-[#94a3b8] mt-0.5 block">Audited Annually</span>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <span className="font-bold text-[#00236f] dark:text-[#90a8ff] block">ISO 27001 Certified</span>
            <span className="text-[#757682] dark:text-[#94a3b8] mt-0.5 block">Global Security Standard</span>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <span className="font-bold text-[#00236f] dark:text-[#90a8ff] block">AES-256 GCM</span>
            <span className="text-[#757682] dark:text-[#94a3b8] mt-0.5 block">Encrypted at rest & transit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
