import React from 'react';
import { TabType, ActiveShiftState } from '../types';

interface HeaderProps {
  currentTab: TabType;
  activeShift: ActiveShiftState;
  onClockAction: (action: 'clock-in' | 'clock-out' | 'toggle-break') => void;
  onOpenCommandPalette: () => void;
  viewMode: 'desktop' | 'mobile-frame';
  onToggleViewMode: () => void;
  onOpenProfile: () => void;
  unreadNotifications: number;
  onOpenNotifications: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  currentUser?: any;
  onSignOut?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  activeShift,
  onClockAction,
  onOpenCommandPalette,
  viewMode,
  onToggleViewMode,
  onOpenProfile,
  unreadNotifications,
  onOpenNotifications,
  darkMode,
  onToggleDarkMode,
  currentUser,
  onSignOut,
}) => {
  const getTabTitle = (tab: TabType) => {
    switch (tab) {
      case 'home':
        return 'Home';
      case 'attendance':
        return 'Attendance';
      case 'leaves':
        return 'Leaves';
      case 'payroll':
        return 'Payroll';
      case 'directory':
        return 'Directory';
      case 'settings':
        return 'Settings';
    }
  };

  const formatElapsed = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    return `${hrs}h ${mins}m`;
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-[#0f1b2d]/90 backdrop-blur-xl z-40 border-b border-[#e5eeff] dark:border-[#1e2e48] px-4 lg:px-8 flex items-center justify-between shadow-[0_1px_8px_rgba(0,35,111,0.04)] transition-colors">
      {/* Brand & Breadcrumb */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-[#00236f] dark:bg-[#1e3a8a] flex items-center justify-center text-white shadow-sm">
            <span className="material-symbols-outlined text-[20px]">vital_signs</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-[19px] tracking-tight text-[#00236f] dark:text-[#90a8ff]">
              Pulse<span className="text-[#0058be] dark:text-[#6ffbbe]">HR</span>
            </span>
            <span className="text-[#c5c5d3] dark:text-[#64748b] text-sm">/</span>
            <h1 className="text-sm font-semibold text-[#444651] dark:text-[#cbd5e1] max-w-[150px] truncate">
              {getTabTitle(currentTab)}
            </h1>
          </div>
        </div>
      </div>

      {/* Middle Search (Desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <button
          onClick={onOpenCommandPalette}
          className="w-full h-10 px-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#444651] dark:text-[#cbd5e1] border border-[#dce9ff] dark:border-[#223854] text-sm flex items-center justify-between transition-colors shadow-sm"
          type="button"
        >
          <div className="flex items-center gap-2 text-[#757682] dark:text-[#94a3b8]">
            <span className="material-symbols-outlined text-[18px]">search</span>
            <span>Search employees, records, or type a command...</span>
          </div>
          <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white dark:bg-[#132238] text-[#444651] dark:text-[#cbd5e1] text-[11px] font-semibold border border-[#c5c5d3]/40 dark:border-[#334155]">
            <span>⌘</span>
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Theme Toggle Button */}
        <button
          onClick={onToggleDarkMode}
          title={darkMode ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#0058be] dark:text-[#6ffbbe] border border-[#dce9ff] dark:border-[#223854] transition-all"
          type="button"
          aria-label="Toggle Theme"
        >
          <span className="material-symbols-outlined text-[19px]">
            {darkMode ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        {/* Frame Mode Switcher Toggle */}
        <button
          onClick={onToggleViewMode}
          title={viewMode === 'desktop' ? 'Switch to Mobile View Frame' : 'Switch to Desktop Layout'}
          className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#0058be] dark:text-[#90a8ff] border border-[#dce9ff] dark:border-[#223854] transition-all"
        >
          <span className="material-symbols-outlined text-[16px]">
            {viewMode === 'desktop' ? 'smartphone' : 'desktop_windows'}
          </span>
          <span>{viewMode === 'desktop' ? 'Mobile Mode' : 'Desktop Mode'}</span>
        </button>

        {/* Shift Active Capsule (Desktop) */}
        {activeShift.isActive ? (
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#27c38a] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#0b1c30] dark:text-[#f1f5f9]">Shift Active</span>
            </div>
            <span className="text-[#c5c5d3] dark:text-[#64748b]">|</span>
            <span className="text-xs font-mono font-medium text-[#444651] dark:text-[#94a3b8]">
              {formatElapsed(activeShift.elapsedSeconds)}
            </span>
            <button
              onClick={() => onClockAction('clock-out')}
              className="ml-1 px-2.5 py-1 rounded-full bg-[#00236f] dark:bg-[#0058be] hover:bg-[#1e3a8a] text-white text-[11px] font-semibold transition-all active:scale-95"
              type="button"
            >
              Clock Out
            </button>
          </div>
        ) : (
          <button
            onClick={() => onClockAction('clock-in')}
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#27c38a] hover:bg-[#209f71] text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">login</span>
            <span>Clock In</span>
          </button>
        )}

        {/* Notifications */}
        <button
          onClick={onOpenNotifications}
          aria-label="Notifications"
          className="relative w-10 h-10 flex items-center justify-center rounded-full text-[#444651] dark:text-[#cbd5e1] hover:text-[#00236f] dark:hover:text-white hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors"
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {unreadNotifications > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a]"></span>
          )}
        </button>

        {/* User Profile Pill */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenProfile}
            aria-label="User Profile"
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors group"
            type="button"
          >
            <img
              src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#dce9ff] dark:ring-[#223854]"
            />
            <div className="hidden xl:flex flex-col text-left leading-tight">
              <span className="text-xs font-semibold text-[#0b1c30] dark:text-white group-hover:text-[#0058be] dark:group-hover:text-[#6ffbbe] truncate max-w-[120px]">
                {currentUser?.firstName || currentUser?.name?.split(' ')[0] || 'Tariq'}
              </span>
              <span className="text-[10px] text-[#757682] dark:text-[#94a3b8] truncate max-w-[120px]">
                {currentUser?.role || 'Lead Designer'}
              </span>
            </div>
          </button>

          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out / Switch Enterprise Session"
              className="w-8 h-8 rounded-xl flex items-center justify-center text-[#757682] hover:text-[#ba1a1a] dark:text-[#94a3b8] dark:hover:text-[#ffb4ab] hover:bg-[#ffdad6]/40 transition-colors"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
