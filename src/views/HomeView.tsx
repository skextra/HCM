import React, { useState, useEffect } from 'react';
import { ActiveShiftState, Employee, ManagerApprovalItem, ShiftLog } from '../types';

interface HomeViewProps {
  activeShift: ActiveShiftState;
  onClockAction: (action: 'clock-in' | 'clock-out' | 'toggle-break') => void;
  onOpenLeaveModal: () => void;
  onOpenPayslipModal: () => void;
  onOpenRegularizeModal: () => void;
  onOpenOvertimeModal: () => void;
  onOpenExpenseModal: () => void;
  onSelectEmployee: (emp: Employee) => void;
  onNavigateTab: (tab: any) => void;
  pendingApprovals: ManagerApprovalItem[];
  onDecisionApproval: (id: string, approved: boolean) => void;
  employees: Employee[];
}

export const HomeView: React.FC<HomeViewProps> = ({
  activeShift,
  onClockAction,
  onOpenLeaveModal,
  onOpenPayslipModal,
  onOpenRegularizeModal,
  onOpenOvertimeModal,
  onOpenExpenseModal,
  onSelectEmployee,
  onNavigateTab,
  pendingApprovals,
  onDecisionApproval,
  employees,
}) => {
  const [currentSeconds, setCurrentSeconds] = useState(activeShift.elapsedSeconds);
  const [meetingJoined, setMeetingJoined] = useState(false);

  useEffect(() => {
    if (!activeShift.isActive || activeShift.isOnBreak) return;
    const interval = setInterval(() => {
      setCurrentSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeShift.isActive, activeShift.isOnBreak]);

  const formatHMS = (totalSecs: number) => {
    const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
    const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
    const secs = String(totalSecs % 60).padStart(2, '0');
    return `${hrs}h ${mins}m ${secs}s`;
  };

  const directTeam = employees.slice(0, 4);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-10">
      {/* 1. Employee Greeting & Context Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#132238] p-5 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"
              alt="Tariq Profile"
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-[#eff4ff] dark:ring-[#1e2e48]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#27c38a] flex items-center justify-center text-white ring-2 ring-white dark:ring-[#132238]">
              <span className="material-symbols-outlined text-[10px]">bolt</span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#00236f] dark:text-[#90a8ff]">
                Good Morning, Tariq
              </h1>
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#6ffbbe] text-[#002113]">
                <span className="material-symbols-outlined text-[14px]">verified</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#444651] dark:text-[#94a3b8] mt-0.5">
              Senior Lead Product Designer • Systems & Experience • EMP-04182
            </p>
          </div>
        </div>

        {/* Live Clock Capsule */}
        <div className="flex items-center gap-3 bg-[#eff4ff] dark:bg-[#18283f] px-4 py-2 rounded-xl border border-[#dce9ff] dark:border-[#223854] self-start sm:self-auto shadow-xs">
          <div className="w-2.5 h-2.5 rounded-full bg-[#0058be] dark:bg-[#6ffbbe] animate-pulse"></div>
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-[#0058be] dark:text-[#6ffbbe] font-mono tracking-tight">09:41 AM</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#757682] dark:text-[#94a3b8]">
              Thu, 24 Oct 2024
            </span>
          </div>
        </div>
      </div>

      {/* 2. Hero Shift Live Widget */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] p-5 sm:p-6 shadow-sm transition-colors">
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#dce1ff]/40 dark:bg-[#1e3a8a]/20 blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-[#dce9ff] dark:bg-[#1f324e] text-[#00236f] dark:text-[#6ffbbe] shadow-sm">
              <span className="material-symbols-outlined text-[24px]">timer</span>
              <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-[#27c38a] ring-2 ring-white dark:ring-[#132238]"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-[#0b1c30] dark:text-white">
                  {activeShift.isActive ? 'Shift Active' : 'Shift Off-Duty'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#27c38a]/15 text-[#004a31] dark:text-[#6ffbbe] text-xs font-bold border border-[#27c38a]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27c38a]"></span>
                  {activeShift.isActive ? (activeShift.isOnBreak ? 'On Break' : 'Present') : 'Completed'}
                </span>
              </div>
              <p className="text-xs text-[#757682] dark:text-[#94a3b8] flex items-center gap-1 mt-0.5">
                <span className="material-symbols-outlined text-[15px]">login</span>
                <span>Checked In at {activeShift.clockInTime} • Biometric Verified</span>
              </p>
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854] self-start md:self-auto">
            <span className="material-symbols-outlined text-[14px]">near_me</span>
            <span>{activeShift.geofence}</span>
          </span>
        </div>

        {/* Live Timer Section */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
          <div className="flex flex-col text-center sm:text-left">
            <span className="text-[11px] font-bold text-[#757682] dark:text-[#94a3b8] uppercase tracking-wider">
              Logged Work Duration
            </span>
            <div className="flex items-baseline justify-center sm:justify-start gap-2 mt-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-[#00236f] dark:text-[#6ffbbe] tracking-tight font-mono">
                {activeShift.isActive ? formatHMS(currentSeconds) : '08h 15m 00s'}
              </span>
              <span className="text-xs text-[#757682] dark:text-[#94a3b8] font-medium">/ 8h 00m standard quota</span>
            </div>
          </div>

          {/* SVG Progress Ring */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 48 48">
                <circle
                  className="text-[#d3e4fe] dark:text-[#223854]"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="20"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <circle
                  className="text-[#0058be] dark:text-[#6ffbbe] transition-all duration-1000 ease-out"
                  cx="24"
                  cy="24"
                  fill="none"
                  r="20"
                  stroke="currentColor"
                  strokeDasharray="125.6"
                  strokeDashoffset={125.6 - (125.6 * 60) / 100}
                  strokeLinecap="round"
                  strokeWidth="4.5"
                ></circle>
              </svg>
              <span className="absolute text-xs font-bold text-[#00236f] dark:text-white font-mono">60%</span>
            </div>
            <div className="flex flex-col text-xs text-[#444651] dark:text-[#cbd5e1]">
              <span className="font-semibold text-[#0058be] dark:text-[#90a8ff]">Pace: Normal (+15m)</span>
              <span className="text-[#757682] dark:text-[#94a3b8]">Expected Departure: 06:00 PM</span>
            </div>
          </div>
        </div>

        {/* Punch Controls */}
        <div className="flex items-center gap-3 mt-4 pt-1">
          {activeShift.isActive ? (
            <button
              onClick={() => onClockAction('clock-out')}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#00236f] dark:bg-[#0058be] hover:bg-[#1e3a8a] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Clock Out</span>
            </button>
          ) : (
            <button
              onClick={() => onClockAction('clock-in')}
              className="flex-1 flex items-center justify-center gap-2 h-12 rounded-xl bg-[#27c38a] hover:bg-[#209f71] text-white font-semibold text-sm transition-all shadow-sm active:scale-[0.98]"
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              <span>Clock In</span>
            </button>
          )}

          <button
            onClick={() => onClockAction('toggle-break')}
            title="Take / Resume Break"
            className={`h-12 px-5 flex items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-all active:scale-[0.98] ${
              activeShift.isOnBreak
                ? 'bg-[#004a31] text-[#6ffbbe] border-[#004a31]'
                : 'bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#00236f] dark:text-[#cbd5e1] border-[#dce9ff] dark:border-[#223854]'
            }`}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">coffee</span>
            <span>{activeShift.isOnBreak ? 'Resume Work' : 'Take Break'}</span>
          </button>
        </div>
      </div>

      {/* 3. Quick Stats Bento (3 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Attendance */}
        <div
          onClick={() => onNavigateTab('attendance')}
          className="p-4 rounded-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm hover:border-[#0058be]/40 transition-all cursor-pointer group flex flex-col justify-between h-32"
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[22px]">event_available</span>
            <span className="inline-flex items-center text-[11px] font-bold text-[#004a31] dark:text-[#6ffbbe] bg-[#eff4ff] dark:bg-[#18283f] px-2 py-0.5 rounded-full border border-[#dce9ff] dark:border-[#223854]">
              +1.2%
            </span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#00236f] dark:text-white group-hover:text-[#0058be] dark:group-hover:text-[#6ffbbe] transition-colors">
              96.4%
            </span>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-0.5">Attendance Pace (Q4)</p>
          </div>
        </div>

        {/* Leave Balance */}
        <div
          onClick={() => onNavigateTab('leaves')}
          className="p-4 rounded-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm hover:border-[#0058be]/40 transition-all cursor-pointer group flex flex-col justify-between h-32"
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[22px]">beach_access</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#0058be] dark:bg-[#6ffbbe]"></span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#00236f] dark:text-white group-hover:text-[#0058be] dark:group-hover:text-[#6ffbbe] transition-colors">
              14 Days
            </span>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-0.5">Leave Balance Remaining</p>
          </div>
        </div>

        {/* Next Payday */}
        <div
          onClick={() => onNavigateTab('payroll')}
          className="p-4 rounded-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm hover:border-[#0058be]/40 transition-all cursor-pointer group flex flex-col justify-between h-32"
        >
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[22px]">account_balance_wallet</span>
            <span className="text-xs font-semibold text-[#757682] dark:text-[#94a3b8]">Oct 31</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-[#00236f] dark:text-white group-hover:text-[#0058be] dark:group-hover:text-[#6ffbbe] transition-colors">
              6 Days
            </span>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-0.5">Next Payday Disbursement</p>
          </div>
        </div>
      </div>

      {/* 4. Frequent Actions Shortcuts */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#444651] dark:text-[#94a3b8]">Workforce Direct Actions</h2>
          <span className="text-xs text-[#757682] dark:text-[#64748b]">1-Tap Shortcuts</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            onClick={onOpenLeaveModal}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#132238] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-all group"
            type="button"
          >
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-[#00236f] dark:text-[#6ffbbe] group-hover:bg-[#00236f] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <span className="text-xs font-bold text-[#0b1c30] dark:text-white mt-2 group-hover:text-[#00236f] dark:group-hover:text-[#6ffbbe]">Apply Leave</span>
            <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">PTO / Sick / Remote</span>
          </button>

          <button
            onClick={onOpenPayslipModal}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#132238] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-all group"
            type="button"
          >
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] group-hover:bg-[#0058be] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
              <span className="material-symbols-outlined text-[22px]">receipt_long</span>
            </div>
            <span className="text-xs font-bold text-[#0b1c30] dark:text-white mt-2 group-hover:text-[#0058be] dark:group-hover:text-[#90a8ff]">Payslip</span>
            <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">Statements & Tax</span>
          </button>

          <button
            onClick={onOpenExpenseModal}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#132238] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-all group"
            type="button"
          >
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-[#004a31] dark:text-[#27c38a] group-hover:bg-[#004a31] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
              <span className="material-symbols-outlined text-[22px]">price_check</span>
            </div>
            <span className="text-xs font-bold text-[#0b1c30] dark:text-white mt-2 group-hover:text-[#004a31] dark:group-hover:text-[#27c38a]">Claims</span>
            <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">Receipt refund</span>
          </button>

          <button
            onClick={onOpenOvertimeModal}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#132238] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-all group"
            type="button"
          >
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-[#2170e4] dark:text-[#6ffbbe] group-hover:bg-[#2170e4] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
              <span className="material-symbols-outlined text-[22px]">more_time</span>
            </div>
            <span className="text-xs font-bold text-[#0b1c30] dark:text-white mt-2 group-hover:text-[#2170e4] dark:group-hover:text-[#6ffbbe]">Overtime</span>
            <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">Extra hours log</span>
          </button>

          <button
            onClick={onOpenRegularizeModal}
            className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-[#132238] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-all col-span-2 sm:col-span-1 group"
            type="button"
          >
            <div className="w-12 h-12 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] group-hover:bg-[#00236f] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
              <span className="material-symbols-outlined text-[22px]">edit_calendar</span>
            </div>
            <span className="text-xs font-bold text-[#0b1c30] dark:text-white mt-2 group-hover:text-[#00236f] dark:group-hover:text-[#90a8ff]">Regularize</span>
            <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">Missed punch fix</span>
          </button>
        </div>
      </div>

      {/* 5. Weekly Attendance & Hours Track (Chart) */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col gap-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">bar_chart</span>
              <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Weekly Attendance & Hours Track</h3>
            </div>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-0.5">Recorded daily duration versus standard 8.0h baseline shift</p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-[#757682] dark:text-[#94a3b8]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#0058be] dark:bg-[#6ffbbe]"></span> Logged Hours
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-[#757682] dark:bg-[#64748b]"></span> 8.0h Target
            </div>
          </div>
        </div>

        {/* Bar chart canvas */}
        <div className="w-full bg-[#eff4ff]/60 dark:bg-[#18283f]/60 p-4 rounded-2xl border border-[#dce9ff] dark:border-[#223854]">
          <div className="w-full h-48 flex items-end justify-between px-4 pt-6 pb-2 relative">
            {/* Target 8h guideline */}
            <div className="absolute left-0 right-0 top-14 border-b border-dashed border-[#c5c5d3] dark:border-[#334155] flex items-center justify-end px-2 pointer-events-none">
              <span className="text-[10px] font-bold text-[#444651] dark:text-[#cbd5e1] bg-white dark:bg-[#132238] px-2 py-0.5 rounded-full border border-[#dce9ff] dark:border-[#223854] shadow-xs">
                Target 8.0h
              </span>
            </div>

            {/* Mon 8.5h */}
            <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
              <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">8.5h</span>
              <div className="w-8 sm:w-11 bg-[#0058be]/80 dark:bg-[#0058be] group-hover:bg-[#0058be] rounded-t-lg transition-all shadow-sm" style={{ height: '120px' }}></div>
              <span className="text-xs font-semibold text-[#444651] dark:text-[#cbd5e1]">Mon</span>
            </div>

            {/* Tue 8.2h */}
            <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
              <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">8.2h</span>
              <div className="w-8 sm:w-11 bg-[#0058be]/80 dark:bg-[#0058be] group-hover:bg-[#0058be] rounded-t-lg transition-all shadow-sm" style={{ height: '115px' }}></div>
              <span className="text-xs font-semibold text-[#444651] dark:text-[#cbd5e1]">Tue</span>
            </div>

            {/* Wed 9.0h */}
            <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
              <span className="text-xs font-bold text-[#0058be] dark:text-[#6ffbbe]">9.0h</span>
              <div className="w-8 sm:w-11 bg-[#0058be] dark:bg-[#6ffbbe] rounded-t-lg transition-all shadow-sm" style={{ height: '135px' }}></div>
              <span className="text-xs font-semibold text-[#444651] dark:text-[#cbd5e1]">Wed</span>
            </div>

            {/* Thu (Today) 4.8h in progress */}
            <div className="flex flex-col items-center gap-2 flex-1 group cursor-pointer">
              <span className="text-xs font-bold text-[#004a31] dark:text-[#27c38a]">4.8h*</span>
              <div className="w-8 sm:w-11 bg-[#27c38a] rounded-t-lg transition-all relative overflow-hidden shadow-sm" style={{ height: '80px' }}>
                <div className="absolute inset-0 bg-white/25 animate-pulse"></div>
              </div>
              <span className="text-xs font-bold text-[#00236f] dark:text-[#90a8ff]">Thu (Now)</span>
            </div>

            {/* Fri 8.0h */}
            <div className="flex flex-col items-center gap-2 flex-1 opacity-50">
              <span className="text-xs font-medium text-[#757682] dark:text-[#94a3b8]">8.0h</span>
              <div className="w-8 sm:w-11 bg-[#d3e4fe] dark:bg-[#223854] rounded-t-lg" style={{ height: '112px' }}></div>
              <span className="text-xs font-medium text-[#757682] dark:text-[#94a3b8]">Fri</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#dce9ff] dark:border-[#223854] mt-2 px-2 text-xs text-[#757682] dark:text-[#94a3b8]">
            <span className="flex items-center gap-1.5 font-semibold text-[#004a31] dark:text-[#27c38a]">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>Weekly Net: 30.5 hrs completed</span>
            </span>
            <span className="font-semibold text-[#0b1c30] dark:text-white bg-white dark:bg-[#132238] px-2.5 py-0.5 rounded-full border border-[#dce9ff] dark:border-[#223854] shadow-xs">
              Surplus: +1.7 hrs ahead
            </span>
          </div>
        </div>
      </div>

      {/* 6. Today's Schedule & Team Availability Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">event_note</span>
                <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Today's Schedule</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854]">
                3 Engagements
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {/* Meeting 1 */}
              <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex items-center justify-between gap-3 opacity-60">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-[#132238] flex flex-col items-center justify-center text-[#757682] dark:text-[#94a3b8] shrink-0 font-bold text-xs shadow-xs">
                    <span>09:00</span>
                    <span className="text-[10px] font-normal">AM</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white line-through block">
                      Sprint Alignment & Triage
                    </span>
                    <span className="text-[11px] text-[#757682] dark:text-[#94a3b8]">Room 302 (Nexus) • Finished</span>
                  </div>
                </div>
                <span className="text-[10px] bg-white dark:bg-[#132238] text-[#757682] dark:text-[#94a3b8] px-2 py-0.5 rounded-full border border-[#dce9ff] dark:border-[#223854]">
                  Done
                </span>
              </div>

              {/* Meeting 2 (Upcoming Highlight) */}
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#18283f] border-2 border-[#0058be]/30 dark:border-[#6ffbbe]/40 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#00236f] dark:bg-[#0058be] text-white flex flex-col items-center justify-center shrink-0 font-bold text-xs shadow-sm">
                    <span>01:30</span>
                    <span className="text-[10px] font-normal text-[#b6c4ff]">PM</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white">Pulse Design System Review</span>
                      <span className="px-1.5 py-0.2 rounded-full bg-[#27c38a]/20 text-[#004a31] dark:text-[#6ffbbe] text-[10px] font-bold">
                        Starts in 14m
                      </span>
                    </div>
                    <span className="text-[11px] text-[#757682] dark:text-[#94a3b8]">With Eleanor Vance (HR Dir) & Tech Leads</span>
                  </div>
                </div>
                <button
                  onClick={() => setMeetingJoined(!meetingJoined)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                    meetingJoined
                      ? 'bg-[#27c38a] text-white'
                      : 'bg-[#0058be] text-white hover:bg-[#004395]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">video_call</span>
                  <span>{meetingJoined ? 'Connected' : 'Join Bridge'}</span>
                </button>
              </div>

              {/* Meeting 3 */}
              <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-white dark:bg-[#132238] flex flex-col items-center justify-center text-[#00236f] dark:text-[#6ffbbe] shrink-0 font-bold text-xs shadow-xs">
                    <span>03:45</span>
                    <span className="text-[10px] font-normal text-[#757682] dark:text-[#94a3b8]">PM</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">Q4 HCM Headcount Planning Sync</span>
                    <span className="text-[11px] text-[#757682] dark:text-[#94a3b8]">Boardroom B (Floor 5) • In-Person Only</span>
                  </div>
                </div>
                <span className="text-[10px] bg-white dark:bg-[#132238] text-[#0058be] dark:text-[#90a8ff] px-2 py-0.5 rounded-full border border-[#dce9ff] dark:border-[#223854] font-semibold">
                  Scheduled
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Team Availability */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">groups</span>
                <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Design Pod Availability</h3>
              </div>
              <span className="text-xs text-[#757682] dark:text-[#94a3b8]">4 Direct Members</span>
            </div>

            <div className="space-y-3 mt-4">
              {directTeam.map((member) => (
                <div
                  key={member.id}
                  onClick={() => onSelectEmployee(member)}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-[#e5eeff] dark:ring-[#223854]"
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#27c38a] ring-2 ring-white dark:ring-[#132238]"></span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#0b1c30] dark:text-white group-hover:text-[#0058be] dark:group-hover:text-[#6ffbbe] truncate">
                        {member.name}
                      </p>
                      <p className="text-[11px] text-[#757682] dark:text-[#94a3b8] truncate">{member.role}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] border border-[#dce9ff] dark:border-[#223854] shrink-0">
                    {member.locationDetail}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('directory')}
            className="w-full mt-4 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-xs font-semibold text-[#00236f] dark:text-[#90a8ff] flex items-center justify-center gap-1 transition-all border border-[#dce9ff] dark:border-[#223854]"
          >
            <span>View Full Org Directory</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* 7. Manager Sign-off Pending Approvals */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col gap-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">assignment_turned_in</span>
            <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Manager Approvals & Sign-offs</h3>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#00236f] dark:bg-[#0058be] text-white text-xs font-bold shadow-xs">
            {pendingApprovals.length} Due
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pendingApprovals.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex flex-col justify-between gap-3 hover:border-[#0058be]/30 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-bold text-[#0b1c30] dark:text-white">{item.employeeName}</h4>
                    <p className="text-xs text-[#757682] dark:text-[#94a3b8]">{item.employeeRole} • {item.period}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#0058be] text-white text-[10px] font-bold">
                    {item.requestType}
                  </span>
                </div>
                <p className="text-xs text-[#444651] dark:text-[#cbd5e1] mt-2 italic bg-white/70 dark:bg-[#132238]/70 p-2.5 rounded-lg border border-[#e5eeff] dark:border-[#223854]">
                  "{item.reason}"
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-[#dce9ff] dark:border-[#223854]">
                <button
                  onClick={() => onDecisionApproval(item.id, true)}
                  className="flex-1 py-1.5 rounded-lg bg-[#00236f] dark:bg-[#0058be] hover:bg-[#1e3a8a] text-white text-xs font-semibold shadow-xs transition-all active:scale-95"
                >
                  Approve
                </button>
                <button
                  onClick={() => onDecisionApproval(item.id, false)}
                  className="flex-1 py-1.5 rounded-lg bg-white dark:bg-[#132238] hover:bg-[#eff4ff] dark:hover:bg-[#1f324e] text-[#ba1a1a] dark:text-[#ffdad6] border border-[#ffdad6] dark:border-[#ba1a1a]/40 text-xs font-semibold transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}

          {pendingApprovals.length === 0 && (
            <div className="col-span-2 py-6 text-center text-xs text-[#757682] dark:text-[#94a3b8]">
              All manager approvals are cleared and up to date!
            </div>
          )}
        </div>
      </div>

      {/* 8. Corporate Broadcasts & Notices */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col gap-3 transition-colors">
        <div className="flex items-center justify-between pb-2 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">campaign</span>
            <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Corporate Broadcasts</h3>
          </div>
          <span className="text-xs text-[#757682] dark:text-[#94a3b8] font-semibold">HR Notices</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-1">
          <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0058be] dark:text-[#6ffbbe]">
                Benefits Compliance
              </span>
              <span className="text-xs text-[#757682] dark:text-[#94a3b8]">Due Nov 15</span>
            </div>
            <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white">Annual Health & Dental Benefit Plan Renewal</h4>
            <p className="text-xs text-[#444651] dark:text-[#cbd5e1] mt-1 leading-snug">
              Open enrollment for FY25 healthcare packages closes midnight Nov 15. Review dependent details to prevent coverage disruption.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#004a31] dark:text-[#27c38a]">
                Facilities Alert
              </span>
              <span className="text-xs text-[#757682] dark:text-[#94a3b8]">Nov 01</span>
            </div>
            <h4 className="text-xs font-bold text-[#0b1c30] dark:text-white">Q4 Executive Townhall & HCM Roadmap</h4>
            <p className="text-xs text-[#444651] dark:text-[#cbd5e1] mt-1 leading-snug">
              Auditorium Level 2 + Global Stream. CEO & People leadership team presenting 2025 organizational framework.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
