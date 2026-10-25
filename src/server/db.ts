/**
 * MongoDB-compatible repository and data store for PulseHR Enterprise HCM.
 * Supports standard MongoDB queries and updates, with persistent collection storage.
 */

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: 'Design' | 'Engineering' | 'Product' | 'People Ops' | 'Operations';
  avatar: string;
  status: 'In Office' | 'Remote' | 'Casual Leave' | 'Annual Leave' | 'Sick Leave';
  locationDetail: string;
  email: string;
  phone: string;
  empId: string;
  slackActive?: boolean;
  isManager?: boolean;
}

export interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  name: string;
  role: string;
  companyName: string;
  companySize?: string;
  country?: string;
  avatar: string;
  authProvider: 'local' | 'okta' | 'google' | 'azure';
  token?: string;
  createdAt: string;
}

export interface Workspace {
  id: string;
  companyName: string;
  companySize: string;
  country: string;
  adminEmail: string;
  plan: 'enterprise-trial' | 'professional' | 'custom';
  createdAt: string;
}

export interface ShiftLog {
  id: string;
  date: string;
  dayLabel: string;
  shiftProfile: string;
  clockIn: string;
  clockInVerified: string;
  breakDuration: string;
  clockOut: string;
  effectiveHrs: string;
  status: 'Present' | 'Late' | 'Overtime' | 'Absent' | 'Holiday' | 'Weekly Off';
  lateMinutes?: number;
  overtimeHours?: number;
  location: string;
}

export interface ActiveShiftState {
  isActive: boolean;
  clockInTime: string;
  clockInTimestamp: number;
  elapsedSeconds: number;
  isOnBreak: boolean;
  breakStartTime: number | null;
  breakElapsedMinutes: number;
  geofence: string;
  shiftType: string;
}

export interface LeaveQuota {
  type: 'annual' | 'casual' | 'sick' | 'comp';
  title: string;
  used: number;
  total: number;
  available: number;
  percentage: number;
  category: string;
  note: string;
  color: string;
}

export interface LeaveRequest {
  id: string;
  reqNumber: string;
  type: 'annual' | 'casual' | 'sick' | 'comp';
  title: string;
  days: number;
  startDate: string;
  endDate: string;
  dateRangeDisplay: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approverName: string;
  approverRole: string;
  approverAvatar?: string;
  attachmentName?: string;
  attachmentSize?: string;
  submissionDate: string;
  decidedAt?: string;
  rejectionReason?: string;
}

export interface PayslipRecord {
  id: string;
  month: string;
  disbursedDate: string;
  netPay: number;
  grossPay: number;
  currency: string;
  bankName: string;
  bankAccountMasked: string;
  status: 'Disbursed' | 'Processing';
  earnings: {
    basic: number;
    housing: number;
    transport: number;
    bonus: number;
    bonusLabel: string;
  };
  deductions: {
    taxWht: number;
    providentFund: number;
    insurance: number;
  };
}

export interface ManagerApprovalItem {
  id: string;
  employeeName: string;
  employeeRole: string;
  requestType: 'PTO' | 'Remote' | 'Overtime' | 'Regularization';
  period: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
}

export interface RegularizationItem {
  id: string;
  impactDate: string;
  originalTime: string;
  requestedTime: string;
  reason: string;
  status: 'pending' | 'approved';
  submittedAt: string;
}

// In-Memory MongoDB Collection Mock Implementation
class MongoCollection<T extends { id: string }> {
  private data: Map<string, T> = new Map();
  public name: string;

  constructor(name: string, initialData: T[]) {
    this.name = name;
    initialData.forEach((item) => this.data.set(item.id, { ...item }));
  }

  async find(filter?: Partial<Record<keyof T, any>>): Promise<T[]> {
    let results = Array.from(this.data.values());
    if (filter) {
      results = results.filter((item) => {
        return Object.entries(filter).every(([key, val]) => {
          if (val === undefined || val === 'all') return true;
          return (item as any)[key] === val;
        });
      });
    }
    return results;
  }

  async findOne(filter: Partial<Record<keyof T, any>>): Promise<T | null> {
    const list = await this.find(filter);
    return list[0] || null;
  }

  async insertOne(doc: T): Promise<T> {
    this.data.set(doc.id, { ...doc });
    return doc;
  }

