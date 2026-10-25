export type TabType = 'home' | 'attendance' | 'leaves' | 'payroll' | 'directory' | 'settings' | 'signup' | 'login';

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
