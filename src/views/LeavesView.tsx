import React, { useState } from 'react';
import { LeaveQuota, LeaveRequest } from '../types';

interface LeavesViewProps {
  quotas: LeaveQuota[];
  requests: LeaveRequest[];
  onOpenLeaveModal: () => void;
  onWithdrawRequest: (id: string) => void;
}

export const LeavesView: React.FC<LeavesViewProps> = ({
  quotas,
  requests,
  onOpenLeaveModal,
  onWithdrawRequest,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  const filteredRequests = requests.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  const handleDownloadAttachment = (filename: string) => {
    setDownloadNotice(`Downloading ${filename}...`);
    setTimeout(() => {
      const blob = new Blob([`PulseHR Medical Verification Certificate\nDocument: ${filename}\nStatus: Verified Clinical Sign-off`], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      setDownloadNotice(null);
    }, 600);
  };

  const getStatusBadge = (status: LeaveRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] text-xs font-bold border border-[#dce9ff] dark:border-[#223854]">
            <span className="w-2 h-2 rounded-full bg-[#0058be] dark:bg-[#6ffbbe] animate-pulse"></span>
            <span>Pending Review</span>
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#27c38a]/15 text-[#004a31] dark:text-[#6ffbbe] text-xs font-bold border border-[#27c38a]/30">
            <span className="material-symbols-outlined text-[15px]">check_circle</span>
            <span>Approved</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#ba1a1a] dark:text-[#ffdad6] text-xs font-bold border border-[#ba1a1a]/30">
            <span className="material-symbols-outlined text-[15px]">cancel</span>
            <span>Rejected</span>
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* 1. Header & Request CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#132238] p-5 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0058be] dark:bg-[#6ffbbe] animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0058be] dark:text-[#6ffbbe]">
              Leave Portal
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0b1c30] dark:text-white mt-0.5">
            Leave Overview & Quotas
          </h2>
        </div>

        <button
          onClick={onOpenLeaveModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00236f] dark:bg-[#0058be] hover:bg-[#1e3a8a] text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>Request Leave</span>
        </button>
      </div>

      {downloadNotice && (
        <div className="p-3 bg-[#eff4ff] dark:bg-[#18283f] text-[#00236f] dark:text-[#6ffbbe] border border-[#dce9ff] dark:border-[#223854] rounded-xl text-xs font-semibold flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] animate-spin">refresh</span>
          <span>{downloadNotice}</span>
        </div>
      )}

      {/* 2. Balance Metric Cards (4 Cards) */}
      <div>
        <div className="flex items-center justify-between px-1 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#757682] dark:text-[#94a3b8]">
            Balances (FY 2024-25)
          </span>
          <span className="text-xs font-semibold text-[#0058be] dark:text-[#6ffbbe] hover:underline cursor-pointer">
            Policy Details
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quotas.map((q) => (
            <div
              key={q.type}
              className="bg-white dark:bg-[#132238] p-5 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col justify-between h-44 hover:border-[#0058be]/40 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-[#00236f] dark:text-[#6ffbbe] flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[20px]">
                    {q.type === 'annual'
                      ? 'flight_takeoff'
                      : q.type === 'casual'
                      ? 'beach_access'
                      : q.type === 'sick'
                      ? 'healing'
                      : 'restore'}
                  </span>
                </div>
                {/* Ring Indicator */}
                <div className="relative w-9 h-9 flex items-center justify-center">
                  <svg className="w-9 h-9 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-[#e5eeff] dark:text-[#223854]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3.2"
                    ></path>
                    <path
                      className="text-[#0058be] dark:text-[#6ffbbe]"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={`${q.percentage}, 100`}
                      strokeLinecap="round"
                      strokeWidth="3.5"
                    ></path>
                  </svg>
                  <span className="absolute text-[10px] font-bold text-[#00236f] dark:text-white font-mono">
                    {q.percentage}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-[#444651] dark:text-[#cbd5e1]">{q.title}</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-2xl font-extrabold text-[#00236f] dark:text-white font-mono">{q.available}</span>
                  <span className="text-xs text-[#757682] dark:text-[#94a3b8]">/ {q.total} left</span>
                </div>
              </div>

              <div>
                <div className="w-full bg-[#eff4ff] dark:bg-[#18283f] rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#0058be] dark:bg-[#6ffbbe]"
                    style={{ width: `${q.percentage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-[#757682] dark:text-[#94a3b8] mt-1.5 truncate">{q.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Filter Pills Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#eff4ff] dark:bg-[#18283f] rounded-xl w-fit border border-[#dce9ff] dark:border-[#223854]">
        <button
          onClick={() => setFilter('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'all'
              ? 'bg-white dark:bg-[#132238] text-[#00236f] dark:text-white shadow-xs'
              : 'text-[#757682] dark:text-[#94a3b8]'
          }`}
        >
          All ({requests.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'pending'
              ? 'bg-white dark:bg-[#132238] text-[#00236f] dark:text-white shadow-xs'
              : 'text-[#757682] dark:text-[#94a3b8]'
          }`}
        >
          Pending ({requests.filter((r) => r.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'approved'
              ? 'bg-white dark:bg-[#132238] text-[#00236f] dark:text-white shadow-xs'
              : 'text-[#757682] dark:text-[#94a3b8]'
          }`}
        >
          Approved ({requests.filter((r) => r.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilter('rejected')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
            filter === 'rejected'
              ? 'bg-white dark:bg-[#132238] text-[#00236f] dark:text-white shadow-xs'
              : 'text-[#757682] dark:text-[#94a3b8]'
          }`}
        >
          Rejected ({requests.filter((r) => r.status === 'rejected').length})
        </button>
      </div>

      {/* 4. Requests Feed List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredRequests.map((req) => (
          <article
            key={req.id}
            className="bg-white dark:bg-[#132238] p-5 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col gap-3.5 hover:border-[#0058be]/30 transition-all"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-[#00236f] dark:text-[#6ffbbe] flex items-center justify-center shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-[22px]">
                    {req.type === 'annual'
                      ? 'calendar_month'
                      : req.type === 'sick'
                      ? 'healing'
                      : req.type === 'casual'
                      ? 'person_pin_circle'
                      : 'restore'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">{req.title}</h3>
                    <span className="text-xs font-mono text-[#757682] dark:text-[#94a3b8]">• {req.reqNumber}</span>
                  </div>
                  <p className="text-xs font-bold text-[#0058be] dark:text-[#90a8ff]">{req.days} {req.days === 1 ? 'Day' : 'Days'}</p>
                </div>
              </div>
              {getStatusBadge(req.status)}
            </div>

            {/* Date strip & reason */}
            <div className="bg-[#eff4ff] dark:bg-[#18283f] p-3.5 rounded-xl border border-[#dce9ff] dark:border-[#223854] flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#0b1c30] dark:text-white">
                <span className="material-symbols-outlined text-[16px] text-[#0058be] dark:text-[#6ffbbe]">date_range</span>
                <span>{req.dateRangeDisplay}</span>
              </div>
              <p className="text-xs text-[#444651] dark:text-[#cbd5e1] italic">"{req.reason}"</p>

              {/* Attachment chip if present */}
              {req.attachmentName && (
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-[#132238] border border-[#dce9ff] dark:border-[#223854] mt-1">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">
                      picture_as_pdf
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-[#0b1c30] dark:text-white truncate">
                        {req.attachmentName}
                      </span>
                      <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">{req.attachmentSize}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadAttachment(req.attachmentName!)}
                    className="w-8 h-8 rounded-lg bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#00236f] dark:hover:bg-[#0058be] hover:text-white text-[#00236f] dark:text-[#cbd5e1] flex items-center justify-center transition-colors"
                    title="Download Attachment"
                  >
                    <span className="material-symbols-outlined text-[18px]">download</span>
                  </button>
                </div>
              )}

              {/* Rejection notice if rejected */}
              {req.rejectionReason && (
                <div className="p-2.5 rounded-lg bg-[#ffdad6]/60 dark:bg-[#ffdad6]/15 border border-[#ba1a1a]/30 text-xs text-[#93000a] dark:text-[#ffdad6]">
                  <span className="font-bold">Reason for Rejection: </span>
                  <span>{req.rejectionReason}</span>
                </div>
              )}
            </div>

            {/* Approver & Action footer */}
            <div className="flex items-center justify-between pt-1 border-t border-[#eff4ff] dark:border-[#1e2e48]">
              <div className="flex items-center gap-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
                  alt="Approver"
                  className="w-7 h-7 rounded-full object-cover ring-1 ring-[#dce9ff] dark:ring-[#223854]"
                />
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">Approver:</span>
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white">
                    {req.approverName} ({req.approverRole})
                  </span>
                </div>
              </div>

              {req.status === 'pending' ? (
                <button
                  onClick={() => {
                    if (confirm(`Withdraw request for ${req.title}?`)) {
                      onWithdrawRequest(req.id);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#ba1a1a] dark:text-[#ffdad6] hover:bg-[#ba1a1a] hover:text-white text-xs font-semibold transition-all"
                >
                  Withdraw Request
                </button>
              ) : req.status === 'rejected' ? (
                <button
                  onClick={onOpenLeaveModal}
                  className="px-3 py-1.5 rounded-lg bg-[#eff4ff] dark:bg-[#18283f] text-[#00236f] dark:text-[#90a8ff] hover:bg-[#00236f] hover:text-white text-xs font-semibold transition-all"
                >
                  Re-Submit Request
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-[#004a31] dark:text-[#27c38a] font-medium">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>Approved • {req.decidedAt || 'Signed off'}</span>
                </div>
              )}
            </div>
          </article>
        ))}

        {filteredRequests.length === 0 && (
          <div className="bg-white dark:bg-[#132238] p-12 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] text-center text-sm text-[#757682] dark:text-[#94a3b8]">
            No leave applications match the selected filter.
          </div>
        )}
      </div>

      {/* 5. Team Coverage Radar & Upcoming Holidays */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        {/* Coverage Radar */}
        <div className="bg-white dark:bg-[#132238] p-5 sm:p-6 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">radar</span>
                <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Team Coverage Radar</h3>
              </div>
              <span className="text-xs font-semibold text-[#0058be] dark:text-[#90a8ff]">Product & Design</span>
            </div>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-2 mb-4">
              Current absence density for Sprint 46. Ensure minimum 60% engineering parity.
            </p>

            {/* Matrix */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f]">
                <span className="font-semibold text-[#0b1c30] dark:text-white">Elena Rostova</span>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#132238] text-[#27c38a] font-bold text-[10px]">IN</span>
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#ba1a1a] font-bold text-[10px]">LV</span>
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#ba1a1a] font-bold text-[10px]">LV</span>
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#ba1a1a] font-bold text-[10px]">LV</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#132238] text-[#27c38a] font-bold text-[10px]">IN</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f]">
                <span className="font-semibold text-[#0b1c30] dark:text-white">Liam Kelly</span>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#132238] text-[#27c38a] font-bold text-[10px]">IN</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#132238] text-[#27c38a] font-bold text-[10px]">IN</span>
                  <span className="px-2 py-0.5 rounded bg-[#dce9ff] dark:bg-[#1e3a8a]/60 text-[#0058be] dark:text-[#90a8ff] font-bold text-[10px]">REM</span>
                  <span className="px-2 py-0.5 rounded bg-[#dce9ff] dark:bg-[#1e3a8a]/60 text-[#0058be] dark:text-[#90a8ff] font-bold text-[10px]">REM</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#132238] text-[#27c38a] font-bold text-[10px]">IN</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f]">
                <span className="font-semibold text-[#0b1c30] dark:text-white">Sarah Chen</span>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#ba1a1a] font-bold text-[10px]">OOO</span>
                  <span className="px-2 py-0.5 rounded bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#ba1a1a] font-bold text-[10px]">OOO</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#132238] text-[#27c38a] font-bold text-[10px]">IN</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#132238] text-[#27c38a] font-bold text-[10px]">IN</span>
                  <span className="px-2 py-0.5 rounded bg-white dark:bg-[#132238] text-[#27c38a] font-bold text-[10px]">IN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Holidays */}
        <div className="bg-white dark:bg-[#132238] p-5 sm:p-6 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">celebration</span>
                <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Upcoming Paid Holidays</h3>
              </div>
              <span className="text-xs text-[#757682] dark:text-[#94a3b8]">Q4 2024 / Q1 2025</span>
            </div>

            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#132238] flex flex-col items-center justify-center font-bold text-xs text-[#00236f] dark:text-[#6ffbbe] shadow-xs">
                    <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">DEC</span>
                    <span>25</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">Christmas Day</span>
                    <span className="text-[11px] text-[#757682] dark:text-[#94a3b8]">Corporate Office Shutdown</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#132238] text-[#0058be] dark:text-[#90a8ff] border border-[#dce9ff] dark:border-[#223854]">
                  Global
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#132238] flex flex-col items-center justify-center font-bold text-xs text-[#00236f] dark:text-[#6ffbbe] shadow-xs">
                    <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">JAN</span>
                    <span>01</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#0b1c30] dark:text-white block">New Year's Day</span>
                    <span className="text-[11px] text-[#757682] dark:text-[#94a3b8]">Statutory Public Holiday</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white dark:bg-[#132238] text-[#0058be] dark:text-[#90a8ff] border border-[#dce9ff] dark:border-[#223854]">
                  Paid
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#eff4ff] dark:border-[#1e2e48] mt-4 flex justify-between items-center text-xs text-[#757682] dark:text-[#94a3b8]">
            <span>Next bridge window: Dec 26 - Jan 2</span>
            <span className="text-[#0058be] dark:text-[#6ffbbe] font-bold cursor-pointer hover:underline">Full Calendar →</span>
          </div>
        </div>
      </div>
    </div>
  );
};
