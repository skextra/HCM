import React, { useState } from 'react';
import { PayslipRecord } from '../types';

interface PayrollViewProps {
  payslip: PayslipRecord;
  archive: PayslipRecord[];
  onOpenPayslipModal: (record?: PayslipRecord) => void;
}

export const PayrollView: React.FC<PayrollViewProps> = ({
  payslip,
  archive,
  onOpenPayslipModal,
}) => {
  const [showSalary, setShowSalary] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
      onOpenPayslipModal(payslip);
    }, 800);
  };

  const allRecords = [payslip, ...archive];

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* 1. Period Selector & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#132238] p-5 rounded-2xl border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] flex items-center justify-center text-[#00236f] dark:text-[#6ffbbe] shadow-xs shrink-0">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-[#0b1c30] dark:text-white">{payslip.month}</span>
              <span className="material-symbols-outlined text-[18px] text-[#757682] dark:text-[#94a3b8]">expand_more</span>
            </div>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8]">Disbursed on {payslip.disbursedDate} • Direct Deposit</p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#00236f] dark:text-[#cbd5e1] text-xs font-bold py-2.5 px-4 rounded-xl border border-[#dce9ff] dark:border-[#223854] transition-all active:scale-95 shadow-xs"
          type="button"
        >
          <span className={`material-symbols-outlined text-[18px] ${isDownloading ? 'animate-spin' : ''}`}>
            {isDownloading ? 'refresh' : downloadSuccess ? 'done' : 'download'}
          </span>
          <span>{isDownloading ? 'Generating...' : downloadSuccess ? 'Statement Ready!' : 'Download PDF'}</span>
        </button>
      </div>

      {/* 2. Hero Net Salary Disbursed Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00236f] via-[#00236f] to-[#1e3a8a] text-white p-6 sm:p-8 shadow-md border border-[#1e3a8a]">
        {/* Atmospheric Glow */}
        <div className="absolute -right-8 -top-8 w-56 h-56 rounded-full bg-[#0058be]/25 blur-3xl pointer-events-none"></div>
        <div className="absolute right-12 bottom-0 w-40 h-40 rounded-full bg-[#27c38a]/15 blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00311f]/60 backdrop-blur-md text-[#6ffbbe] text-xs font-bold border border-[#6ffbbe]/20">
              <span className="w-2 h-2 rounded-full bg-[#6ffbbe] animate-pulse"></span>
              <span>Disbursed & Reconciled • {payslip.disbursedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[#b6c4ff] text-xs font-semibold">
              <span className="material-symbols-outlined text-[16px] text-[#6ffbbe]">verified_user</span>
              <span>Audited</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#b6c4ff]">
              Net Disbursed Take-Home Salary
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-5xl font-black tracking-tight text-white font-mono">
                {showSalary ? `$${payslip.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••••'}
              </span>
              <span className="text-sm font-bold text-[#b6c4ff]">USD</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-white/10">
            <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10 self-start sm:self-auto">
              <span className="material-symbols-outlined text-[18px] text-[#6ffbbe]">account_balance</span>
              <div className="flex flex-col">
                <span className="text-[11px] text-white font-semibold">{payslip.bankName}</span>
                <span className="text-[10px] text-[#b6c4ff] font-mono tracking-widest leading-none">
                  {payslip.bankAccountMasked}
                </span>
              </div>
            </div>

            <button
              onClick={() => setShowSalary(!showSalary)}
              aria-label="Toggle Amount Visibility"
              className="inline-flex items-center gap-1 text-xs text-[#b6c4ff] hover:text-white transition-colors self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[18px]">
                {showSalary ? 'visibility' : 'visibility_off'}
              </span>
              <span>{showSalary ? 'Hide Numbers' : 'Reveal Numbers'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Earnings vs Deductions Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Earnings */}
        <div className="bg-white dark:bg-[#132238] rounded-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0058be] dark:bg-[#6ffbbe]"></div>
                <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Earnings</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#90a8ff] text-xs font-semibold border border-[#dce9ff] dark:border-[#223854]">
                4 Components
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <span className="text-[#444651] dark:text-[#cbd5e1]">Basic Salary</span>
                <span className="font-bold text-[#0b1c30] dark:text-white font-mono">
                  ${payslip.earnings.basic.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#444651] dark:text-[#cbd5e1]">Housing Allowance</span>
                <span className="font-bold text-[#0b1c30] dark:text-white font-mono">
                  ${payslip.earnings.housing.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#444651] dark:text-[#cbd5e1]">Transport & Utilities</span>
                <span className="font-bold text-[#0b1c30] dark:text-white font-mono">
                  ${payslip.earnings.transport.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#444651] dark:text-[#cbd5e1]">Performance Bonus</span>
                  <span className="bg-[#6ffbbe] text-[#002113] text-[10px] font-bold px-1.5 py-0.2 rounded">
                    Q3
                  </span>
                </div>
                <span className="font-bold text-[#27c38a] font-mono">
                  +${payslip.earnings.bonus.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-[#eff4ff] dark:border-[#1e2e48] flex items-center justify-between">
            <span className="text-sm font-bold text-[#0b1c30] dark:text-white">Gross Pay</span>
            <span className="text-lg font-extrabold text-[#00236f] dark:text-[#6ffbbe] font-mono">
              ${payslip.grossPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Deductions */}
        <div className="bg-white dark:bg-[#132238] rounded-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]"></div>
                <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Deductions</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#ffdad6] dark:bg-[#ffdad6]/20 text-[#ba1a1a] dark:text-[#ffdad6] text-xs font-semibold">
                Statutory
              </span>
            </div>

            <div className="space-y-3 mt-4 text-xs sm:text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#444651] dark:text-[#cbd5e1]">Income Tax (WHT)</span>
                  <span className="material-symbols-outlined text-[14px] text-[#757682] dark:text-[#94a3b8]" title="Withholding Tax">
                    info
                  </span>
                </div>
                <span className="font-bold text-[#ba1a1a] dark:text-[#ffdad6] font-mono">
                  -${payslip.deductions.taxWht.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#444651] dark:text-[#cbd5e1]">Provident Fund (PF)</span>
                <span className="font-bold text-[#ba1a1a] dark:text-[#ffdad6] font-mono">
                  -${payslip.deductions.providentFund.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#444651] dark:text-[#cbd5e1]">Health & Life Insurance</span>
                <span className="font-bold text-[#ba1a1a] dark:text-[#ffdad6] font-mono">
                  -${payslip.deductions.insurance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-[#eff4ff] dark:border-[#1e2e48] flex items-center justify-between">
            <span className="text-sm font-bold text-[#0b1c30] dark:text-white">Total Deductions</span>
            <span className="text-lg font-extrabold text-[#ba1a1a] dark:text-[#ffdad6] font-mono">
              -$
              {(
                payslip.deductions.taxWht +
                payslip.deductions.providentFund +
                payslip.deductions.insurance
              ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Year-To-Date (YTD) Summary Widget */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">analytics</span>
            <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">YTD Financial Position</h3>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6ffbbe]/40 text-[#00311f] dark:text-[#6ffbbe] text-xs font-semibold self-start sm:self-auto">
            <span className="material-symbols-outlined text-[14px]">check_circle</span>
            <span>Tax Declaration Verified</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <span className="text-xs uppercase tracking-wider font-bold text-[#757682] dark:text-[#94a3b8] block mb-1">
              YTD Gross Earnings
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0b1c30] dark:text-white font-mono">
              $81,450.00
            </span>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-1">Jan - Sep 2024 Cumulative</p>
          </div>

          <div className="p-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854]">
            <span className="text-xs uppercase tracking-wider font-bold text-[#757682] dark:text-[#94a3b8] block mb-1">
              YTD Tax Contributed
            </span>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#0058be] dark:text-[#6ffbbe] font-mono">
              $3,780.00
            </span>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-1">4.64% Effective Withholding Rate</p>
          </div>
        </div>
      </div>

      {/* 5. Past Payslips Quick History List */}
      <div className="bg-white dark:bg-[#132238] rounded-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <h3 className="text-base font-bold text-[#0b1c30] dark:text-white">Past Payslips</h3>
          <span className="text-xs font-semibold text-[#0058be] dark:text-[#6ffbbe] cursor-pointer hover:underline">
            View Full Archive
          </span>
        </div>

        <div className="space-y-2.5">
          {allRecords.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] border border-[#dce9ff] dark:border-[#223854] transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#132238] flex items-center justify-center text-[#0058be] dark:text-[#6ffbbe] shadow-xs shrink-0 group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-[20px]">description</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-[#0b1c30] dark:text-white truncate">{item.month}</span>
                    <span className="px-2 py-0.2 rounded-full bg-white dark:bg-[#132238] text-[#27c38a] text-[10px] font-bold border border-[#dce9ff] dark:border-[#223854]">
                      Paid
                    </span>
                  </div>
                  <p className="text-xs text-[#757682] dark:text-[#94a3b8]">Disbursed {item.disbursedDate} • Direct Deposit</p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-bold text-[#0b1c30] dark:text-white font-mono">
                  ${item.netPay.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                <button
                  onClick={() => onOpenPayslipModal(item)}
                  aria-label="Download Slip"
                  className="w-9 h-9 rounded-lg bg-white dark:bg-[#132238] hover:bg-[#00236f] dark:hover:bg-[#0058be] hover:text-white text-[#00236f] dark:text-[#cbd5e1] flex items-center justify-center shadow-xs transition-all"
                  type="button"
                >
                  <span className="material-symbols-outlined text-[18px]">download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Security Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-[#757682] dark:text-[#94a3b8] py-2">
        <span className="material-symbols-outlined text-[16px]">lock</span>
        <span>AES-256 Encrypted Payroll Document • PulseHR Compliance Standard</span>
      </div>
    </div>
  );
};