  async updateOne(filter: Partial<Record<keyof T, any>>, update: Partial<T>): Promise<boolean> {
    const item = await this.findOne(filter);
    if (!item) return false;
    const updated = { ...item, ...update };
    this.data.set(item.id, updated);
    return true;
  }

  async deleteOne(filter: Partial<Record<keyof T, any>>): Promise<boolean> {
    const item = await this.findOne(filter);
    if (!item) return false;
    return this.data.delete(item.id);
  }
}

// Initial Seed Data mirroring mockups exactly
const initialActiveShift: ActiveShiftState = {
  isActive: true,
  clockInTime: '08:55 AM',
  clockInTimestamp: Date.now() - (4 * 3600 + 46 * 60 + 15) * 1000,
  elapsedSeconds: 4 * 3600 + 46 * 60 + 15, // 04h 46m 15s
  isOnBreak: false,
  breakStartTime: null,
  breakElapsedMinutes: 45,
  geofence: 'HQ Floor 4 (Main Campus)',
  shiftType: 'General Standard (09:00 AM - 06:00 PM)',
};

const initialEmployees: Employee[] = [
  {
    id: 'emp-current',
    name: 'Tariq Al-Mansoor',
    role: 'Senior Lead Product Designer',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    status: 'In Office',
    locationDetail: 'Floor 4 • Lead Pod',
    email: 'tariq.mansoor@pulsehr.internal',
    phone: '+1 (555) 234-8901',
    empId: 'EMP-04182',
    isManager: false,
  },
  {
    id: 'emp-zayd',
    name: 'Zayd Malik',
    role: 'VP of Product Design',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    status: 'In Office',
    locationDetail: 'Available • Floor 5 Exec Suite',
    email: 'zayd.malik@pulsehr.internal',
    phone: '+1 (555) 492-1084',
    empId: 'EMP-01040',
    isManager: true,
  },
  {
    id: 'emp-sarah-k',
    name: 'Sarah Khan',
    role: 'Senior UI/UX Designer',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    status: 'In Office',
    locationDetail: 'In Office • Floor 4',
    email: 'sarah.khan@pulsehr.internal',
    phone: '+1 (555) 302-9988',
    empId: 'EMP-04210',
  },
  {
    id: 'emp-ali',
    name: 'Ali Raza',
    role: 'Lead Design System Engineer',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
    status: 'Remote',
    locationDetail: 'Remote • Slack active',
    email: 'ali.raza@pulsehr.internal',
    phone: '+1 (555) 884-7712',
    empId: 'EMP-03891',
    slackActive: true,
  },
  {
    id: 'emp-ayesha',
    name: 'Ayesha Noor',
    role: 'Senior HR Business Partner',
    department: 'People Ops',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    status: 'In Office',
    locationDetail: 'In Office • Floor 2',
    email: 'ayesha.noor@pulsehr.internal',
    phone: '+1 (555) 612-4091',
    empId: 'EMP-02944',
  },
  {
    id: 'emp-david',
    name: 'David Chen',
    role: 'Principal Product Architect',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
    status: 'Annual Leave',
    locationDetail: 'On Leave until Oct 28',
    email: 'david.chen@pulsehr.internal',
    phone: '+1 (555) 745-9201',
    empId: 'EMP-01452',
  },
  {
    id: 'emp-fatima',
    name: 'Fatima Zahra',
    role: 'Product Manager • Enterprise Workflows',
    department: 'Product',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256',
    status: 'In Office',
    locationDetail: 'In Office • Meeting Room B',
    email: 'fatima.zahra@pulsehr.internal',
    phone: '+1 (555) 901-2354',
    empId: 'EMP-04510',
  },
  {
    id: 'emp-imran',
    name: 'Imran Darwish',
    role: 'Staff Frontend Architect',
    department: 'Engineering',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    status: 'Remote',
    locationDetail: 'Remote (WFH)',
    email: 'imran.darwish@pulsehr.internal',
    phone: '+1 (555) 438-9901',
    empId: 'EMP-03120',
  },
  {
    id: 'emp-elena',
    name: 'Elena Rostova',
    role: 'Lead UX Research Partner',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
    status: 'In Office',
    locationDetail: 'In Office • Fl 4 (Desk 412)',
    email: 'elena.rostova@pulsehr.internal',
    phone: '+1 (555) 776-5510',
    empId: 'EMP-03512',
  },
  {
    id: 'emp-sarah-j',
    name: 'Sarah Jenkins',
    role: 'Product Designer',
    department: 'Design',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256',
    status: 'Casual Leave',
    locationDetail: 'Casual Leave (Back Oct 28)',
    email: 'sarah.jenkins@pulsehr.internal',
    phone: '+1 (555) 332-1190',
    empId: 'EMP-04661',
  },
];

