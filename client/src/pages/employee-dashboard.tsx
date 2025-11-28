import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { MOCK_ADVANCES, MOCK_PAYROLL } from "@/lib/mock-data";
import { PunchCard } from "@/components/dashboard/punch-card";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isToday } from "date-fns";
import { DollarSign, Calendar as CalendarIcon, Download, Clock, TrendingUp } from "lucide-react";
import { useState } from "react";

// Mock attendance generator (same as admin view but read-only)
const generateDailyAttendance = (month: Date) => {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });

  return days.map(day => {
    const dayOfWeek = getDay(day);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let status: "present" | "absent" | "holiday" | "week-off" = isWeekend ? "week-off" : "present";
    let otHours = 0;
    
    if (!isWeekend && Math.random() > 0.8) status = "absent";
    if (status === "present" && Math.random() > 0.7) otHours = Math.floor(Math.random() * 4) + 1;

    return {
      date: day,
      status,
      otHours,
      checkIn: status === "present" ? "09:00 AM" : "-",
      checkOut: status === "present" ? (otHours > 0 ? `${18 + Math.floor(otHours)}:00` : "18:00") : "-",
    };
  });
};

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonthStr, setSelectedMonthStr] = useState(new Date().getMonth().toString());

  if (!user) return null;

  const handleMonthChange = (val: string) => {
    setSelectedMonthStr(val);
    setCurrentMonth(new Date(parseInt(selectedYear), parseInt(val)));
  };

  const handleYearChange = (val: string) => {
    setSelectedYear(val);
    setCurrentMonth(new Date(parseInt(val), parseInt(selectedMonthStr)));
  };

  const days = generateDailyAttendance(new Date(parseInt(selectedYear), parseInt(selectedMonthStr)));

  // Salary Calculations
  const presentDays = days.filter(d => d.status === "present").length;
  const absentDays = days.filter(d => d.status === "absent").length;
  const totalOtHours = days.reduce((acc, curr) => acc + curr.otHours, 0);
  
  const basicSalary = user.baseSalary;
  const dailyRate = basicSalary / 30;
  const hourlyRate = dailyRate / 9;
  const otRate = hourlyRate * 1.5;
  const otEarnings = Math.round(totalOtHours * otRate);
  const reimbursements = 2500;
  
  // Advances/Deductions
  const userAdvances = MOCK_ADVANCES.filter(adv => adv.employeeId === user.id);
  const totalAdvances = userAdvances.reduce((sum, adv) => sum + adv.amount, 0);
  
  const ptDeduction = 200;
  const lopDeduction = Math.round(absentDays * dailyRate);
  const totalDeductions = ptDeduction + totalAdvances + lopDeduction;
  const netSalary = basicSalary + otEarnings + reimbursements - totalDeductions;

  // Payroll history (mock - could come from API)
  const monthPayroll = {
    employeeId: user.id,
    month: `${selectedYear}-${String(parseInt(selectedMonthStr) + 1).padStart(2, '0')}`,
    presentDays,
    absentDays,
    weekOffs: days.filter(d => d.status === "week-off").length,
    holidays: days.filter(d => d.status === "holiday").length,
    totalWorkingHours: presentDays * 9,
    otHours: totalOtHours,
    otEarnings,
    deductions: totalDeductions,
    netSalary,
    status: "pending" as const
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight font-heading">
          Welcome, {user.name.split(' ')[0]}!
        </h2>
        <p className="text-muted-foreground">
          View your attendance, salary breakdown, payroll history, and advances.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="salary">Salary & Payroll</TabsTrigger>
          <TabsTrigger value="advances">Advances</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <PunchCard />
            </div>

            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Your Weekly Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <AttendanceChart />
                </CardContent>
              </Card>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Days Present
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{presentDays}</div>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" /> OT Hours
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{totalOtHours}h</div>
                    <p className="text-xs text-muted-foreground">Overtime this month</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">This Month Earnings</p>
                    <p className="text-2xl font-bold text-green-700">₹{(basicSalary + otEarnings + reimbursements).toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-green-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Deductions</p>
                    <p className="text-2xl font-bold text-red-700">₹{totalDeductions.toLocaleString()}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-red-600 opacity-50" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Net Salary</p>
                    <p className="text-2xl font-bold text-blue-700">₹{netSalary.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600 opacity-50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Monthly Attendance Calendar</CardTitle>
                  <CardDescription>View your attendance status for each day</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedMonthStr} onValueChange={handleMonthChange}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }).map((_, i) => (
                        <SelectItem key={i} value={i.toString()}>
                          {format(new Date(2025, i), 'MMMM')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedYear} onValueChange={handleYearChange}>
                    <SelectTrigger className="w-[100px]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2025">2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Present</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <span>Absent</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                  <span>Week Off</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <span>Holiday</span>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-sm font-medium text-muted-foreground mb-2">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, i) => (
                  <div key={`pad-${i}`} className="h-20 border rounded-md bg-muted/20"></div>
                ))}
                
                {days.map((day, i) => (
                  <div 
                    key={i} 
                    className={`h-20 border rounded-md p-1 flex flex-col justify-between ${
                      isToday(day.date) ? "ring-2 ring-primary" : ""
                    } ${
                      day.status === 'absent' ? 'bg-red-50 dark:bg-red-950/20 border-red-200' : 
                      day.status === 'week-off' ? 'bg-slate-50 dark:bg-slate-900/50' : 
                      day.status === 'holiday' ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200' :
                      'bg-white dark:bg-card'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-medium ${
                        day.status === 'absent' ? 'text-red-600' : ''
                      }`}>
                        {format(day.date, 'd')}
                      </span>
                      {day.otHours > 0 && (
                        <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-blue-100 text-blue-700">
                          +{day.otHours}h
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-[10px] space-y-0.5">
                      {day.status === 'present' ? (
                        <>
                          <div className="text-green-600 font-medium">P</div>
                          <div className="text-muted-foreground text-[9px]">{day.checkIn} - {day.checkOut}</div>
                        </>
                      ) : day.status === 'absent' ? (
                        <div className="text-red-500 font-bold text-center">A</div>
                      ) : day.status === 'week-off' ? (
                        <div className="text-muted-foreground text-center">WO</div>
                      ) : (
                        <div className="text-amber-600 font-bold text-center">H</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Present Days</p>
                    <p className="text-xl font-bold text-green-600">{presentDays}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Absent Days</p>
                    <p className="text-xl font-bold text-red-600">{absentDays}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Week Offs</p>
                    <p className="text-xl font-bold">{days.filter(d => d.status === "week-off").length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-4">
                    <p className="text-xs text-muted-foreground">Total OT Hours</p>
                    <p className="text-xl font-bold text-blue-600">{totalOtHours}h</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Salary & Payroll Tab */}
        <TabsContent value="salary" className="space-y-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Net Salary (This Month)</p>
                  <h3 className="text-4xl font-bold text-primary mt-2">₹{netSalary.toLocaleString()}</h3>
                  <p className="text-xs text-muted-foreground mt-1">For {format(currentMonth, 'MMMM yyyy')}</p>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Download Slip
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Earnings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-green-50/50 dark:bg-green-950/20 rounded">
                  <span className="text-sm">Basic Salary</span>
                  <span className="font-medium">₹{basicSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded">
                  <div className="flex flex-col">
                    <span className="text-sm">Overtime Earnings</span>
                    <span className="text-[10px] text-muted-foreground">{totalOtHours} hrs @ 1.5x</span>
                  </div>
                  <span className="font-medium text-green-600">₹{otEarnings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50/50 dark:bg-purple-950/20 rounded">
                  <span className="text-sm">Reimbursements</span>
                  <span className="font-medium text-green-600">₹{reimbursements.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Earnings</span>
                    <span className="text-green-600">₹{(basicSalary + otEarnings + reimbursements).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Deductions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-red-600" />
                  Deductions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-50/50 dark:bg-red-950/20 rounded">
                  <span className="text-sm">Professional Tax (PT)</span>
                  <span className="font-medium text-red-600">₹{ptDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50/50 dark:bg-orange-950/20 rounded">
                  <div className="flex flex-col">
                    <span className="text-sm">Loss of Pay (LOP)</span>
                    <span className="text-[10px] text-muted-foreground">{absentDays} days absent</span>
                  </div>
                  <span className="font-medium text-red-600">₹{lopDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50/50 dark:bg-amber-950/20 rounded">
                  <span className="text-sm">Salary Advance (Deducted)</span>
                  <span className="font-medium text-red-600">₹{totalAdvances.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total Deductions</span>
                    <span className="text-red-600">₹{totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payroll Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Payroll Summary</CardTitle>
              <CardDescription>Detailed breakdown of this month's payroll</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1 border p-3 rounded">
                  <p className="text-xs text-muted-foreground">Present Days</p>
                  <p className="text-lg font-bold">{monthPayroll.presentDays}</p>
                </div>
                <div className="space-y-1 border p-3 rounded">
                  <p className="text-xs text-muted-foreground">Absent Days</p>
                  <p className="text-lg font-bold text-red-600">{monthPayroll.absentDays}</p>
                </div>
                <div className="space-y-1 border p-3 rounded">
                  <p className="text-xs text-muted-foreground">Total Hours Worked</p>
                  <p className="text-lg font-bold">{monthPayroll.totalWorkingHours}h</p>
                </div>
                <div className="space-y-1 border p-3 rounded">
                  <p className="text-xs text-muted-foreground">OT Hours</p>
                  <p className="text-lg font-bold text-blue-600">{monthPayroll.otHours}h</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Advances Tab */}
        <TabsContent value="advances" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Your Advances & Loans</CardTitle>
                  <CardDescription>Track all salary advances and loans taken</CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Advances Taken</p>
                  <p className="text-2xl font-bold text-red-600">₹{totalAdvances.toLocaleString()}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {userAdvances.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Remark</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userAdvances.map((adv) => (
                      <TableRow key={adv.id}>
                        <TableCell className="font-medium">{format(new Date(adv.date), 'PPP')}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {adv.type.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>{adv.remark}</TableCell>
                        <TableCell className="text-right font-bold text-red-600">
                          ₹{adv.amount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No advances or loans found.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Advance Deduction Summary */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200">
            <CardHeader>
              <CardTitle className="text-base">Advance Deduction Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Total Advances This Month:</span> ₹{totalAdvances.toLocaleString()}
              </p>
              <p>
                <span className="font-medium">Monthly Deduction:</span> ₹{totalAdvances.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">
                All advances are deducted from your current month's salary. Contact HR if you have questions.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
