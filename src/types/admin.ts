export type TeacherStatus = 'active' | 'inactive';

export interface TeacherProfile {
  id: string;
  fullName: string;
  subject: string;
  experience: number;
  phone: string;
  monthlySalary: number;
  status: TeacherStatus;
  photoUrl?: string;
  bio?: string;
  groups?: Array<{
    id: string;
    name: string;
    schedule: string;
  }>;
}

export type TeacherPayload = Omit<TeacherProfile, 'id' | 'groups'>;

export type PaymentStatus = 'paid' | 'unpaid';

export interface PaymentHistoryEntry {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  status: PaymentStatus;
  method: 'cash' | 'card' | 'transfer';
  note?: string;
}

export interface StudentProfile {
  id: string;
  fullName: string;
  groupId: string | null;
  groupName?: string;
  groupSchedule?: string;
  teacherName?: string;
  parentName: string;
  parentContact: string;
  monthlyPayment: number;
  paymentStatus: PaymentStatus;
  photoUrl?: string;
  notes?: string;
  history: PaymentHistoryEntry[];
}

export type StudentPayload = Omit<StudentProfile, 'id' | 'history' | 'groupName' | 'groupSchedule' | 'teacherName'> & {
  history?: PaymentHistoryEntry[];
};

export type GroupStatus = 'active' | 'closed';

export interface GroupProfile {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  schedule: string;
  room: string;
  maxStudents: number;
  currentStudents: number;
  status: GroupStatus;
  attendanceRate: number;
  monthlyRevenue: number;
}

export type GroupPayload = Omit<GroupProfile, 'id' | 'teacherName' | 'currentStudents'> & {
  currentStudents?: number;
};

export interface RevenueRecord {
  id: string;
  source: string;
  amount: number;
  month: string; // YYYY-MM
  note?: string;
}

export interface ExpenseRecord {
  id: string;
  category: string;
  amount: number;
  month: string;
  description?: string;
  type: 'fixed' | 'variable';
}

export interface DashboardSnapshot {
  teacherCount: number;
  studentCount: number;
  groupCount: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  netProfit: number;
  profitMargin: number;
  paidStudents: number;
  unpaidStudents: number;
  revenueSeries: { month: string; revenue: number }[];
  expenseSeries: { month: string; expense: number }[];
  profitSeries: { month: string; profit: number }[];
  studentStatusSeries: { status: PaymentStatus; value: number }[];
  studentsPerGroup: { name: string; value: number }[];
  teachersPerGroup: { teacher: string; value: number }[];
  capacityUsage: { name: string; value: number }[];
  topGroups: {
    byStudents: { id: string; name: string; value: number }[];
    byRevenue: { id: string; name: string; value: number }[];
    byAttendance: { id: string; name: string; value: number }[];
  };
}

export interface FinanceBreakdown {
  teacherSalaries: number;
  operatingExpenses: number;
  totalExpenses: number;
  additionalExpenses: ExpenseRecord[];
}


