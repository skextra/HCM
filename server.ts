import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { db } from './src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// -------------------------------------------------------------
// REST API Routes backed by MongoDB collections
// -------------------------------------------------------------

// -------------------------------------------------------------
// Authentication Endpoints (Login, Register, SSO, Session)
// -------------------------------------------------------------

// Enterprise Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password, rememberDevice } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Work email and master password are required' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  let user = await db.users.findOne({ email: normalizedEmail });

  // If user doesn't exist, check demo personas or create workspace user
  if (!user) {
    if (normalizedEmail.includes('evelyn') || normalizedEmail.includes('omniahealth')) {
      user = await db.users.findOne({ id: 'user-evelyn' });
    } else if (normalizedEmail.includes('tariq') || normalizedEmail.includes('pulsehr')) {
      user = await db.users.findOne({ id: 'user-tariq' });
    } else {
      const username = normalizedEmail.split('@')[0];
      const domain = normalizedEmail.split('@')[1] || 'enterprise.com';
      const company = domain.split('.')[0].toUpperCase() + ' Corp';
      user = {
        id: `user-${Date.now()}`,
        email: normalizedEmail,
        passwordHash: password,
        firstName: username.charAt(0).toUpperCase() + username.slice(1),
        lastName: 'Executive',
        name: `${username.charAt(0).toUpperCase() + username.slice(1)} Executive`,
        role: 'Enterprise Administrator',
        companyName: company,
        companySize: '250-1000',
        country: 'US',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        authProvider: 'local',
        createdAt: new Date().toISOString(),
      };
      await db.users.insertOne(user);
    }
  }

  if (user && user.passwordHash && user.passwordHash !== password && password !== 'EnterpriseSecret2025#' && password !== 'PulseHR2025!') {
    if (password.length < 6) {
      return res.status(401).json({ error: 'Invalid master password. Please verify your corporate credentials.' });
    }
  }

  const token = `plse_tok_${Buffer.from(`${user!.id}:${Date.now()}`).toString('base64')}`;
  const workspace = (await db.workspaces.findOne({ adminEmail: user!.email })) || {
    id: `ws-${Date.now()}`,
    companyName: user!.companyName || 'Enterprise Workspace',
    companySize: user!.companySize || '250-1000',
    country: user!.country || 'US',
    adminEmail: user!.email,
    plan: 'enterprise-trial' as const,
    createdAt: new Date().toISOString(),
  };

  res.json({
    success: true,
    token,
    user,
    workspace,
    tokenExpiresIn: rememberDevice ? '14d' : '24h',
    message: 'Authenticated successfully. Redirecting to Enterprise Workspace...',
  });
});

// Enterprise Sign Up / Registration
app.post('/api/auth/register', async (req, res) => {
  const { workEmail, firstName, lastName, companyName, companySize, countryLocation, password, plan } = req.body;

  if (!workEmail || !firstName || !lastName || !companyName) {
    return res.status(400).json({ error: 'All registration fields are required.' });
  }

  const normalizedEmail = String(workEmail).trim().toLowerCase();
  const existing = await db.users.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(409).json({ error: 'An enterprise account already exists for this work email domain. Please sign in.' });
  }

  const newUser = {
    id: `user-${Date.now()}`,
    email: normalizedEmail,
    passwordHash: password || 'Enterprise2025#',
    firstName,
    lastName,
    name: `${firstName} ${lastName}`,
    role: 'Workspace Owner & Administrator',
    companyName,
    companySize: companySize || '50-250',
    country: countryLocation || 'US',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    authProvider: 'local' as const,
    createdAt: new Date().toISOString(),
  };

  const newWorkspace = {
    id: `ws-${Date.now()}`,
    companyName,
    companySize: companySize || '50-250',
    country: countryLocation || 'US',
    adminEmail: normalizedEmail,
    plan: (plan as any) || 'enterprise-trial',
    createdAt: new Date().toISOString(),
  };

  await db.users.insertOne(newUser);
  await db.workspaces.insertOne(newWorkspace);

  // Add to directory employees
  await db.employees.insertOne({
    id: newUser.id,
    name: newUser.name,
    role: newUser.role,
    department: 'Operations',
    avatar: newUser.avatar,
    status: 'In Office',
    locationDetail: `${companyName} HQ`,
    email: newUser.email,
    phone: '+1 (555) 019-2834',
    empId: `EMP-${Math.floor(10000 + Math.random() * 90000)}`,
    isManager: true,
  });

  const token = `plse_tok_${Buffer.from(`${newUser.id}:${Date.now()}`).toString('base64')}`;

  res.status(201).json({
    success: true,
    token,
    user: newUser,
    workspace: newWorkspace,
    message: 'Enterprise workspace successfully provisioned.',
  });
});

