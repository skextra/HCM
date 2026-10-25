import React, { useState } from 'react';

interface OvertimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hours: number, task: string) => void;
}

export const OvertimeModal: React.FC<OvertimeModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [hours, setHours] = useState('2.5');
  const [date, setDate] = useState('2024-10-24');
  const [task, setTask] = useState('Q4 Design System Migration & Token Auditing');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(parseFloat(hours) || 2.0, task);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#132238] rounded-2xl shadow-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00236f] dark:text-[#6ffbbe] text-[20px]">more_time</span>
            <h3 className="text-lg font-bold text-[#0b1c30] dark:text-white">Submit Overtime</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] hover:text-[#0b1c30] dark:hover:text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 mt-4">
          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Date of Overtime</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] text-sm text-[#0b1c30] dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Logged Hours (1.5x Multiplier)</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="8"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] text-sm text-[#0b1c30] dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Project / Ticket Detail</label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="e.g. Sprint freeze urgent hotfix"
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] placeholder:text-[#757682] dark:placeholder:text-[#64748b] border border-[#dce9ff] dark:border-[#223854] text-sm text-[#0b1c30] dark:text-white outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] text-xs text-[#0058be] dark:text-[#6ffbbe] flex items-center gap-2 font-medium">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span>Overtime is billable and credited directly to next payroll voucher.</span>
          </div>

          <div className="flex gap-2 pt-2">
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
              className="flex-1 py-2.5 rounded-xl bg-[#00236f] dark:bg-[#1e3a8a] hover:bg-[#1e3a8a] dark:hover:bg-[#2563eb] text-white font-semibold text-sm shadow-md transition-all"
            >
              {isSubmitting ? 'Logging...' : 'Submit Overtime'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
