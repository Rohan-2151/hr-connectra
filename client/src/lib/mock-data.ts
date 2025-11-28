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
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  punchIn: string | null;
  punchOut: string | null;
  totalHours: number;
  status: "present" | "absent" | "half-day";
  location: { lat: number; lng: number };
}

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
    avatar: "https://i.pravatar.cc/150?u=admin"
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
    avatar: "https://i.pravatar.cc/150?u=john"
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
    avatar: "https://i.pravatar.cc/150?u=jane"
  }
];

export const OFFICE_LOCATION = {
  lat: 37.7749, // Example: San Francisco
  lng: -122.4194,
  radius: 100 // meters
};

export const MOCK_ATTENDANCE: AttendanceRecord[] = [
  {
    id: "ATT001",
    employeeId: "EMP002",
    date: new Date().toISOString().split('T')[0],
    punchIn: "09:00",
    punchOut: null,
    totalHours: 0,
    status: "present",
    location: { lat: 37.7749, lng: -122.4194 }
  },
  {
    id: "ATT002",
    employeeId: "EMP003",
    date: new Date().toISOString().split('T')[0],
    punchIn: "09:15",
    punchOut: null,
    totalHours: 0,
    status: "present",
    location: { lat: 37.7749, lng: -122.4194 }
  }
];