const initialShiftLogs: ShiftLog[] = [
  {
    id: 'log-2024-10-24',
    date: 'Oct 24, 2024',
    dayLabel: 'Thursday • Today',
    shiftProfile: 'General Standard (09:00 - 18:00)',
    clockIn: '08:55 AM',
    clockInVerified: 'Face ID Verified • HQ Main Gate',
    breakDuration: '45m utilized',
    clockOut: 'In Progress (Exp: 06:00 PM)',
    effectiveHrs: '07h 42m',
    status: 'Present',
    location: 'HQ Main Campus - Floor 4',
  },
  {
    id: 'log-2024-10-23',
    date: 'Oct 23, 2024',
    dayLabel: 'Yesterday (Oct 23)',
    shiftProfile: 'General Standard (09:00 - 18:00)',
    clockIn: '08:58 AM',
    clockInVerified: 'Face ID Verified • HQ Gate 2',
    breakDuration: '60m utilized',
    clockOut: '19:30 PM',
    effectiveHrs: '09h 32m',
    status: 'Overtime',
    overtimeHours: 1.5,
    location: 'HQ Floor 4',
  },
  {
    id: 'log-2024-10-22',
    date: 'Oct 22, 2024',
    dayLabel: 'Tue, Oct 22',
    shiftProfile: 'General Standard (09:00 - 18:00)',
    clockIn: '09:24 AM',
    clockInVerified: 'Biometric Touch • East Wing',
    breakDuration: '50m utilized',
    clockOut: '18:24 PM',
    effectiveHrs: '08h 10m',
    status: 'Late',
    lateMinutes: 24,
    location: 'HQ Floor 4',
  },
  {
    id: 'log-2024-10-21',
    date: 'Oct 21, 2024',
    dayLabel: 'Mon, Oct 21',
    shiftProfile: 'General Standard (09:00 - 18:00)',
    clockIn: '08:50 AM',
    clockInVerified: 'Face ID Verified • HQ Gate 1',
    breakDuration: '45m utilized',
    clockOut: '18:05 PM',
    effectiveHrs: '08h 30m',
    status: 'Present',
    location: 'HQ Floor 4',
  },
  {
    id: 'log-2024-10-14',
    date: 'Oct 14, 2024',
    dayLabel: 'Mon, Oct 14',
    shiftProfile: 'Mandatory Paid Holiday',
    clockIn: '--:--',
    clockInVerified: 'Corporate Holiday Calendar',
    breakDuration: '--',
    clockOut: '--:--',
    effectiveHrs: '08h 00m (Credited)',
    status: 'Holiday',
    location: 'Official Holiday',
  },
];

