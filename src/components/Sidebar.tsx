import React from 'react';
import { TabType } from '../types';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  pendingApprovalsCount?: number;
  onSignOut?: () => void;
  onNavigateAuth?: (route: 'login' | 'signup') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingApprovalsCount = 2,
  onSignOut,
  onNavigateAuth,
}) => {
  const navItems: { id: TabType; label: string; icon: string; badge?: number }[] = [
    { id: 'home', label: 'Dashboard / Home', icon: 'grid_view' },
    { id: 'attendance', label: 'Attendance & Timesheets', icon: 'schedule' },
    { id: 'leaves', label: 'Leave Management', icon: 'event_available', badge: pendingApprovalsCount },
    { id: 'payroll', label: 'Payroll & Compensation', icon: 'payments' },
    { id: 'directory', label: 'Employee Directory', icon: 'badge' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-[#1e3a8a] z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.08)]">
      {/* Brand Header */}
      <div className="flex flex-col">
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0058be] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-[22px]">vital_signs</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[19px] tracking-tight text-white leading-tight">
                Pulse<span className="text-[#6ffbbe]">HR</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-[#b6c4ff] font-semibold">
                HCM Suite
              </span>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-[#00236f]/60 text-[10px] font-bold text-[#6ffbbe] border border-[#6ffbbe]/30">
            v2.4
          </span>
        </div>

        {/* Section Label */}
        <div className="px-6 pt-5 pb-2">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#b6c4ff]/70">
            Workforce Core
          </span>
        </div>

        {/* Navigation List */}
        <nav className="flex flex-col gap-1 px-4">
          {navItems.map((item, idx) => {
            const isActive = currentTab === item.id;
            const isSettings = item.id === 'settings';

            return (
              <React.Fragment key={item.id}>
                {isSettings && <div className="my-2 border-t border-white/15" />}
                <button
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#00236f] text-white shadow-sm font-semibold'
                      : 'text-[#dce1ff] hover:bg-white/10 hover:text-white'
                  }`}
                  type="button"
                >
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#0058be] text-white text-[11px] font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Auth Portal Switcher in Sidebar */}
        <div className="px-4 mt-3 pt-3 border-t border-white/10 space-y-1">
          {onSignOut && (
            <button
              onClick={onSignOut}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#b6c4ff] hover:bg-white/10 hover:text-white transition-all text-left"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out / Switch Account</span>
            </button>
          )}
          {onNavigateAuth && (
            <button
              onClick={() => onNavigateAuth('signup')}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold text-[#6ffbbe] hover:bg-white/10 transition-all text-left"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">domain_add</span>
              <span>Register New Workspace</span>
            </button>
          )}
        </div>
      </div>

      {/* Compliance Footer Box */}
      <div className="p-4 m-4 rounded-xl bg-[#00236f]/70 border border-white/15 flex items-center justify-between gap-3 shadow-inner">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[#4edea3] animate-pulse shrink-0"></div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-white truncate">Live Compliance Sync</span>
            <span className="text-[10px] text-[#b6c4ff] truncate">US-East Verified • FedRAMP</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-[#b6c4ff] text-[18px]">verified_user</span>
      </div>
    </aside>
  );
};
