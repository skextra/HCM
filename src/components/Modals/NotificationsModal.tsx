import React from 'react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClearAll: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Shift Punch Confirmed',
      message: 'Face ID verified at HQ Main Gate Floor 4 at 08:55 AM.',
      time: '08:55 AM',
      icon: 'verified',
      color: 'text-[#27c38a]',
      unread: true,
    },
    {
      id: '2',
      title: 'September Salary Disbursed',
      message: 'Net salary of $8,450.00 USD direct deposited to Standard Chartered Bank •••• 4821.',
      time: 'Yesterday',
      icon: 'payments',
      color: 'text-[#0058be]',
      unread: true,
    },
    {
      id: '3',
      title: 'Manager Decision SLA',
      message: 'Zayd Malik approved your Sick Leave voucher with medical certification.',
      time: 'Oct 09',
      icon: 'check_circle',
      color: 'text-[#27c38a]',
      unread: false,
    },
    {
      id: '4',
      title: 'Annual Benefits Open Enrollment',
      message: 'Open enrollment for FY25 healthcare packages closes midnight Nov 15.',
      time: 'Oct 01',
      icon: 'campaign',
      color: 'text-[#1e3a8a]',
      unread: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-16 bg-[#0b1c30]/20 dark:bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="w-full max-w-sm bg-white dark:bg-[#132238] rounded-2xl shadow-2xl p-4 border border-[#e5eeff] dark:border-[#1e2e48] mr-2 sm:mr-8 mt-2 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#eff4ff] dark:border-[#1e2e48]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#00236f] dark:text-[#6ffbbe]">notifications</span>
            <span className="text-sm font-bold text-[#0b1c30] dark:text-white">Notifications & Alerts</span>
          </div>
          <button
            onClick={onClearAll}
            className="text-[11px] font-semibold text-[#0058be] dark:text-[#6ffbbe] hover:underline"
          >
            Mark all read
          </button>
        </div>

        <div className="space-y-2.5 mt-3 max-h-80 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                n.unread
                  ? 'bg-[#eff4ff] dark:bg-[#18283f] border-[#dce9ff] dark:border-[#223854]'
                  : 'bg-white dark:bg-[#132238] border-[#f1f5f9] dark:border-[#1e2e48]'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] mt-0.5 ${n.color}`}>
                {n.icon}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[#0b1c30] dark:text-white truncate">{n.title}</span>
                  <span className="text-[10px] text-[#757682] dark:text-[#94a3b8] shrink-0">{n.time}</span>
                </div>
                <p className="text-xs text-[#444651] dark:text-[#cbd5e1] mt-0.5 leading-snug">{n.message}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-3 mt-3 border-t border-[#eff4ff] dark:border-[#1e2e48] text-center">
          <button
            onClick={onClose}
            className="w-full py-2 rounded-xl bg-[#eff4ff] dark:bg-[#18283f] hover:bg-[#e5eeff] dark:hover:bg-[#1f324e] text-xs font-semibold text-[#444651] dark:text-[#cbd5e1] transition-all"
          >
            Close Notification Center
          </button>
        </div>
      </div>
    </div>
  );
};
