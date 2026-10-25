import React from 'react';
import { PayslipRecord } from '../../types';

interface PayslipModalProps {
  isOpen: boolean;
  onClose: () => void;
  payslip: PayslipRecord | null;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ isOpen, onClose, payslip }) => {
  if (!isOpen || !payslip) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#132238] rounded-2xl shadow-2xl p-6 sm:p-8 border border-[#e5eeff] dark:border-[#1e2e48] max-h-[90vh] overflow-y-auto print:p-0 print:border-none print:shadow-none transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Actions (hidden on print) */}
        <div className="flex items-center justify-between pb-4 border-b border-[#eff4ff] dark:border-[#1e2e48] print:hidden">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[20px]">description</span>
            <span className="text-sm font-bold text-[#0b1c30] dark:text-white">Official Payslip Statement</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-[#0058be] dark:bg-[#1e3a8a] text-white hover:bg-[#004395] dark:hover:bg-[#2563eb] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] hover:text-[#0b1c30] dark:hover:text-white"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Payslip Document */}
        <div className="mt-4 flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e5eeff] dark:border-[#1e2e48]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#00236f] dark:bg-[#1e3a8a] flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-outlined text-[24px]">vital_signs</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-[#00236f] dark:text-white">
                  Pulse<span className="text-[#0058be] dark:text-[#6ffbbe]">HR</span> Enterprise
                </span>
                <span className="text-xs text-[#757682] dark:text-[#94a3b8]">HCM Workforce Solutions & Payroll Services</span>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs uppercase tracking-wider text-[#757682] dark:text-[#94a3b8] block">Salary Voucher</span>
              <span className="text-lg font-bold text-[#0b1c30] dark:text-white">{payslip.month}</span>
              <span className="text-xs text-[#27c38a] font-semibold block">Disbursed on {payslip.disbursedDate}</span>
            </div>
          </div>

          {/* Employee & Bank Info Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] text-xs">
            <div>
              <span className="text-[#757682] dark:text-[#94a3b8] block">Employee Name</span>
              <span className="font-bold text-[#0b1c30] dark:text-white text-sm mt-0.5 block">Tariq Al-Mansoor</span>
            </div>
            <div>
              <span className="text-[#757682] dark:text-[#94a3b8] block">Employee ID</span>
              <span className="font-bold text-[#0b1c30] dark:text-white text-sm mt-0.5 block">EMP-04182</span>
            </div>
            <div>
              <span className="text-[#757682] dark:text-[#94a3b8] block">Designation</span>
              <span className="font-bold text-[#0b1c30] dark:text-white mt-0.5 block">Senior Lead Product Designer</span>
            </div>
            <div>
              <span className="text-[#757682] dark:text-[#94a3b8] block">Disbursement Mode</span>
              <span className="font-bold text-[#0058be] dark:text-[#6ffbbe] mt-0.5 block">{payslip.bankName} ({payslip.bankAccountMasked})</span>
            </div>
          </div>

          {/* Earnings & Deductions Breakdown Tables */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#18283f] border border-[#e5eeff] dark:border-[#223854] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eff4ff] dark:border-[#223854]">
                  <span className="text-xs font-bold text-[#0058be] dark:text-[#6ffbbe] uppercase tracking-wider">Earnings</span>
                  <span className="text-xs font-semibold text-[#757682] dark:text-[#94a3b8]">Amount (USD)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#444651] dark:text-[#cbd5e1]">Basic Salary</span>
                    <span className="font-mono font-medium text-[#0b1c30] dark:text-white">${payslip.earnings.basic.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#444651] dark:text-[#cbd5e1]">Housing Allowance</span>
                    <span className="font-mono font-medium text-[#0b1c30] dark:text-white">${payslip.earnings.housing.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#444651] dark:text-[#cbd5e1]">Transport & Utilities</span>
                    <span className="font-mono font-medium text-[#0b1c30] dark:text-white">${payslip.earnings.transport.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#444651] dark:text-[#cbd5e1]">{payslip.earnings.bonusLabel}</span>
                    <span className="font-mono font-medium text-[#27c38a]">
                      +${payslip.earnings.bonus.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-3 mt-4 border-t border-[#eff4ff] dark:border-[#223854] flex justify-between items-center text-sm font-bold text-[#0b1c30] dark:text-white">
                <span>Gross Earnings</span>
                <span className="font-mono text-[#00236f] dark:text-[#6ffbbe]">${payslip.grossPay.toFixed(2)}</span>
              </div>
            </div>

            {/* Deductions */}
            <div className="p-4 rounded-xl bg-white dark:bg-[#18283f] border border-[#e5eeff] dark:border-[#223854] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#eff4ff] dark:border-[#223854]">
                  <span className="text-xs font-bold text-[#ba1a1a] dark:text-[#ffb4ab] uppercase tracking-wider">Deductions</span>
                  <span className="text-xs font-semibold text-[#757682] dark:text-[#94a3b8]">Amount (USD)</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#444651] dark:text-[#cbd5e1]">Income Tax (WHT)</span>
                    <span className="font-mono font-medium text-[#ba1a1a] dark:text-[#ffb4ab]">-${payslip.deductions.taxWht.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#444651] dark:text-[#cbd5e1]">Provident Fund (PF)</span>
                    <span className="font-mono font-medium text-[#ba1a1a] dark:text-[#ffb4ab]">-${payslip.deductions.providentFund.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#444651] dark:text-[#cbd5e1]">Health & Life Insurance</span>
                    <span className="font-mono font-medium text-[#ba1a1a] dark:text-[#ffb4ab]">-${payslip.deductions.insurance.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <div className="pt-3 mt-4 border-t border-[#eff4ff] dark:border-[#223854] flex justify-between items-center text-sm font-bold text-[#0b1c30] dark:text-white">
                <span>Total Deductions</span>
                <span className="font-mono text-[#ba1a1a] dark:text-[#ffb4ab]">
                  -${(payslip.deductions.taxWht + payslip.deductions.providentFund + payslip.deductions.insurance).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Net Salary Highlight */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#00236f] to-[#1e3a8a] text-white flex items-center justify-between shadow-md">
            <div className="flex flex-col">
              <span className="text-xs uppercase tracking-widest text-[#b6c4ff]">Net Disbursed Take-Home</span>
              <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight mt-0.5">
                ${payslip.netPay.toFixed(2)} <span className="text-sm font-sans font-normal text-[#b6c4ff]">USD</span>
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-xs text-[#6ffbbe] border border-white/20">
              <span className="material-symbols-outlined text-[16px]">verified</span>
              <span>Reconciled & Audited</span>
            </div>
          </div>

          {/* Compliance & Digital Signature */}
          <div className="p-3 rounded-xl bg-[#eff4ff]/60 dark:bg-[#18283f]/60 border border-[#dce9ff] dark:border-[#223854] flex items-center justify-between text-[11px] text-[#757682] dark:text-[#94a3b8]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              <span>AES-256 GCM Cryptographically Sealed Document</span>
            </div>
            <span className="font-mono">DOC-ID: PHR-2024-09-04182-A</span>
          </div>
        </div>
      </div>
    </div>
  );
};