const initialLeaveQuotas: LeaveQuota[] = [
  {
    type: 'annual',
    title: 'Annual Vacation',
    used: 10,
    total: 18,
    available: 8,
    percentage: 44,
    category: 'Statutory Allowance',
    note: 'Accrues 1.5d/mo • Carryover: 4 Max',
    color: '#1e3a8a',
  },
  {
    type: 'casual',
    title: 'Casual Leave',
    used: 6,
    total: 10,
    available: 4,
    percentage: 60,
    category: 'Short-Notice Personal',
    note: 'No prior notice required • Expires Dec 31',
    color: '#0058be',
  },
  {
    type: 'sick',
    title: 'Sick / Medical',
    used: 2,
    total: 8,
    available: 6,
    percentage: 75,
    category: 'Health & Recovery',
    note: 'Cert needed > 2 days • 100% Paid',
    color: '#004a31',
  },
  {
    type: 'comp',
    title: 'Compensatory Off',
    used: 0,
    total: 2,
    available: 2,
    percentage: 100,
    category: 'Overtime Offset',
    note: 'Earned Q4 System Deployment • Valid 60d',
    color: '#2170e4',
  },
];

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: 'req-2024-8842',
    reqNumber: 'REQ-2024-8842',
    type: 'annual',
    title: 'Annual Vacation',
    days: 3,
    startDate: '2024-11-12',
    endDate: '2024-11-14',
    dateRangeDisplay: 'Nov 12 – Nov 14, 2024',
    reason: 'Family trip to Northern Areas. Team coverage coordinated with Imran.',
    status: 'pending',
    approverName: 'Zayd Malik',
    approverRole: 'VP, People Ops',
    approverAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    attachmentName: 'Travel_Booking_Confirm.pdf',
    attachmentSize: '840 KB',
    submissionDate: 'Nov 06, 2024',
  },
  {
    id: 'req-2024-7719',
    reqNumber: 'REQ-2024-7719',
    type: 'sick',
    title: 'Sick Leave',
    days: 2,
    startDate: '2024-10-24',
    endDate: '2024-10-25',
    dateRangeDisplay: 'Sep 18 – Sep 19, 2024',
    reason: 'Acute seasonal viral infection. Prescribed bed rest and home recovery.',
    status: 'approved',
    approverName: 'Zayd Malik',
    approverRole: 'VP, People Ops',
    attachmentName: 'Medical_Consult_DrFaiz.pdf',
    attachmentSize: '1.4 MB • Verified Clinic',
    submissionDate: 'Sep 17, 2024',
    decidedAt: 'Sep 17, 09:12',
  },
  {
    id: 'req-2024-6901',
    reqNumber: 'REQ-2024-6901',
    type: 'casual',
    title: 'Casual Leave',
    days: 1,
    startDate: '2024-10-11',
    endDate: '2024-10-11',
    dateRangeDisplay: 'Oct 11, 2024',
    reason: 'Car maintenance & personal municipal property documentation work.',
    status: 'approved',
    approverName: 'Elena Rostova',
    approverRole: 'Engineering Director',
    submissionDate: 'Oct 09, 2024',
    decidedAt: 'Oct 09, 14:20',
  },
  {
    id: 'req-2024-5502',
    reqNumber: 'REQ-2024-5502',
    type: 'comp',
    title: 'Compensatory Off',
    days: 1,
    startDate: '2024-08-18',
    endDate: '2024-08-18',
    dateRangeDisplay: 'Aug 18, 2024',
    reason: 'Weekend release deployment support.',
    status: 'rejected',
    approverName: 'Zayd Malik',
    approverRole: 'VP, People Ops',
    rejectionReason: 'Overlap with critical sprint freeze phase. Recommended to defer compensatory rest to September.',
    submissionDate: 'Aug 14, 2024',
    decidedAt: 'Aug 14, 2024',
  },
];

const initialPayslips: PayslipRecord[] = [
  {
    id: 'pay-2024-09',
    month: 'September 2024',
    disbursedDate: 'Sep 30, 2024',
    netPay: 8450.0,
    grossPay: 9050.0,
    currency: 'USD',
    bankName: 'Standard Chartered Bank',
    bankAccountMasked: '•••• 4821',
    status: 'Disbursed',
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
  },
  {
    id: 'pay-2024-08',
    month: 'August 2024',
    disbursedDate: 'Aug 30, 2024',
    netPay: 8450.0,
    grossPay: 9050.0,
    currency: 'USD',
    bankName: 'Standard Chartered Bank',
    bankAccountMasked: '•••• 4821',
    status: 'Disbursed',
    earnings: {
      basic: 6000.0,
      housing: 1800.0,
      transport: 750.0,
      bonus: 500.0,
      bonusLabel: 'Performance Bonus (Q2 True-up)',
    },
    deductions: {
      taxWht: 420.0,
      providentFund: 150.0,
      insurance: 30.0,
    },
  },
  {
    id: 'pay-2024-07',
    month: 'July 2024',
    disbursedDate: 'Jul 31, 2024',
    netPay: 8450.0,
    grossPay: 9050.0,
    currency: 'USD',
    bankName: 'Standard Chartered Bank',
    bankAccountMasked: '•••• 4821',
    status: 'Disbursed',
    earnings: {
      basic: 6000.0,
      housing: 1800.0,
      transport: 750.0,
      bonus: 500.0,
      bonusLabel: 'Quarterly Bonus',
    },
    deductions: {
      taxWht: 420.0,
      providentFund: 150.0,
      insurance: 30.0,
    },
  },
  {
    id: 'pay-2024-06',
    month: 'June 2024',
    disbursedDate: 'Jun 28, 2024',
    netPay: 8200.0,
    grossPay: 8800.0,
    currency: 'USD',
    bankName: 'Standard Chartered Bank',
    bankAccountMasked: '•••• 4821',
    status: 'Disbursed',
    earnings: {
      basic: 6000.0,
      housing: 1800.0,
      transport: 750.0,
      bonus: 250.0,
      bonusLabel: 'Spot Award',
    },
    deductions: {
      taxWht: 420.0,
      providentFund: 150.0,
      insurance: 30.0,
    },
  },
];

