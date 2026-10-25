import React, { useState } from 'react';
import { ActiveShiftState, RegularizationItem, ShiftLog } from '../types';

interface AttendanceViewProps {
  activeShift: ActiveShiftState;
  shiftLogs: ShiftLog[];
  regularizations: RegularizationItem[];
  onOpenRegularizeModal: () => void;
  onClockAction: (action: 'clock-in' | 'clock-out' | 'toggle-break') => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  activeShift,
  shiftLogs,
  regularizations,
  onOpenRegularizeModal,
  onClockAction,
}) => {
  const [selectedDay, setSelectedDay] = useState('24');
  const [activeTab, setActiveTab] = useState<'table' | 'cards'>('cards');
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const handleExportTimesheet = () => {
    const headers = 'Date,Shift Category,Clock In,Clock Out,Effective Hours,Status\n';
    const rows = shiftLogs
      .map((l) => `"${l.date}","${l.shiftProfile}","${l.clockIn}","${l.clockOut}","${l.effectiveHrs}","${l.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PulseHR_Timesheet_October_2024.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Timesheet CSV downloaded successfully!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const getStatusBadge = (status: ShiftLog['status'], lateMinutes?: number, otHours?: number) => {
    switch (status) {
      case 'Present':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#27c38a]/15 text-[#004a31] dark:text-[#6ffbbe] text-xs font-semibold border border-[#27c38a]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27c38a]"></span> Present
          </span>
        );
      case 'Late':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0058be]"></span> Late {lateMinutes || 12}m
          </span>
        );
      case 'Overtime':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#00236f] dark:text-[#6ffbbe] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00236f] dark:bg-[#6ffbbe]"></span> Overtime +{otHours || 1.5}h
          </span>
        );
      case 'Holiday':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#dce1ff] dark:bg-[#1e3a8a]/60 text-[#00236f] dark:text-[#90a8ff] text-xs font-semibold">
            <span className="material-symbols-outlined text-[13px]">celebration</span> Holiday
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#757682] dark:text-[#94a3b8] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854]">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* 1. Month Selector & Global Status Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#132238] p-5 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] dark:text-white">October 2024</h2>
            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] text-xs font-bold border border-[#dce9ff] dark:border-[#223854]">
              Q4 FY24
            </span>
          </div>
          <div className="flex items-center gap-1 bg-[#eff4ff] dark:bg-[#18283f] rounded-full p-1 border border-[#dce9ff] dark:border-[#223854]">
            <button
              aria-label="Previous month"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#444651] dark:text-[#cbd5e1] hover:text-[#00236f] dark:hover:text-white hover:bg-white dark:hover:bg-[#132238] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_left</span>
            </button>
            <button
              aria-label="Next month"
              className="w-7 h-7 rounded-full flex items-center justify-center text-[#444651] dark:text-[#cbd5e1] hover:text-[#00236f] dark:hover:text-white hover:bg-white dark:hover:bg-[#132238] transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportTimesheet}
            className="px-3.5 py-2 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#00236f] dark:text-[#cbd5e1] text-xs font-semibold flex items-center gap-1.5 border border-[#dce9ff] dark:border-[#223854] transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export Timesheet</span>
          </button>
          <button
            onClick={onOpenRegularizeModal}
            className="px-3.5 py-2 rounded-xl bg-[#00236f] dark:bg-[#0058be] hover:bg-[#1e3a8a] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">edit_calendar</span>
            <span>Regularize Punch</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 bg-[#27c38a]/15 text-[#004a31] dark:text-[#6ffbbe] border border-[#27c38a]/30 rounded-xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Monthly Summary Stat Pills Strip */}
      <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm whitespace-nowrap">
          <span className="w-2.5 h-2.5 rounded-full bg-[#27c38a] animate-pulse"></span>
          <span className="text-xs font-bold text-[#004a31] dark:text-[#6ffbbe]">20 Present</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm whitespace-nowrap">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0058be]"></span>
          <span className="text-xs font-bold text-[#0058be] dark:text-[#90a8ff]">1 Late</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm whitespace-nowrap">
          <span className="w-2.5 h-2.5 rounded-full bg-[#757682]"></span>
          <span className="text-xs font-bold text-[#444651] dark:text-[#94a3b8]">0 Absent</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#132238] border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm whitespace-nowrap">
          <span className="material-symbols-outlined text-[15px] text-[#00236f] dark:text-[#6ffbbe]">celebration</span>
          <span className="text-xs font-bold text-[#00236f] dark:text-[#cbd5e1]">2 Holidays</span>
        </div>
      </div>

      {/* 2. Weekly Attendance Strip */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-[#757682] dark:text-[#94a3b8] uppercase tracking-wider">
            WEEK 43 (OCT 21 - 25)
          </span>
          <span className="text-xs font-semibold text-[#0058be] dark:text-[#6ffbbe] flex items-center gap-1 cursor-pointer hover:underline">
            <span className="material-symbols-outlined text-[14px]">tune</span> View Calendar Matrix
          </span>
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-3 text-center">
          {/* Mon 21 */}
          <div
            onClick={() => setSelectedDay('21')}
            className={`flex flex-col items-center py-3 px-2 rounded-xl cursor-pointer transition-all ${
              selectedDay === '21'
                ? 'bg-[#eff4ff] dark:bg-[#18283f] ring-2 ring-[#0058be] dark:ring-[#6ffbbe]'
                : 'bg-[#eff4ff]/60 dark:bg-[#18283f]/60 hover:bg-[#eff4ff] dark:hover:bg-[#18283f]'
            }`}
          >
            <span className="text-xs font-semibold text-[#757682] dark:text-[#94a3b8]">MON</span>
            <span className="text-base sm:text-lg font-bold text-[#0b1c30] dark:text-white mt-0.5">21</span>
            <div className="w-2 h-2 rounded-full bg-[#27c38a] mt-2"></div>
          </div>

          {/* Tue 22 */}
          <div
            onClick={() => setSelectedDay('22')}
            className={`flex flex-col items-center py-3 px-2 rounded-xl cursor-pointer transition-all ${
              selectedDay === '22'
                ? 'bg-[#eff4ff] dark:bg-[#18283f] ring-2 ring-[#0058be] dark:ring-[#6ffbbe]'
                : 'bg-[#eff4ff]/60 dark:bg-[#18283f]/60 hover:bg-[#eff4ff] dark:hover:bg-[#18283f]'
            }`}
          >
            <span className="text-xs font-semibold text-[#757682] dark:text-[#94a3b8]">TUE</span>
            <span className="text-base sm:text-lg font-bold text-[#0b1c30] dark:text-white mt-0.5">22</span>
            <div className="w-2 h-2 rounded-full bg-[#0058be] mt-2"></div>
          </div>

          {/* Wed 23 */}
          <div
            onClick={() => setSelectedDay('23')}
            className={`flex flex-col items-center py-3 px-2 rounded-xl cursor-pointer transition-all ${
              selectedDay === '23'
                ? 'bg-[#eff4ff] dark:bg-[#18283f] ring-2 ring-[#0058be] dark:ring-[#6ffbbe]'
                : 'bg-[#eff4ff]/60 dark:bg-[#18283f]/60 hover:bg-[#eff4ff] dark:hover:bg-[#18283f]'
            }`}
          >
            <span className="text-xs font-semibold text-[#757682] dark:text-[#94a3b8]">WED</span>
            <span className="text-base sm:text-lg font-bold text-[#0b1c30] dark:text-white mt-0.5">23</span>
            <div className="w-2 h-2 rounded-full bg-[#27c38a] mt-2"></div>
          </div>

          {/* Thu 24 (Active Today) */}
          <div
            onClick={() => setSelectedDay('24')}
            className="flex flex-col items-center py-3 px-2 rounded-xl bg-[#00236f] dark:bg-[#0058be] text-white shadow-md relative scale-105 cursor-pointer ring-2 ring-[#00236f] dark:ring-[#6ffbbe]"
          >
            <span className="text-xs font-semibold text-[#dce1ff]">THU</span>
            <span className="text-base sm:text-lg font-bold text-white mt-0.5">24</span>
            <div className="w-2.5 h-2.5 rounded-full bg-[#6ffbbe] mt-2 shadow-[0_0_8px_rgba(111,251,190,0.8)]"></div>
            <span className="absolute -top-2 -right-1 px-1.5 py-0.2 rounded-full bg-[#004a31] text-[#6ffbbe] text-[9px] font-bold uppercase tracking-wider">
              Today
            </span>
          </div>

          {/* Fri 25 */}
          <div
            onClick={() => setSelectedDay('25')}
            className="flex flex-col items-center py-3 px-2 rounded-xl bg-white dark:bg-[#18283f] border border-[#e5eeff] dark:border-[#223854] opacity-60"
          >
            <span className="text-xs font-semibold text-[#757682] dark:text-[#94a3b8]">FRI</span>
            <span className="text-base sm:text-lg font-bold text-[#0b1c30] dark:text-white mt-0.5">25</span>
            <div className="w-2 h-2 rounded-full bg-[#c5c5d3] dark:bg-[#334155] mt-2"></div>
          </div>
        </div>

        {/* Active Day Status Banner */}
        <div className="mt-5 p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27c38a] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#27c38a]"></span>
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                On Time • Checked in at {activeShift.clockInTime}
              </span>
              <span className="text-xs text-[#757682] dark:text-[#94a3b8]">Currently active at {activeShift.geofence}</span>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full bg-white dark:bg-[#132238] text-[#00236f] dark:text-[#6ffbbe] text-xs font-bold border border-[#dce9ff] dark:border-[#223854] self-start sm:self-auto shadow-xs">
            Shift in Progress
          </span>
        </div>
      </div>

      {/* 3. Working Hours KPI Summary Card */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00236f] dark:text-[#6ffbbe] text-[22px]">timelapse</span>
            <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Working Hours KPI</h3>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#757682] dark:text-[#94a3b8]">
            Cycle Closes in 7d
          </span>
        </div>

        {/* Main Progress Indicator */}
        <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex flex-col gap-2.5">
          <div className="flex justify-between items-baseline">
            <span className="text-xs font-semibold text-[#444651] dark:text-[#cbd5e1]">Total Logged</span>
            <div className="flex items-baseline gap-1 font-mono">
              <span className="text-2xl font-bold text-[#00236f] dark:text-[#6ffbbe]">168.5</span>
              <span className="text-xs text-[#757682] dark:text-[#94a3b8]">/ 176.0 hrs</span>
            </div>
          </div>

          <div className="w-full h-3 rounded-full bg-[#dce9ff] dark:bg-[#223854] overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-[#0058be] dark:bg-[#6ffbbe] transition-all duration-700"
              style={{ width: '95.7%' }}
            ></div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-[#004a31] dark:text-[#27c38a] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">check_circle</span>
              <span>95.7% required pace</span>
            </span>
            <span className="text-[#757682] dark:text-[#94a3b8] font-medium">7.5 hrs remaining</span>
          </div>
        </div>

        {/* Secondary KPI Splits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-3.5">
          <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex flex-col">
            <span className="text-xs text-[#757682] dark:text-[#94a3b8] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#0058be] dark:text-[#6ffbbe]">speed</span>
              <span>Avg Daily Hours</span>
            </span>
            <span className="text-lg font-bold text-[#0b1c30] dark:text-white mt-1 font-mono">8h 25m</span>
            <span className="text-xs text-[#004a31] dark:text-[#27c38a] font-semibold mt-0.5">+15m vs target</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex flex-col">
            <span className="text-xs text-[#757682] dark:text-[#94a3b8] flex items-center gap-1 font-medium">
              <span className="material-symbols-outlined text-[16px] text-[#00236f] dark:text-[#6ffbbe]">more_time</span>
              <span>Overtime Logged</span>
            </span>
            <span className="text-lg font-bold text-[#00236f] dark:text-[#6ffbbe] mt-1 font-mono">+6.5 hrs</span>
            <span className="text-xs text-[#0058be] dark:text-[#90a8ff] font-semibold mt-0.5">Approved & Billable</span>
          </div>
        </div>
      </div>

      {/* 4. Today's Detailed Shift Log Breakdown */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">badge</span>
            <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Today's Shift Log</h3>
          </div>
          <span className="px-3 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854]">
            Oct 24, 2024
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#132238] flex items-center justify-center text-[#00236f] dark:text-[#6ffbbe] shadow-xs">
                <span className="material-symbols-outlined text-[18px]">calendar_view_day</span>
              </div>
              <div>
                <span className="text-[11px] text-[#757682] dark:text-[#94a3b8] block">Shift Category</span>
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white">General Standard</span>
              </div>
            </div>
            <span className="text-xs text-[#757682] dark:text-[#94a3b8] font-mono">09:00 - 18:00</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#132238] flex items-center justify-center text-[#27c38a] shadow-xs">
                <span className="material-symbols-outlined text-[18px]">login</span>
              </div>
              <div>
                <span className="text-[11px] text-[#757682] dark:text-[#94a3b8] block">Check-In Time</span>
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white font-mono">{activeShift.clockInTime}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#004a31] dark:text-[#27c38a] font-semibold block">Face ID Verified</span>
              <span className="text-[11px] text-[#757682] dark:text-[#94a3b8]">HQ Main Gate</span>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#132238] flex items-center justify-center text-[#0058be] dark:text-[#6ffbbe] shadow-xs">
                <span className="material-symbols-outlined text-[18px]">coffee</span>
              </div>
              <div>
                <span className="text-[11px] text-[#757682] dark:text-[#94a3b8] block">Break Duration</span>
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white">{activeShift.breakElapsedMinutes}m utilized</span>
              </div>
            </div>
            <span className="text-xs text-[#757682] dark:text-[#94a3b8] font-mono">1:00 PM - 1:45 PM</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#132238] flex items-center justify-center text-[#757682] dark:text-[#94a3b8] shadow-xs">
                <span className="material-symbols-outlined text-[18px]">logout</span>
              </div>
              <div>
                <span className="text-[11px] text-[#757682] dark:text-[#94a3b8] block">Expected Check-Out</span>
                <span className="text-xs font-bold text-[#0b1c30] dark:text-white">06:00 PM</span>
              </div>
            </div>
            <span className="text-[10px] bg-white dark:bg-[#18283f] text-[#757682] dark:text-[#94a3b8] px-2 py-0.5 rounded-full border border-[#dce9ff] dark:border-[#223854]">
              Automated Rule
            </span>
          </div>
        </div>
      </div>

      {/* 5. Recent Logs & Timesheet Table */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Shift Logs History</h3>
          <div className="flex items-center gap-1 bg-[#eff4ff] dark:bg-[#18283f] p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'cards'
                  ? 'bg-white dark:bg-[#132238] text-[#00236f] dark:text-white shadow-xs'
                  : 'text-[#757682] dark:text-[#94a3b8]'
              }`}
            >
              Cards
            </button>
            <button
              onClick={() => setActiveTab('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'table'
                  ? 'bg-white dark:bg-[#132238] text-[#00236f] dark:text-white shadow-xs'
                  : 'text-[#757682] dark:text-[#94a3b8]'
              }`}
            >
              Full Table
            </button>
          </div>
        </div>

        {activeTab === 'cards' ? (
          <div className="space-y-3 mt-4">
            {shiftLogs.map((log) => (
              <div
                key={log.id}
                className="bg-[#eff4ff] dark:bg-[#18283f] rounded-xl p-4 border border-[#dce9ff] dark:border-[#223854] flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-[#0058be]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#132238] flex items-center justify-center text-[#00236f] dark:text-[#6ffbbe] shadow-xs shrink-0">
                    <span className="material-symbols-outlined text-[20px]">
                      {log.status === 'Present' || log.status === 'Overtime' ? 'check' : 'schedule'}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white">{log.dayLabel}</span>
                    <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-0.5 font-mono">
                      {log.clockIn} - {log.clockOut} • {log.effectiveHrs}
                    </p>
                  </div>
                </div>
                {getStatusBadge(log.status, log.lateMinutes, log.overtimeHours)}
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs">
              <thead className="text-[#757682] dark:text-[#94a3b8] uppercase tracking-wider bg-[#eff4ff] dark:bg-[#18283f] border-y border-[#dce9ff] dark:border-[#223854]">
                <tr>
                  <th className="py-3 px-3">Date / Day</th>
                  <th className="py-3 px-3">Shift Profile</th>
                  <th className="py-3 px-3">Clock In</th>
                  <th className="py-3 px-3">Break</th>
                  <th className="py-3 px-3">Clock Out</th>
                  <th className="py-3 px-3">Effective</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eff4ff] dark:divide-[#1e2e48]">
                {shiftLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#eff4ff]/50 dark:hover:bg-[#18283f]/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#0b1c30] dark:text-white">{log.date}</td>
                    <td className="py-3 px-3 text-[#757682] dark:text-[#94a3b8]">{log.shiftProfile}</td>
                    <td className="py-3 px-3 font-mono font-medium text-[#0b1c30] dark:text-white">{log.clockIn}</td>
                    <td className="py-3 px-3 text-[#757682] dark:text-[#94a3b8]">{log.breakDuration}</td>
                    <td className="py-3 px-3 font-mono text-[#0b1c30] dark:text-white">{log.clockOut}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-[#00236f] dark:text-[#6ffbbe]">{log.effectiveHrs}</td>
                    <td className="py-3 px-3">{getStatusBadge(log.status, log.lateMinutes, log.overtimeHours)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. Regularization History */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-5 sm:p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">history</span>
            <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Recent Regularization Submissions</h3>
          </div>
          <span className="text-xs text-[#757682] dark:text-[#94a3b8]">Past 30 Days</span>
        </div>

        <div className="space-y-3 mt-4">
          {regularizations.map((reg) => (
            <div
              key={reg.id}
              className="p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs text-[#00236f] dark:text-[#6ffbbe]">{reg.id}</span>
                  <span className="text-xs text-[#757682] dark:text-[#94a3b8]">• {reg.impactDate}</span>
                  <span className="text-xs font-semibold text-[#0058be] dark:text-[#90a8ff]">
                    {reg.originalTime} → {reg.requestedTime}
                  </span>
                </div>
                <p className="text-xs text-[#444651] dark:text-[#cbd5e1] mt-1">{reg.reason}</p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold self-start sm:self-auto ${
                  reg.status === 'approved'
                    ? 'bg-[#27c38a]/15 text-[#004a31] dark:text-[#6ffbbe]'
                    : 'bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#ba1a1a] dark:text-[#ffdad6]'
                }`}
              >
                {reg.status === 'approved' ? 'Approved & Synced' : 'Pending Review'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
