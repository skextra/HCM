import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface ApplyLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { type: string; startDate: string; endDate: string; reason: string }) => void;
}

export const ApplyLeaveModal: React.FC<ApplyLeaveModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState('2024-11-20');
  const [endDate, setEndDate] = useState('2024-11-22');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({
        type: leaveType,
        startDate,
        endDate,
        reason: reason || 'Personal time off and operational rest',
      });
      setIsSubmitting(false);
      onClose();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (err) {
        // ignore if canvas unavailable
      }
    }, 400);
  };

  const categories = [
    { id: 'annual', label: 'Annual', icon: 'flight_takeoff', balance: '8 left' },
    { id: 'casual', label: 'Casual', icon: 'beach_access', balance: '4 left' },
    { id: 'sick', label: 'Sick', icon: 'healing', balance: '6 left' },
    { id: 'comp', label: 'Comp-Off', icon: 'restore', balance: '2 left' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#0b1c30]/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#132238] rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] max-h-[90vh] overflow-y-auto transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-1.5 bg-[#c5c5d3]/60 dark:bg-[#334155] rounded-full mx-auto mb-4 sm:hidden"></div>

        <div className="flex items-center justify-between pb-4 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div>
            <h3 className="text-xl font-bold text-[#0b1c30] dark:text-white">Apply for Time Off</h3>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-0.5">Fill in details for administrative review</p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] hover:text-[#0b1c30] dark:hover:text-white"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Category */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#444651] dark:text-[#cbd5e1] mb-2 block">
              Leave Category
            </label>
            <div className="grid grid-cols-4 gap-2">
              {categories.map((cat) => {
                const isSelected = leaveType === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setLeaveType(cat.id)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'bg-[#1e3a8a] text-white border-[#1e3a8a] shadow-sm'
                        : 'bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#0b1c30] dark:text-white border-transparent'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] mb-1">{cat.icon}</span>
                    <span className="text-xs font-semibold">{cat.label}</span>
                    <span className={`text-[10px] mt-0.5 ${isSelected ? 'text-[#b6c4ff]' : 'text-[#757682] dark:text-[#94a3b8]'}`}>
                      {cat.balance}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Start Date</label>
              <div className="h-11 px-3 bg-[#eff4ff] dark:bg-[#18283f] rounded-xl flex items-center gap-2 border border-[#dce9ff] dark:border-[#223854]">
                <span className="material-symbols-outlined text-[18px] text-[#757682] dark:text-[#94a3b8]">calendar_today</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-[#0b1c30] dark:text-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">End Date</label>
              <div className="h-11 px-3 bg-[#eff4ff] dark:bg-[#18283f] rounded-xl flex items-center gap-2 border border-[#dce9ff] dark:border-[#223854]">
                <span className="material-symbols-outlined text-[18px] text-[#757682] dark:text-[#94a3b8]">calendar_today</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full bg-transparent text-sm text-[#0b1c30] dark:text-white outline-none"
                />
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Reason / Handover Note</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Brief explanation of your leave and sprint coverage arrangements..."
              rows={3}
              className="w-full p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] text-sm text-[#0b1c30] dark:text-white placeholder:text-[#757682] dark:placeholder:text-[#64748b] border border-[#dce9ff] dark:border-[#223854] outline-none focus:bg-white dark:focus:bg-[#132238] focus:ring-2 focus:ring-[#0058be]/20 dark:focus:ring-[#6ffbbe]/20 transition-all resize-none"
            ></textarea>
          </div>

          {/* Approver preview */}
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256"
                alt="Zayd Malik"
                className="w-7 h-7 rounded-full object-cover ring-1 ring-[#dce9ff] dark:ring-[#223854]"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-[#0b1c30] dark:text-white">Zayd Malik (VP, People Ops)</span>
                <span className="text-[10px] text-[#757682] dark:text-[#94a3b8]">Designated Approver</span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-[#0058be] dark:text-[#6ffbbe] bg-white dark:bg-[#132238] px-2 py-0.5 rounded-full border border-[#dce9ff] dark:border-[#223854]">
              1-Step SLA: 24h
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#444651] dark:text-[#cbd5e1] font-semibold text-sm transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-2 py-3 rounded-xl bg-[#00236f] dark:bg-[#1e3a8a] hover:bg-[#1e3a8a] dark:hover:bg-[#2563eb] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">send</span>
              <span>{isSubmitting ? 'Submitting...' : 'Submit for Approval'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
