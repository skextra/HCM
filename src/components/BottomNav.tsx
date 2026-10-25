import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'grid_view' },
    { id: 'attendance', label: 'Attendance', icon: 'schedule' },
    { id: 'leaves', label: 'Leaves', icon: 'event_available' },
    { id: 'payroll', label: 'Payroll', icon: 'payments' },
    { id: 'directory', label: 'Directory', icon: 'group' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 pb-[env(safe-area-inset-bottom,0px)] bg-white/95 dark:bg-[#0f1b2d]/95 backdrop-blur-xl border-t border-[#e5eeff] dark:border-[#1e2e48] shadow-[0_-2px_12px_rgba(0,35,111,0.06)] transition-colors">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center w-14 h-full transition-all active:scale-95 ${
                isActive
                  ? 'text-[#00236f] dark:text-[#6ffbbe] font-semibold'
                  : 'text-[#444651] dark:text-[#94a3b8] hover:text-[#00236f] dark:hover:text-white'
              }`}
              type="button"
            >
              <span
                className="material-symbols-outlined text-[24px] transition-transform duration-150"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {tab.icon}
              </span>
              <span className="text-[11px] tracking-tight mt-0.5">{tab.label}</span>
              {isActive && (
                <span className="w-1.5 h-1 rounded-full bg-[#00236f] dark:bg-[#6ffbbe] -mt-0.5"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