const initialApprovals: ManagerApprovalItem[] = [
  {
    id: 'appr-1',
    employeeName: 'Elena Rostova',
    employeeRole: 'Lead UX Research Partner',
    requestType: 'PTO',
    period: 'Nov 12 - Nov 15 (4 Days)',
    days: 4,
    reason: 'Attending Config EU Design Symposium, coverage coordinated with Imran.',
    status: 'pending',
    requestedAt: '2 hours ago',
  },
  {
    id: 'appr-2',
    employeeName: 'Marcus Vance',
    employeeRole: 'Design Systems Architect',
    requestType: 'Remote',
    period: 'Dec 01 - Dec 10',
    days: 8,
    reason: 'Off-site design sprint working from Toronto satellite office.',
    status: 'pending',
    requestedAt: '1 day ago',
  },
];

const initialRegularizations: RegularizationItem[] = [
  {
    id: 'REG-8821',
    impactDate: 'Oct 18, 2024',
    originalTime: '09:45 AM',
    requestedTime: '09:00 AM',
    reason: 'Client site network outage prevented geo-tagging beacon check-in.',
    status: 'pending',
    submittedAt: 'Oct 18, 2024',
  },
  {
    id: 'REG-8840',
    impactDate: 'Oct 22, 2024',
    originalTime: 'Missing Out',
    requestedTime: '18:24 PM',
    reason: 'Biometric turnstile power cycle at East Wing Gate 2.',
    status: 'approved',
    submittedAt: 'Oct 22, 2024',
  },
];

const initialUsers: UserAccount[] = [
  {
    id: 'user-evelyn',
    email: 'evelyn.vance@omniahealth.org',
    passwordHash: 'EnterpriseSecret2025#',
    firstName: 'Evelyn',
    lastName: 'Chen-Vance',
    name: 'Evelyn Chen-Vance',
    role: 'VP of Global People Ops',
    companyName: 'Omnia Health Group',
    companySize: '1000+',
    country: 'US',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    authProvider: 'local',
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'user-tariq',
    email: 'tariq.mansoor@pulsehr.internal',
    passwordHash: 'PulseHR2025!',
    firstName: 'Tariq',
    lastName: 'Al-Mansoor',
    name: 'Tariq Al-Mansoor',
    role: 'Senior Lead Product Designer',
    companyName: 'PulseHR Systems Inc.',
    companySize: '250-1000',
    country: 'US',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    authProvider: 'local',
    createdAt: '2024-03-01T08:00:00.000Z',
  },
];

const initialWorkspaces: Workspace[] = [
  {
    id: 'ws-omnia',
    companyName: 'Omnia Health Group',
    companySize: '1000+',
    country: 'US',
    adminEmail: 'evelyn.vance@omniahealth.org',
    plan: 'enterprise-trial',
    createdAt: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'ws-pulsehr',
    companyName: 'PulseHR Systems Inc.',
    companySize: '250-1000',
    country: 'US',
    adminEmail: 'tariq.mansoor@pulsehr.internal',
    plan: 'enterprise-trial',
    createdAt: '2024-03-01T08:00:00.000Z',
  },
];

// Single Database container exposing MongoDB collections
export const db = {
  users: new MongoCollection<UserAccount>('users', initialUsers),
  workspaces: new MongoCollection<Workspace>('workspaces', initialWorkspaces),
  employees: new MongoCollection<Employee>('employees', initialEmployees),
  shiftLogs: new MongoCollection<ShiftLog>('shift_logs', initialShiftLogs),
  leaveQuotas: new MongoCollection<LeaveQuota & { id: string }>(
    'leave_quotas',
    initialLeaveQuotas.map((q) => ({ ...q, id: q.type }))
  ),
  leaveRequests: new MongoCollection<LeaveRequest>('leave_requests', initialLeaveRequests),
  payslips: new MongoCollection<PayslipRecord>('payslips', initialPayslips),
  approvals: new MongoCollection<ManagerApprovalItem>('approvals', initialApprovals),
  regularizations: new MongoCollection<RegularizationItem>('regularizations', initialRegularizations),
  activeShiftState: { ...initialActiveShift },
};
