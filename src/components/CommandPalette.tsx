import React, { useState, useEffect } from 'react';
import { TabType, Employee } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: TabType) => void;
  onOpenAction: (action: string) => void;
  employees: Employee[];
  onSelectEmployee: (emp: Employee) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectTab,
  onOpenAction,
  employees,
  onSelectEmployee,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or state
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    { id: 'apply-leave', label: 'Apply for Leave / Time Off', icon: 'event_note', category: 'Action' },
    { id: 'clock-toggle', label: 'Clock In / Clock Out Shift', icon: 'timer', category: 'Action' },
    { id: 'regularize', label: 'Submit Punch Regularization', icon: 'edit_calendar', category: 'Action' },
    { id: 'view-payslip', label: 'Download September Payslip PDF', icon: 'receipt_long', category: 'Action' },
    { id: 'claim-expense', label: 'Submit Expense Reimbursement', icon: 'price_check', category: 'Action' },
    { id: 'overtime', label: 'Log Billable Overtime Hours', icon: 'more_time', category: 'Action' },
  ];

  const navigations: { tab: TabType; label: string; icon: string }[] = [
    { tab: 'home', label: 'Go to Dashboard / Home', icon: 'grid_view' },
    { tab: 'attendance', label: 'Go to Attendance & Timesheets', icon: 'schedule' },
    { tab: 'leaves', label: 'Go to Leave Governance & Balances', icon: 'event_available' },
    { tab: 'payroll', label: 'Go to Payroll & Disbursed Salary', icon: 'payments' },
    { tab: 'directory', label: 'Go to Employee Directory & Org Chart', icon: 'group' },
  ];

  const filteredActions = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredNav = navigations.filter((n) =>
    n.label.toLowerCase().includes(query.toLowerCase())
  );
  const filteredEmployees = employees.filter((e) =>
    e.name.toLowerCase().includes(query.toLowerCase()) ||
    e.role.toLowerCase().includes(query.toLowerCase()) ||
    e.department.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-[#0b1c30]/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#132238] rounded-2xl shadow-2xl border border-[#e5eeff] dark:border-[#1e2e48] overflow-hidden flex flex-col transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-[#eff4ff] dark:border-[#1e2e48] flex items-center gap-3">
          <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[22px]">search</span>
          <input
            type="text"
            placeholder="Type a command, employee name, or jump to a module..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-[#0b1c30] dark:text-white placeholder:text-[#757682] dark:placeholder:text-[#64748b] outline-none"
          />
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-[#eff4ff] dark:bg-[#18283f] text-[#757682] dark:text-[#cbd5e1] hover:text-[#0b1c30] dark:hover:text-white flex items-center justify-center text-xs"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 flex flex-col gap-1 text-sm">
          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div className="mb-2">
              <span className="text-[11px] font-bold text-[#757682] dark:text-[#94a3b8] px-3 uppercase tracking-wider block mb-1">
                Direct Workflows
              </span>
              {filteredActions.map((act) => (
                <button
                  key={act.id}
                  onClick={() => {
                    onOpenAction(act.id);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#e5eeff] dark:bg-[#18283f] group-hover:bg-[#00236f] dark:group-hover:bg-[#1e3a8a] text-[#00236f] dark:text-[#90a8ff] group-hover:text-white flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[16px]">{act.icon}</span>
                    </div>
                    <span className="font-medium text-[#0b1c30] dark:text-white group-hover:text-[#00236f] dark:group-hover:text-[#6ffbbe]">
                      {act.label}
                    </span>
                  </div>
                  <span className="text-xs text-[#757682] dark:text-[#94a3b8]">Execute</span>
                </button>
              ))}
            </div>
          )}

          {/* Navigation */}
          {filteredNav.length > 0 && (
            <div className="mb-2">
              <span className="text-[11px] font-bold text-[#757682] dark:text-[#94a3b8] px-3 uppercase tracking-wider block mb-1">
                Navigation
              </span>
              {filteredNav.map((nav) => (
                <button
                  key={nav.tab}
                  onClick={() => {
                    onSelectTab(nav.tab);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-[#eff4ff] dark:bg-[#18283f] group-hover:bg-[#0058be] dark:group-hover:bg-[#1e3a8a] text-[#0058be] dark:text-[#6ffbbe] group-hover:text-white flex items-center justify-center transition-colors">
                      <span className="material-symbols-outlined text-[16px]">{nav.icon}</span>
                    </div>
                    <span className="font-medium text-[#0b1c30] dark:text-white">{nav.label}</span>
                  </div>
                  <span className="text-xs text-[#757682] dark:text-[#94a3b8]">Jump</span>
                </button>
              ))}
            </div>
          )}

          {/* Colleagues */}
          {filteredEmployees.length > 0 && (
            <div>
              <span className="text-[11px] font-bold text-[#757682] dark:text-[#94a3b8] px-3 uppercase tracking-wider block mb-1">
                Colleagues & Roster
              </span>
              {filteredEmployees.slice(0, 4).map((emp) => (
                <button
                  key={emp.id}
                  onClick={() => {
                    onSelectEmployee(emp);
                    onClose();
                  }}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={emp.avatar} alt={emp.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-[#e5eeff] dark:ring-[#223854]" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-[#0b1c30] dark:text-white">{emp.name}</span>
                      <span className="text-[11px] text-[#757682] dark:text-[#94a3b8]">{emp.role} • {emp.department}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#0058be] dark:text-[#6ffbbe] text-[10px] font-semibold border border-[#dce9ff] dark:border-[#223854]">
                    {emp.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {filteredActions.length === 0 && filteredNav.length === 0 && filteredEmployees.length === 0 && (
            <div className="py-8 text-center text-[#757682] dark:text-[#94a3b8] text-sm">
              No matching actions or colleagues found.
            </div>
          )}
        </div>

        {/* Footer hints */}
        <div className="px-4 py-2 bg-[#eff4ff]/60 dark:bg-[#18283f]/60 border-t border-[#e5eeff] dark:border-[#1e2e48] flex items-center justify-between text-[11px] text-[#757682] dark:text-[#94a3b8]">
          <span>Tip: Use ↑ ↓ to navigate, ↵ to select</span>
          <span>PulseHR Command Hub</span>
        </div>
      </div>
    </div>
  );
};
