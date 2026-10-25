import React, { useState } from 'react';
import { Employee } from '../../types';

interface EmployeeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<string[]>([]);

  if (!isOpen || !employee) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, chatMessage]);
    setChatMessage('');
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Office')) return 'bg-[#27c38a]/15 text-[#004a31] border-[#27c38a]/30';
    if (status.includes('Remote')) return 'bg-[#dce9ff] text-[#0058be] border-[#0058be]/30';
    return 'bg-[#ffdad6] text-[#ba1a1a] border-[#ba1a1a]/30';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/50 dark:bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="w-full max-w-lg bg-white dark:bg-[#132238] rounded-2xl shadow-2xl p-6 border border-[#e5eeff] dark:border-[#1e2e48] max-h-[90vh] overflow-y-auto transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <span className="text-xs uppercase tracking-wider font-bold text-[#757682] dark:text-[#94a3b8]">Employee Record</span>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#eff4ff] dark:bg-[#18283f] text-[#444651] dark:text-[#cbd5e1] hover:text-[#0b1c30] dark:hover:text-white"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="flex items-start gap-4 mt-4">
          <div className="relative shrink-0">
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-[#dce9ff] dark:ring-[#223854]"
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#27c38a] ring-2 ring-white dark:ring-[#132238]"></span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-[#0b1c30] dark:text-white truncate">{employee.name}</h3>
              <span className="material-symbols-outlined text-[#0058be] dark:text-[#6ffbbe] text-[18px]">verified</span>
            </div>
            <p className="text-xs text-[#444651] dark:text-[#cbd5e1] font-medium">{employee.role}</p>
            <p className="text-xs text-[#757682] dark:text-[#94a3b8] mt-0.5">{employee.department} • {employee.empId}</p>
            <div className="mt-2">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusColor(employee.status)}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                <span>{employee.locationDetail}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Quick Contact Buttons */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-[#eff4ff] dark:border-[#1e2e48]">
          <a
            href={`mailto:${employee.email}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#00236f] dark:text-[#90a8ff] text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">mail</span>
            <span>Email</span>
          </a>
          <a
            href={`tel:${employee.phone}`}
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-[#0058be] dark:text-[#6ffbbe] text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            <span>Call</span>
          </a>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#00236f] dark:bg-[#1e3a8a] hover:bg-[#1e3a8a] dark:hover:bg-[#2563eb] text-white text-xs font-semibold transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>Direct Chat</span>
          </button>
        </div>

        {/* Details List */}
        <div className="space-y-2 mt-4">
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex items-center justify-between text-xs">
            <span className="text-[#757682] dark:text-[#94a3b8]">Direct Email:</span>
            <span className="font-semibold text-[#0b1c30] dark:text-white select-all">{employee.email}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex items-center justify-between text-xs">
            <span className="text-[#757682] dark:text-[#94a3b8]">Phone Extension:</span>
            <span className="font-semibold text-[#0b1c30] dark:text-white select-all">{employee.phone}</span>
          </div>
          <div className="p-3 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] border border-[#dce9ff] dark:border-[#223854] flex items-center justify-between text-xs">
            <span className="text-[#757682] dark:text-[#94a3b8]">Office Seating:</span>
            <span className="font-semibold text-[#0b1c30] dark:text-white">{employee.locationDetail}</span>
          </div>
        </div>

        {/* Inline Quick Message Box */}
        <div className="mt-4 p-3.5 rounded-xl bg-[#f8f9ff] dark:bg-[#18283f]/60 border border-[#dce9ff] dark:border-[#223854]">
          <span className="text-xs font-bold text-[#0b1c30] dark:text-white block mb-2">Send PulseHR Ping</span>
          {chatHistory.length > 0 && (
            <div className="space-y-1 mb-2 max-h-24 overflow-y-auto">
              {chatHistory.map((msg, i) => (
                <div key={i} className="text-xs p-2 rounded-lg bg-[#eff4ff] dark:bg-[#132238] text-[#00236f] dark:text-[#6ffbbe] flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">send</span>
                  <span>{msg}</span>
                </div>
              ))}
            </div>
          )}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder={`Message ${employee.name.split(' ')[0]}...`}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-[#132238] border border-[#c5c5d3] dark:border-[#334155] text-xs text-[#0b1c30] dark:text-white placeholder:text-[#757682] dark:placeholder:text-[#64748b] outline-none focus:ring-1 focus:ring-[#0058be]"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-lg bg-[#0058be] dark:bg-[#1e3a8a] text-white hover:bg-[#004395] dark:hover:bg-[#2563eb] text-xs font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
