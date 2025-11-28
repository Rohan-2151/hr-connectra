export interface Employee {
  id: string;
  name: string;
  email: string;
  role: "admin" | "employee";
  mobile: string;
  aadhar: string;
  pan: string;
  bankAccount: string;
  ifsc: string;
  address: string;
  joiningDate: string;
  status: "active" | "inactive";
  avatar: string;
  baseSalary: number;
  salaryFormula?: string;
  otFormula?: string;
  password?: string;
  permissions?: "read_only" | "read_write";
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  totalHours: number;
  status: "present" | "absent" | "half-day" | "week-off" | "holiday";
  location: { lat: number; lng: number };
  isEdited?: boolean;
  adminRemark?: string;
  otHours?: number;
}

export interface AdvanceRecord {
  id: string;
  employeeId: string;
  date: string;
  amount: number;
  remark: string;
  type: "salary_advance" | "loan" | "other";
}

export interface PayrollRecord {
  employeeId: string;
  month: string;
  presentDays: number;
  absentDays: number;
  weekOffs: number;
  holidays: number;
  totalWorkingHours: number;
  otHours: number;
  otEarnings: number;
  deductions: number;
  netSalary: number;
  status: "processed" | "pending";
}

export interface CompanyRules {
  shiftStart: string;
  shiftEnd: string;
  fullDayHours: number;
  halfDayHours: number;
  otStartAfter: number;
  otRateMultiplier: number;
  lateGracePeriodMinutes: number;
  weekOffs: number[];
  isWeekOffPaid: boolean;
  isHolidayPaid: boolean;
  officeLat: number;
  officeLng: number;
  geofenceRadius: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: "attendance_edited" | "employee_modified" | "admin_added" | "advance_approved" | "profile_updated";
  title: string;
  message: string;
  actionUser: string;
  timestamp: string;
  read: boolean;
  relatedId?: string;
}

export const DEFAULT_RULES: CompanyRules = {
  shiftStart: "09:00",
  shiftEnd: "18:00",
  fullDayHours: 9,
  halfDayHours: 4.5,
  otStartAfter: 9,
  otRateMultiplier: 1.5,
  lateGracePeriodMinutes: 15,
  weekOffs: [0, 6],
  isWeekOffPaid: true,
  isHolidayPaid: true,
  officeLat: 37.7749,
  officeLng: -122.4194,
  geofenceRadius: 100
};

export const MOCK_EMPLOYEES: Employee[] = [
  {
    id: "EMP001",
    name: "Admin User",
    email: "admin@company.com",
    role: "admin",
    mobile: "9876543210",
    aadhar: "1234-5678-9012",
    pan: "ABCDE1234F",
    bankAccount: "1234567890",
    ifsc: "HDFC0001234",
    address: "123 Admin St, Tech City",
    joiningDate: "2023-01-01",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=admin",
    baseSalary: 80000,
    salaryFormula: "Standard (Monthly / 30)",
    otFormula: "1.5x Hourly Rate",
    password: "password123",
    permissions: "read_write"
  },
  {
    id: "EMP002",
    name: "John Doe",
    email: "john@company.com",
    role: "employee",
    mobile: "9876543211",
    aadhar: "9876-5432-1098",
    pan: "VWXYZ9876G",
    bankAccount: "0987654321",
    ifsc: "SBIN0005678",
    address: "456 Employee Lane, Suburbia",
    joiningDate: "2023-06-15",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=john",
    baseSalary: 50000,
    salaryFormula: "Standard (Monthly / 30)",
    otFormula: "1.5x Hourly Rate",
    password: "password123"
  },
  {
    id: "EMP003",
    name: "Jane Smith",
    email: "jane@company.com",
    role: "employee",
    mobile: "9876543212",
    aadhar: "1122-3344-5566",
    pan: "PQRST5678H",
    bankAccount: "1122334455",
    ifsc: "ICIC0009012",
    address: "789 Developer Rd, Codington",
    joiningDate: "2024-02-01",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=jane",
    baseSalary: 60000,
    salaryFormula: "Standard (Monthly / 30)",
    otFormula: "2.0x Hourly Rate",
    password: "password123"
  },
  {
    id: "EMP004",
    name: "Sarah Manager",
    email: "sarah@company.com",
    role: "admin",
    mobile: "9876543213",
    aadhar: "5555-6666-7777",
    pan: "LMNOP1234I",
    bankAccount: "5555666677",
    ifsc: "AXIS0001234",
    address: "321 Manager Ave, Tech City",
    joiningDate: "2023-03-15",
    status: "active",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    baseSalary: 85000,
    salaryFormula: "Standard (Monthly / 30)",
    otFormula: "1.5x Hourly Rate",
    password: "password123",
    permissions: "read_only"
  }
];

export const OFFICE_LOCATION = {
  lat: DEFAULT_RULES.officeLat,
  lng: DEFAULT_RULES.officeLng,
  radius: DEFAULT_RULES.geofenceRadius
};

export const MOCK_PAYROLL: PayrollRecord[] = [
  {
    employeeId: "EMP002",
    month: "2023-10",
    presentDays: 22,
    absentDays: 1,
    weekOffs: 8,
    holidays: 0,
    totalWorkingHours: 180,
    otHours: 5,
    otEarnings: 2000,
    deductions: 500,
    netSalary: 51500,
    status: "processed"
  },
  {
    employeeId: "EMP003",
    month: "2023-10",
    presentDays: 20,
    absentDays: 3,
    weekOffs: 8,
    holidays: 0,
    totalWorkingHours: 160,
    otHours: 0,
    otEarnings: 0,
    deductions: 1500,
    netSalary: 58500,
    status: "processed"
  }
];

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "ATT001",
    employeeId: "EMP002",
    date: new Date().toISOString().split('T')[0],
    punchIn: "09:00",
    punchOut: null,
    totalHours: 0,
    status: "present",
    location: { lat: 37.7749, lng: -122.4194 },
    isEdited: false
  },
  {
    id: "ATT002",
    employeeId: "EMP003",
    date: new Date().toISOString().split('T')[0],
    punchIn: "09:15",
    punchOut: null,
    totalHours: 0,
    status: "present",
    location: { lat: 37.7749, lng: -122.4194 },
    isEdited: true,
    adminRemark: "System error correction"
  }
];

export const MOCK_ADVANCES: AdvanceRecord[] = [
  {
    id: "ADV001",
    employeeId: "EMP002",
    date: "2025-11-05",
    amount: 5000,
    remark: "Medical Emergency",
    type: "salary_advance"
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "NOT001",
    userId: "EMP002",
    type: "attendance_edited",
    title: "Attendance Updated",
    message: "Your attendance for Nov 15, 2025 has been modified by Admin User",
    actionUser: "Admin User",
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    read: false
  },
  {
    id: "NOT002",
    userId: "EMP001",
    type: "employee_modified",
    title: "Employee Profile Changed",
    message: "John Doe's salary has been updated by Admin User",
    actionUser: "Admin User",
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    read: false,
    relatedId: "EMP002"
  },
  {
    id: "NOT003",
    userId: "EMP003",
    type: "advance_approved",
    title: "Advance Approved",
    message: "Your salary advance of ₹5,000 has been approved",
    actionUser: "Admin User",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    read: true
  },
  {
    id: "NOT004",
    userId: "EMP001",
    type: "admin_added",
    title: "New Admin Added",
    message: "Sarah Manager has been added as Admin with Read-Only permissions",
    actionUser: "Admin User",
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    read: true,
    relatedId: "EMP004"
  }
];
