import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Employee } from "@/lib/mock-data";
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, getDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Download, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EmployeeDetailsDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data generator for daily attendance
const generateDailyAttendance = (month: Date) => {
  const days = eachDayOfInterval({
    start: startOfMonth(month),
    end: endOfMonth(month),
  });

  return days.map(day => {
    const dayOfWeek = getDay(day);
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Randomly assign status
    let status: "present" | "absent" | "holiday" | "week-off" = isWeekend ? "week-off" : "present";
    let otHours = 0;
    
    if (!isWeekend && Math.random() > 0.8) status = "absent";
    if (status === "present" && Math.random() > 0.7) otHours = Math.floor(Math.random() * 4) + 1;

    return {
      date: day,
      status,
      otHours,
      checkIn: status === "present" ? "09:00 AM" : "-",
      checkOut: status === "present" ? (otHours > 0 ? `${18 + Math.floor(otHours)}:00` : "18:00") : "-"
    };
  });
};

export function EmployeeDetailsDialog({ employee, open, onOpenChange }: EmployeeDetailsDialogProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedMonthStr, setSelectedMonthStr] = useState(new Date().getMonth().toString());

  if (!employee) return null;

  const days = generateDailyAttendance(new Date(parseInt(selectedYear), parseInt(selectedMonthStr)));

  const handleMonthChange = (val: string) => {
    setSelectedMonthStr(val);
    setCurrentMonth(new Date(parseInt(selectedYear), parseInt(val)));
  };

  const handleYearChange = (val: string) => {
    setSelectedYear(val);
    setCurrentMonth(new Date(parseInt(val), parseInt(selectedMonthStr)));
  };

  // Salary Calculations (Mock)
  const presentDays = days.filter(d => d.status === "present").length;
  const totalOtHours = days.reduce((acc, curr) => acc + curr.otHours, 0);
  
  const basicSalary = employee.baseSalary;
  const dailyRate = basicSalary / 30;
  const hourlyRate = dailyRate / 9;
  const otRate = hourlyRate * 1.5; // Assuming 1.5x
  const otEarnings = Math.round(totalOtHours * otRate);
  const reimbursements = 2500; // Fixed mock
  
  const deductions = {
    advance: 0,
    pt: 200,
    other: 0
  };
  
  // Random deduction based on absent days (simple logic)
  const absentDays = days.filter(d => d.status === "absent").length;
  const lopDeduction = Math.round(absentDays * dailyRate);
  const totalDeductions = deductions.advance + deductions.pt + deductions.other + lopDeduction;
  
  const netSalary = basicSalary + otEarnings + reimbursements - totalDeductions;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Employee Details: {employee.name}</DialogTitle>
          <DialogDescription>
            {employee.role.toUpperCase()} • {employee.id} • {employee.email}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="attendance" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="attendance">Attendance Calendar</TabsTrigger>
            <TabsTrigger value="salary">Salary Breakdown</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
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
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>OT</span>
                  </div>
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
                {/* Padding for start of month */}
                {Array.from({ length: getDay(startOfMonth(currentMonth)) }).map((_, i) => (
                  <div key={`pad-${i}`} className="h-24 border rounded-md bg-muted/20"></div>
                ))}
                
                {days.map((day, i) => (
                  <div 
                    key={i} 
                    className={`h-24 border rounded-md p-1 flex flex-col justify-between relative ${
                      isToday(day.date) ? "ring-2 ring-primary" : ""
                    } ${
                      day.status === 'absent' ? 'bg-red-50 dark:bg-red-950/20 border-red-200' : 
                      day.status === 'week-off' ? 'bg-slate-50 dark:bg-slate-900/50' : 
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
                        <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-blue-100 text-blue-700 hover:bg-blue-100">
                          +{day.otHours}h OT
                        </Badge>
                      )}
                    </div>
                    
                    <div className="text-[10px] space-y-0.5 mt-1">
                      {day.status === 'present' ? (
                        <>
                          <div className="text-green-600 font-medium">P</div>
                          <div className="text-muted-foreground">{day.checkIn} - {day.checkOut}</div>
                        </>
                      ) : day.status === 'absent' ? (
                        <div className="text-red-500 font-bold text-center mt-2">A</div>
                      ) : (
                        <div className="text-muted-foreground text-center mt-2">WO</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="salary" className="flex-1 overflow-y-auto">
             <div className="grid gap-6">
               <Card className="bg-primary/5 border-primary/20">
                 <CardContent className="pt-6">
                   <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Estimated Net Salary (Till Date)</p>
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
                 <div className="space-y-4">
                   <h4 className="font-semibold flex items-center gap-2">
                     <DollarSign className="h-4 w-4 text-green-600" />
                     Earnings
                   </h4>
                   <div className="space-y-3 rounded-lg border p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Basic Salary</span>
                        <span className="font-medium">₹{basicSalary.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="text-sm">Overtime Earnings</span>
                          <span className="text-[10px] text-muted-foreground">{totalOtHours} hrs @ 1.5x</span>
                        </div>
                        <span className="font-medium text-green-600">+ ₹{otEarnings.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Reimbursements</span>
                        <span className="font-medium text-green-600">+ ₹{reimbursements.toLocaleString()}</span>
                      </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h4 className="font-semibold flex items-center gap-2">
                     <DollarSign className="h-4 w-4 text-red-600" />
                     Deductions
                   </h4>
                   <div className="space-y-3 rounded-lg border p-4 bg-red-50/10">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Professional Tax (PT)</span>
                        <span className="font-medium text-red-600">- ₹{deductions.pt.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Salary Advance</span>
                        <span className="font-medium text-red-600">- ₹{deductions.advance.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                         <div className="flex flex-col">
                            <span className="text-sm">Loss of Pay (LOP)</span>
                            <span className="text-[10px] text-muted-foreground">{absentDays} days absent</span>
                         </div>
                        <span className="font-medium text-red-600">- ₹{lopDeduction.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t">
                        <span className="text-sm font-semibold">Total Deductions</span>
                        <span className="font-bold text-red-600">- ₹{totalDeductions.toLocaleString()}</span>
                      </div>
                   </div>
                 </div>
               </div>
             </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
