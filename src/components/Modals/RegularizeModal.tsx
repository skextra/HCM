import React, { useState } from 'react';

interface RegularizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { impactDate: string; requestedTime: string; reason: string }) => void;
}

export const RegularizeModal: React.FC<RegularizeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [impactDate, setImpactDate] = useState('2024-10-22');
  const [requestedTime, setRequestedTime] = useState('09:00 AM');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        impactDate,
        requestedTime,
        reason: reason || 'Beacon turnstile hardware malfunction during morning rush.',
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-md bg-white dark:bg-[#132238] rounded-2xl shadow-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] flex items-center justify-center text-[#00236f] dark:text-[#6ffbbe]">
              <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#0b1c30] dark:text-white">Regularize Attendance</h3>
              <p className="text-xs text-[#757682] dark:text-[#94a3b8]">Submit missed biometric punch adjustment</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] hover:text-[#0b1c30] dark:hover:text-white"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Impact Shift Date</label>
            <input
              type="date"
              value={impactDate}
              onChange={(e) => setImpactDate(e.target.value)}
              required
              className="w-full h-11 px-3 bg-[#eff4ff] dark:bg-[#18283f] rounded-xl text-sm text-[#0b1c30] dark:text-white border border-[#dce9ff] dark:border-[#223854] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Requested Effective Punch</label>
            <input
              type="text"
              value={requestedTime}
              onChange={(e) => setRequestedTime(e.target.value)}
              placeholder="e.g. 09:00 AM (Check-in)"
              required
              className="w-full h-11 px-3 bg-[#eff4ff] dark:bg-[#18283f] placeholder:text-[#757682] dark:placeholder:text-[#64748b] rounded-xl text-sm text-[#0b1c30] dark:text-white border border-[#dce9ff] dark:border-[#223854] outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Reason for Discrepancy</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Explain why the physical or geo-beacon punch was missed or delayed..."
              rows={3}
              className="w-full p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-sm text-[#0b1c30] dark:text-white placeholder:text-[#757682] dark:placeholder:text-[#64748b] border border-[#dce9ff] dark:border-[#223854] outline-none resize-none"
            ></textarea>
          </div>

          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-xs text-[#444651] dark:text-[#cbd5e1] border border-[#dce9ff] dark:border-[#223854] flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-[#0058be] dark:text-[#6ffbbe]">info</span>
            <span>Regularization deadline is strictly 28th of every calendar cycle.</span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#444651] dark:text-[#cbd5e1] font-semibold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 rounded-xl bg-[#00236f] dark:bg-[#1e3a8a] hover:bg-[#1e3a8a] dark:hover:bg-[#2563eb] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Submitting...' : 'Submit Request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
