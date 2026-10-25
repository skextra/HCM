import React, { useState, useEffect } from 'react';
import { TabType, Employee, ActiveShiftState, ShiftLog, LeaveQuota, LeaveRequest, PayslipRecord, ManagerApprovalItem, RegularizationItem } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { CommandPalette } from './components/CommandPalette';
import { ApplyLeaveModal } from './components/Modals/ApplyLeaveModal';
import { RegularizeModal } from './components/Modals/RegularizeModal';
import { PayslipModal } from './components/Modals/PayslipModal';
import { EmployeeProfileModal } from './components/Modals/EmployeeProfileModal';
import { OvertimeModal } from './components/Modals/OvertimeModal';
import { ClaimExpenseModal } from './components/Modals/ClaimExpenseModal';
import { NotificationsModal } from './components/Modals/NotificationsModal';
import { FaceIdModal } from './components/Modals/FaceIdModal';
import { HomeView } from './views/HomeView';
import { AttendanceView } from './views/AttendanceView';
import { LeavesView } from './views/LeavesView';
import { PayrollView } from './views/PayrollView';
import { DirectoryView } from './views/DirectoryView';
import { SettingsView } from './views/SettingsView';
import { LoginView } from './views/LoginView';
import { SignUpView } from './views/SignUpView';

