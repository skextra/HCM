import React, { useState } from 'react';

interface ClaimExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, amount: number) => void;
}

export const ClaimExpenseModal: React.FC<ClaimExpenseModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('Design System Guild Offsite Catering');
  const [amount, setAmount] = useState('145.50');
  const [category, setCategory] = useState('Team Meals');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(title, parseFloat(amount) || 50.0);
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-[#132238] rounded-2xl shadow-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] transition-colors">
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004a31] dark:text-[#6ffbbe] text-[20px]">price_check</span>
            <h3 className="text-lg font-bold text-[#0b1c30] dark:text-white">Claim Expense</h3>
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
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Expense Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] text-sm text-[#0b1c30] dark:text-white outline-none"
            >
              <option value="Team Meals">Team Meals & Catering</option>
              <option value="Travel & Lodging">Travel & Lodging</option>
              <option value="Hardware & Peripherals">Hardware & Peripherals</option>
              <option value="Software / SaaS Tooling">Software / SaaS Tooling</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Description</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] text-sm text-[#0b1c30] dark:text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-[#0b1c30] dark:text-white mb-1 block">Claim Amount ($ USD)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              className="w-full h-11 px-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] text-sm text-[#0b1c30] dark:text-white outline-none"
            />
          </div>

          <div className="p-3 rounded-xl border border-dashed border-[#c5c5d3] dark:border-[#334155] bg-[#eff4ff]/60 dark:bg-[#18283f]/60 text-center text-xs text-[#757682] dark:text-[#94a3b8] cursor-pointer hover:bg-[#eff4ff] dark:hover:bg-[#18283f]">
            <span className="material-symbols-outlined text-[20px] text-[#0058be] dark:text-[#6ffbbe] block mb-0.5">attach_file</span>
            <span>Receipt uploaded: receipt_oct24_catering.pdf (1.2 MB)</span>
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
              {isSubmitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