// Single Sign-On Fast Track (Okta, Google Workspace, Azure AD)
app.post('/api/auth/sso', async (req, res) => {
  const { provider } = req.body;
  const validProviders = ['okta', 'google', 'azure'];
  const prov = validProviders.includes(provider) ? provider : 'google';

  const user = (await db.users.findOne({ id: 'user-evelyn' })) || (await db.users.find())[0];
  const token = `plse_sso_${prov}_${Buffer.from(`${user.id}:${Date.now()}`).toString('base64')}`;
  const workspace = await db.workspaces.findOne({ adminEmail: user.email });

  res.json({
    success: true,
    token,
    user: {
      ...user,
      authProvider: prov,
    },
    workspace,
    message: `Authenticated via Enterprise ${prov.toUpperCase()} SSO.`,
  });
});

// Current User Session
app.get('/api/auth/me', async (req, res) => {
  const users = await db.users.find();
  const defaultUser = users[0];

  res.json({
    authenticated: true,
    user: defaultUser,
    activeShift: db.activeShiftState,
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Signed out from enterprise session.' });
});

// Current Authenticated User Profile
app.get('/api/profile', async (req, res) => {
  const user = await db.employees.findOne({ id: 'emp-current' });
  const manager = await db.employees.findOne({ isManager: true });
  res.json({
    user,
    manager,
    meta: {
      version: 'v2.4',
      system: 'PulseHR Enterprise HCM',
      compliance: 'US-East Verified • ISO 27001',
    },
  });
});

// Dashboard Aggregates
app.get('/api/dashboard', async (req, res) => {
  const currentShift = db.activeShiftState;
  const quotas = await db.leaveQuotas.find();
  const shiftLogs = await db.shiftLogs.find();
  const approvals = await db.approvals.find({ status: 'pending' });
  const employees = await db.employees.find();

  // Calculate live team availability
  const activeMembers = employees.length;
  const inOffice = employees.filter((e) => e.status === 'In Office').length;
  const remote = employees.filter((e) => e.status === 'Remote').length;
  const onLeave = employees.filter((e) => e.status.includes('Leave')).length;

  res.json({
    activeShift: currentShift,
    metrics: {
      attendanceRate: '96.4%',
      attendanceChange: '+1.2%',
      leaveBalanceDays: 14,
      totalLeaveDays: 28,
      nextPayrollDays: 6,
      nextPayrollDate: 'Oct 31, 2024',
      estNetDeposit: '$8,450.00',
      hoursLogged: 168.5,
      quotaHours: 176.0,
      completionPace: '95.7%',
      remainingHours: 7.5,
      punctualityScore: '98.2%',
      punctualityChange: '+0.4%',
    },
    teamStats: {
      activeMembers,
      inOffice,
      remote,
      onLeave,
    },
    recentShiftLogs: shiftLogs.slice(0, 4),
    pendingApprovals: approvals,
  });
});

// Attendance & Timesheets API
app.get('/api/attendance', async (req, res) => {
  const logs = await db.shiftLogs.find();
  const regularizations = await db.regularizations.find();
  res.json({
    activeShift: db.activeShiftState,
    monthSummary: {
      month: 'October 2024',
      quarter: 'Q4 FY24',
      present: 20,
      late: 1,
      absent: 0,
      holidays: 2,
    },
    kpis: {
      totalLogged: 168.5,
      requiredTotal: 176.0,
      pacePercentage: 95.7,
      remainingHours: 7.5,
      avgDailyHours: '8h 25m',
      targetDiff: '+15m vs target',
      overtimeLogged: '+6.5 hrs',
      overtimeNote: 'Approved & Billable',
      punctualityScore: '98.2%',
    },
    todayShift: {
      category: 'General Standard (09:00 AM - 06:00 PM)',
      clockInTime: db.activeShiftState.clockInTime,
      clockInVerification: 'Face ID Verified • HQ Main Gate',
      breakUtilized: `${db.activeShiftState.breakElapsedMinutes}m utilized (1:00 PM - 1:45 PM)`,
      expectedDeparture: '06:00 PM • Automated Departure Rule',
    },
    shiftLogs: logs,
    regularizations,
  });
});

// Clock In / Clock Out / Break Controls
app.post('/api/attendance/clock-action', (req, res) => {
  const { action } = req.body; // 'clock-in' | 'clock-out' | 'toggle-break'

  if (action === 'clock-out') {
    db.activeShiftState.isActive = false;
    db.activeShiftState.isOnBreak = false;
  } else if (action === 'clock-in') {
    db.activeShiftState.isActive = true;
    db.activeShiftState.clockInTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
    db.activeShiftState.clockInTimestamp = Date.now();
    db.activeShiftState.isOnBreak = false;
  } else if (action === 'toggle-break') {
    db.activeShiftState.isOnBreak = !db.activeShiftState.isOnBreak;
    if (db.activeShiftState.isOnBreak) {
      db.activeShiftState.breakStartTime = Date.now();
    } else {
      db.activeShiftState.breakStartTime = null;
    }
  }

  res.json({
    success: true,
    activeShift: db.activeShiftState,
  });
});

// Regularize Attendance Request
app.post('/api/attendance/regularize', async (req, res) => {
  const { impactDate, requestedTime, reason } = req.body;
  const newReg = {
    id: `REG-${Math.floor(1000 + Math.random() * 9000)}`,
    impactDate: impactDate || 'Oct 23, 2024',
    originalTime: 'Missed Punch',
    requestedTime: requestedTime || '09:00 AM',
    reason: reason || 'Beacon turnstile hardware malfunction',
    status: 'pending' as const,
    submittedAt: 'Just now',
  };
  await db.regularizations.insertOne(newReg);
  res.json({ success: true, regularization: newReg });
});

// Leave Portal API
app.get('/api/leaves', async (req, res) => {
  const quotas = await db.leaveQuotas.find();
  const requests = await db.leaveRequests.find();
  res.json({
    quotas,
    requests,
    policySummary: {
      fiscalYear: 'FY 2024-25',
      cycleStatus: 'Active & Compliant',
      approvalChain: 'Zayd Malik (VP, People Ops) -> Department Head',
    },
  });
});

// Submit Leave Application
app.post('/api/leaves/apply', async (req, res) => {
  const { type, startDate, endDate, reason } = req.body;

  // Calculate day difference
  const start = new Date(startDate || '2024-11-20');
  const end = new Date(endDate || '2024-11-22');
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  const titleMap: Record<string, string> = {
    annual: 'Annual Vacation',
    casual: 'Casual Leave',
    sick: 'Sick Leave',
    comp: 'Compensatory Off',
  };

  const newRequest: any = {
    id: `req-${Date.now()}`,
    reqNumber: `REQ-2024-${Math.floor(1000 + Math.random() * 9000)}`,
    type: type || 'annual',
    title: titleMap[type] || 'Time Off',
    days: diffDays || 1,
    startDate,
    endDate,
    dateRangeDisplay: `${startDate} to ${endDate}`,
    reason: reason || 'Personal leave request',
    status: 'pending',
    approverName: 'Zayd Malik',
    approverRole: 'VP, People Ops',
    submissionDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
  };

  await db.leaveRequests.insertOne(newRequest);

  // Update quota available balance
  const quota = await db.leaveQuotas.findOne({ id: type });
  if (quota) {
    await db.leaveQuotas.updateOne({ id: type }, {
      used: quota.used + diffDays,
      available: Math.max(0, quota.available - diffDays),
    });
  }

  res.json({ success: true, request: newRequest });
});

// Withdraw Leave Application
app.delete('/api/leaves/:id', async (req, res) => {
  const { id } = req.params;
  const existing = await db.leaveRequests.findOne({ id });
  if (existing) {
    await db.leaveRequests.deleteOne({ id });
    res.json({ success: true, message: 'Request successfully withdrawn' });
  } else {
    res.status(404).json({ error: 'Leave request not found' });
  }
});

// Payroll API
app.get('/api/payroll', async (req, res) => {
  const payslips = await db.payslips.find();
  const current = payslips[0];
  res.json({
    currentPayslip: current,
    ytd: {
      grossEarnings: 81450.0,
      taxContributed: 3780.0,
      effectiveRate: '4.64%',
      period: 'Jan - Sep 2024',
      taxDeclarationVerified: true,
    },
    archive: payslips.slice(1),
    security: {
      encryption: 'AES-256 GCM Encrypted Payroll Document',
      standard: 'PulseHR Compliance Standard ISO-27001',
    },
  });
});

// Directory API
app.get('/api/directory', async (req, res) => {
  const { search, department } = req.query;
  let employees = await db.employees.find();

  if (department && department !== 'all') {
    employees = employees.filter((e) => e.department.toLowerCase() === String(department).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    employees = employees.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.locationDetail.toLowerCase().includes(q)
    );
  }

  const manager = await db.employees.findOne({ isManager: true });

  res.json({
    total: employees.length,
    employees,
    manager,
    counts: {
      all: 142,
      design: 14,
      engineering: 58,
      product: 18,
      peopleOps: 12,
    },
  });
});

// Manager Approvals Action
app.post('/api/approvals/:id/decision', async (req, res) => {
  const { id } = req.params;
  const { approved } = req.body;
  const item = await db.approvals.findOne({ id });
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  await db.approvals.updateOne({ id }, { status: approved ? 'approved' : 'rejected' });
  res.json({ success: true, status: approved ? 'approved' : 'rejected' });
});

// -------------------------------------------------------------
// Dev vs Production Vite Integration
// -------------------------------------------------------------
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PulseHR Core] Server running on port ${PORT}`);
  });
}

startServer();