export default function App() {
  const [authRoute, setAuthRoute] = useState<'app' | 'login' | 'signup'>('app');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile-frame'>('desktop');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pulsehr_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pulsehr_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pulsehr_theme', 'light');
    }
  }, [darkMode]);

  // Modals state
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isRegularizeModalOpen, setIsRegularizeModalOpen] = useState(false);
  const [isPayslipModalOpen, setIsPayslipModalOpen] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState<PayslipRecord | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isOvertimeModalOpen, setIsOvertimeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isFaceIdModalOpen, setIsFaceIdModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // App data state
  const [activeShift, setActiveShift] = useState<ActiveShiftState>({
    isActive: true,
    clockInTime: '08:55 AM',
    clockInTimestamp: Date.now() - (4 * 3600 + 46 * 60 + 15) * 1000,
    elapsedSeconds: 4 * 3600 + 46 * 60 + 15,
    isOnBreak: false,
    breakStartTime: null,
    breakElapsedMinutes: 45,
    geofence: 'HQ Floor 4 (Main Campus)',
    shiftType: 'General Standard (09:00 AM - 06:00 PM)',
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [manager, setManager] = useState<Employee | null>(null);
  const [shiftLogs, setShiftLogs] = useState<ShiftLog[]>([]);
  const [leaveQuotas, setLeaveQuotas] = useState<LeaveQuota[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [payslip, setPayslip] = useState<PayslipRecord | null>(null);
  const [payslipArchive, setPayslipArchive] = useState<PayslipRecord[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<ManagerApprovalItem[]>([]);
  const [regularizations, setRegularizations] = useState<RegularizationItem[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch initial data from Express backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, leavesRes, payrollRes, dirRes] = await Promise.all([
          fetch('/api/dashboard'),
          fetch('/api/leaves'),
          fetch('/api/payroll'),
          fetch('/api/directory'),
        ]);

        if (dashRes.ok) {
          const dash = await dashRes.json();
          if (dash.activeShift) setActiveShift(dash.activeShift);
          if (dash.recentShiftLogs) setShiftLogs(dash.recentShiftLogs);
          if (dash.pendingApprovals) setPendingApprovals(dash.pendingApprovals);
        }

        if (leavesRes.ok) {
          const lData = await leavesRes.json();
          if (lData.quotas) setLeaveQuotas(lData.quotas);
          if (lData.requests) setLeaveRequests(lData.requests);
        }

        if (payrollRes.ok) {
          const pData = await payrollRes.json();
          if (pData.currentPayslip) setPayslip(pData.currentPayslip);
          if (pData.archive) setPayslipArchive(pData.archive);
        }

        if (dirRes.ok) {
          const dData = await dirRes.json();
          if (dData.employees) setEmployees(dData.employees);
          if (dData.manager) setManager(dData.manager);
        }

        const attRes = await fetch('/api/attendance');
        if (attRes.ok) {
          const att = await attRes.json();
          if (att.shiftLogs) setShiftLogs(att.shiftLogs);
          if (att.regularizations) setRegularizations(att.regularizations);
        }
      } catch (err) {
        console.error('Initial fetch fallback initialized:', err);
      }
    };

    const checkSession = async () => {
      const token = localStorage.getItem('pulsehr_token');
      if (token) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) setCurrentUser(data.user);
          }
        } catch (e) {
          console.warn('Session check fallback:', e);
        }
      }
    };

    fetchData();
    checkSession();
  }, []);

  // Enterprise Auth Handlers
  const handleAuthSuccess = (user: any, token: string) => {
    setCurrentUser(user);
    if (token) {
      localStorage.setItem('pulsehr_token', token);
    }
    setAuthRoute('app');
    showToast(`Welcome, ${user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Administrator'}! Workspace authenticated.`);
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // offline fallback
    }
    localStorage.removeItem('pulsehr_token');
    setCurrentUser(null);
    setAuthRoute('login');
    showToast('Signed out of enterprise session.');
  };

  // Clock Actions with Biometric Face ID Simulation
  const handleClockAction = async (action: 'clock-in' | 'clock-out' | 'toggle-break') => {
    // If clock-in is triggered, display the Face ID security animation overlay first
    if (action === 'clock-in') {
      setIsFaceIdModalOpen(true);
      return;
    }

    await executeClockAction(action);
  };

  const executeClockAction = async (action: 'clock-in' | 'clock-out' | 'toggle-break') => {
    try {
      const res = await fetch('/api/attendance/clock-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        const data = await res.json();
        setActiveShift(data.activeShift);
      }
    } catch {
      // Local fallback
      if (action === 'clock-out') {
        setActiveShift((prev) => ({ ...prev, isActive: false }));
      } else if (action === 'clock-in') {
        setActiveShift((prev) => ({
          ...prev,
          isActive: true,
          clockInTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }));
      } else if (action === 'toggle-break') {
        setActiveShift((prev) => ({ ...prev, isOnBreak: !prev.isOnBreak }));
      }
    }

    if (action === 'clock-out') {
      showToast('Shift concluded and departure timestamp logged.');
    } else if (action === 'clock-in') {
      showToast('Welcome! Check-in verified via Face ID at HQ Floor 4.');
    } else {
      showToast(activeShift.isOnBreak ? 'Shift resumed! Timer running.' : 'Break session initiated.');
    }
  };

  const handleFaceIdSuccess = () => {
    setIsFaceIdModalOpen(false);
    executeClockAction('clock-in');
  };

  // Leave Submit
  const handleApplyLeave = async (data: { type: string; startDate: string; endDate: string; reason: string }) => {
    try {
      const res = await fetch('/api/leaves/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setLeaveRequests((prev) => [result.request, ...prev]);
        showToast('Leave request submitted to VP of People Ops for sign-off.');
      }
    } catch (err) {
      showToast('Leave request logged locally.');
    }
  };

  // Leave Withdraw
  const handleWithdrawRequest = async (id: string) => {
    try {
      await fetch(`/api/leaves/${id}`, { method: 'DELETE' });
      setLeaveRequests((prev) => prev.filter((r) => r.id !== id));
      showToast('Time-off request has been withdrawn.');
    } catch {
      setLeaveRequests((prev) => prev.filter((r) => r.id !== id));
      showToast('Time-off request withdrawn.');
    }
  };

  // Regularize Attendance Submit
  const handleRegularizeSubmit = async (data: { impactDate: string; requestedTime: string; reason: string }) => {
    try {
      const res = await fetch('/api/attendance/regularize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const result = await res.json();
        setRegularizations((prev) => [result.regularization, ...prev]);
        showToast('Missed punch regularization submitted for manager review.');
      }
    } catch {
      showToast('Regularization request submitted.');
    }
  };

  // Manager Approval Decision
  const handleApprovalDecision = async (id: string, approved: boolean) => {
    try {
      await fetch(`/api/approvals/${id}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved }),
      });
      setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
      showToast(approved ? 'Request approved and synced with HR Core!' : 'Request rejected.');
    } catch {
      setPendingApprovals((prev) => prev.filter((a) => a.id !== id));
      showToast(approved ? 'Request approved!' : 'Request rejected.');
    }
  };

  // Overtime Submit
  const handleOvertimeSubmit = (hours: number, task: string) => {
    showToast(`Successfully logged +${hours} hrs billable overtime for "${task}".`);
  };

  // Expense Submit
  const handleExpenseSubmit = (title: string, amount: number) => {
    showToast(`Expense claim for $${amount.toFixed(2)} ("${title}") submitted to Finance.`);
  };

  // Command palette action dispatcher
  const handleCommandAction = (actionId: string) => {
    switch (actionId) {
      case 'apply-leave':
        setIsLeaveModalOpen(true);
        break;
      case 'clock-toggle':
        handleClockAction(activeShift.isActive ? 'clock-out' : 'clock-in');
        break;
      case 'regularize':
        setIsRegularizeModalOpen(true);
        break;
      case 'view-payslip':
        if (payslip) {
          setSelectedPayslip(payslip);
          setIsPayslipModalOpen(true);
        }
        break;
      case 'claim-expense':
        setIsExpenseModalOpen(true);
        break;
      case 'overtime':
        setIsOvertimeModalOpen(true);
        break;
    }
  };

  const currentPayslip = payslip || {
    id: 'pay-2024-09',
    month: 'September 2024',
    disbursedDate: 'Sep 30, 2024',
    netPay: 8450.0,
    grossPay: 9050.0,
    currency: 'USD',
    bankName: 'Standard Chartered Bank',
    bankAccountMasked: '•••• 4821',
    status: 'Disbursed' as const,
    earnings: {
      basic: 6000.0,
      housing: 1800.0,
      transport: 750.0,
      bonus: 500.0,
      bonusLabel: 'Performance Bonus (Q3)',
    },
    deductions: {
      taxWht: 420.0,
      providentFund: 150.0,
      insurance: 30.0,
    },
  };

  // View content renderer
  const renderCurrentView = () => {
    switch (currentTab) {
      case 'home':
        return (
          <HomeView
            activeShift={activeShift}
            onClockAction={handleClockAction}
            onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
            onOpenPayslipModal={() => {
              setSelectedPayslip(currentPayslip);
              setIsPayslipModalOpen(true);
            }}
            onOpenRegularizeModal={() => setIsRegularizeModalOpen(true)}
            onOpenOvertimeModal={() => setIsOvertimeModalOpen(true)}
            onOpenExpenseModal={() => setIsExpenseModalOpen(true)}
            onSelectEmployee={(emp) => setSelectedEmployee(emp)}
            onNavigateTab={(tab) => setCurrentTab(tab)}
            pendingApprovals={pendingApprovals}
            onDecisionApproval={handleApprovalDecision}
            employees={employees}
          />
        );
      case 'attendance':
        return (
          <AttendanceView
            activeShift={activeShift}
            shiftLogs={shiftLogs}
            regularizations={regularizations}
            onOpenRegularizeModal={() => setIsRegularizeModalOpen(true)}
            onClockAction={handleClockAction}
          />
        );
      case 'leaves':
        return (
          <LeavesView
            quotas={leaveQuotas}
            requests={leaveRequests}
            onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
            onWithdrawRequest={handleWithdrawRequest}
          />
        );
      case 'payroll':
        return (
          <PayrollView
            payslip={currentPayslip}
            archive={payslipArchive}
            onOpenPayslipModal={(record) => {
              setSelectedPayslip(record || currentPayslip);
              setIsPayslipModalOpen(true);
            }}
          />
        );
      case 'directory':
        return (
          <DirectoryView
            employees={employees}
            manager={manager}
            onSelectEmployee={(emp) => setSelectedEmployee(emp)}
          />
        );
      case 'settings':
        return (
          <SettingsView
            darkMode={darkMode}
            onToggleDarkMode={(val) => setDarkMode(val)}
            currentUser={currentUser}
            onSignOut={handleSignOut}
            onNavigateAuth={(route) => setAuthRoute(route)}
          />
        );
    }
  };

  // Auth Screens Routing
  if (authRoute === 'login') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0b1c30] text-white px-4 py-2 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce border border-white/10">
            <span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">verified</span>
            <span>{toastMessage}</span>
          </div>
        )}
        <LoginView
          onLoginSuccess={handleAuthSuccess}
          onNavigateSignUp={() => setAuthRoute('signup')}
          onBypassDemo={() => setAuthRoute('app')}
        />
      </div>
    );
  }

  if (authRoute === 'signup') {
    return (
      <div className={darkMode ? 'dark' : ''}>
        {toastMessage && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0b1c30] text-white px-4 py-2 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce border border-white/10">
            <span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">verified</span>
            <span>{toastMessage}</span>
          </div>
        )}
        <SignUpView
          onSignUpSuccess={handleAuthSuccess}
          onNavigateLogin={() => setAuthRoute('login')}
          onBypassDemo={() => setAuthRoute('app')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#0b1320] text-[#0b1c30] dark:text-[#f1f5f9] flex flex-col antialiased selection:bg-[#d8e2ff] dark:selection:bg-[#1e3a8a] transition-colors">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#0b1c30] dark:bg-[#132238] dark:border dark:border-[#1e2e48] text-white px-4 py-2.5 rounded-full shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined text-[#6ffbbe] text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* VIEW MODE: Mobile Frame Simulator */}
      {viewMode === 'mobile-frame' ? (
        <div className="min-h-screen bg-[#1e293b] dark:bg-[#070d16] py-6 px-4 flex flex-col items-center justify-center transition-colors">
          {/* Top Frame Bar with Mode Toggle */}
          <div className="w-full max-w-[440px] flex items-center justify-between text-white text-xs mb-3 px-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#27c38a]"></span>
              <span className="font-bold">Mobile View Frame (390 x 844)</span>
            </div>
            <button
              onClick={() => setViewMode('desktop')}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">desktop_windows</span>
              <span>Back to Desktop Layout</span>
            </button>
          </div>

          {/* iPhone Mockup Frame */}
          <div className="w-full max-w-[420px] h-[860px] bg-black rounded-[48px] p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/20 flex flex-col relative overflow-hidden">
            {/* Dynamic Island Pill */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-between px-3">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b]/60"></div>
            </div>

            {/* Inner Mobile Screen */}
            <div className="w-full h-full bg-[#f8f9ff] dark:bg-[#0b1320] rounded-[38px] overflow-hidden flex flex-col relative transition-colors">
              {/* Mobile Top App Bar */}
              <header className="h-14 bg-white/95 dark:bg-[#0f1b2d]/95 backdrop-blur-md px-4 flex items-center justify-between border-b border-[#e5eeff] dark:border-[#1e2e48] shrink-0 pt-2 z-40 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-[#00236f] dark:bg-[#1e3a8a] flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[16px]">vital_signs</span>
                  </div>
                  <span className="font-bold text-base tracking-tight text-[#00236f] dark:text-[#90a8ff]">
                    Pulse<span className="text-[#0058be] dark:text-[#6ffbbe]">HR</span>
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#444651] dark:text-[#cbd5e1] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors"
                    title={darkMode ? 'Switch to Light' : 'Switch to Dark'}
                  >
                    <span className="material-symbols-outlined text-[19px]">
                      {darkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                  </button>
                  <button
                    onClick={() => setIsNotificationsOpen(true)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#444651] dark:text-[#cbd5e1] hover:bg-[#eff4ff] dark:hover:bg-[#18283f] transition-colors"
                  >
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                  </button>
                  <button
                    onClick={() => {
                      const user = employees[0];
                      if (user) setSelectedEmployee(user);
                    }}
                    className="w-7 h-7 rounded-full overflow-hidden ring-1 ring-[#0058be] dark:ring-[#6ffbbe]"
                  >
                    <img
                      src={currentUser?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256"}
                      alt={currentUser?.name || "User"}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#ba1a1a] dark:text-[#ffb4ab] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                    title="Sign Out to Enterprise Portal"
                  >
                    <span className="material-symbols-outlined text-[19px]">logout</span>
                  </button>
                </div>
              </header>

              {/* Scrollable Mobile Content */}
              <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 pb-20">
                {renderCurrentView()}
              </div>

              {/* Mobile Fixed Bottom Nav */}
              <BottomNav currentTab={currentTab} onSelectTab={(t) => setCurrentTab(t)} />
            </div>
          </div>
        </div>
      ) : (
        /* VIEW MODE: Full Responsive & Desktop Layout */
        <div className="flex flex-1">
          {/* Desktop Sidebar (visible on lg screens) */}
          <div className="hidden lg:block">
            <Sidebar
              currentTab={currentTab}
              onSelectTab={(tab) => setCurrentTab(tab)}
              pendingApprovalsCount={pendingApprovals.length}
              onSignOut={handleSignOut}
              onNavigateAuth={(route) => setAuthRoute(route)}
            />
          </div>

          {/* Main Area */}
          <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
            <Header
              currentTab={currentTab}
              activeShift={activeShift}
              onClockAction={handleClockAction}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
              viewMode={viewMode}
              onToggleViewMode={() => setViewMode(viewMode === 'desktop' ? 'mobile-frame' : 'desktop')}
              onOpenProfile={() => {
                const user = employees[0];
                if (user) setSelectedEmployee(user);
              }}
              unreadNotifications={2}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              darkMode={darkMode}
              onToggleDarkMode={() => setDarkMode((prev) => !prev)}
              currentUser={currentUser}
              onSignOut={handleSignOut}
            />

            <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto pb-24 lg:pb-12">
              {renderCurrentView()}
            </main>

            {/* Mobile Bottom Navigation (only on mobile viewports when not in frame mode) */}
            <div className="lg:hidden">
              <BottomNav currentTab={currentTab} onSelectTab={(t) => setCurrentTab(t)} />
            </div>
          </div>
        </div>
      )}

      {/* Global Modals */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(t) => setCurrentTab(t)}
        onOpenAction={handleCommandAction}
        employees={employees}
        onSelectEmployee={(emp) => setSelectedEmployee(emp)}
      />

      <ApplyLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleApplyLeave}
      />

      <RegularizeModal
        isOpen={isRegularizeModalOpen}
        onClose={() => setIsRegularizeModalOpen(false)}
        onSubmit={handleRegularizeSubmit}
      />

      <PayslipModal
        isOpen={isPayslipModalOpen}
        onClose={() => setIsPayslipModalOpen(false)}
        payslip={selectedPayslip}
      />

      <EmployeeProfileModal
        isOpen={!!selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        employee={selectedEmployee}
      />

      <OvertimeModal
        isOpen={isOvertimeModalOpen}
        onClose={() => setIsOvertimeModalOpen(false)}
        onSubmit={handleOvertimeSubmit}
      />

      <ClaimExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSubmit={handleExpenseSubmit}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onClearAll={() => {
          showToast('All notifications marked as read.');
          setIsNotificationsOpen(false);
        }}
      />

      {/* Security Biometric Face ID Simulation Overlay */}
      <FaceIdModal
        isOpen={isFaceIdModalOpen}
        onSuccess={handleFaceIdSuccess}
        onCancel={() => setIsFaceIdModalOpen(false)}
        employeeName={employees[0]?.name || 'Tariq Al-Mansoor'}
        geofence={activeShift.geofence}
      />
    </div>
  );
}
