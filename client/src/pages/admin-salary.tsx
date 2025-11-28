import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MOCK_EMPLOYEES, MOCK_PAYROLL, PayrollRecord, DEFAULT_RULES } from "@/lib/mock-data";
import { Download, Calculator, Edit2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export default function AdminSalaryPage() {
  const [editEmployee, setEditEmployee] = useState<string | null>(null);
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const { toast } = useToast();

  // Merge employee data with payroll data
  const payrollData = MOCK_EMPLOYEES
    .filter(e => e.role !== 'admin')
    .map(emp => {
      const record = MOCK_PAYROLL.find(p => p.employeeId === emp.id);
      return {
        ...emp,
        payroll: record || {
          presentDays: 0,
          absentDays: 0,
          weekOffs: 0,
          holidays: 0,
          otHours: 0,
          otEarnings: 0,
          deductions: 0,
          netSalary: emp.baseSalary, // Default if no record
          status: "pending"
        }
      };
    });

  const handleEditSalary = (empId: string, currentSalary: number) => {
    setEditEmployee(empId);
    setBaseSalary(currentSalary);
  };

  const saveSalary = () => {
    // Mock save
    toast({
      title: "Salary Updated",
      description: "Base salary has been updated successfully."
    });
    setEditEmployee(null);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Payroll Management</h2>
          <p className="text-muted-foreground">
            Manage employee salaries, overtime, and deductions.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Payroll
          </Button>
          <Button>
            <Calculator className="mr-2 h-4 w-4" />
            Process Payroll
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Salary Sheet - {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</CardTitle>
          <CardDescription>
            Calculated based on {DEFAULT_RULES.otRateMultiplier}x OT rate and attendance records.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Employee</TableHead>
                <TableHead>Base Salary</TableHead>
                <TableHead>Attendance (P/A/W)</TableHead>
                <TableHead>OT Hrs</TableHead>
                <TableHead>OT Earnings</TableHead>
                <TableHead>Deductions</TableHead>
                <TableHead className="text-right">Net Salary</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payrollData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={item.avatar} />
                        <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium leading-none">{item.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.role}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{formatCurrency(item.baseSalary)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1 text-xs">
                      <span className="text-green-600 font-bold bg-green-100 px-1.5 py-0.5 rounded">{item.payroll.presentDays}</span>
                      <span className="text-red-600 font-bold bg-red-100 px-1.5 py-0.5 rounded">{item.payroll.absentDays}</span>
                      <span className="text-blue-600 font-bold bg-blue-100 px-1.5 py-0.5 rounded">{item.payroll.weekOffs}</span>
                    </div>
                  </TableCell>
                  <TableCell>{item.payroll.otHours}h</TableCell>
                  <TableCell className="text-green-600">+{formatCurrency(item.payroll.otEarnings)}</TableCell>
                  <TableCell className="text-red-600">-{formatCurrency(item.payroll.deductions)}</TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    {formatCurrency(item.payroll.netSalary)}
                  </TableCell>
                  <TableCell>
                    <Dialog open={editEmployee === item.id} onOpenChange={(open) => !open && setEditEmployee(null)}>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleEditSalary(item.id, item.baseSalary)}>
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Salary Structure</DialogTitle>
                          <DialogDescription>Update base salary for {item.name}</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="base" className="text-right">
                              Base Salary
                            </Label>
                            <Input 
                              id="base" 
                              type="number" 
                              className="col-span-3" 
                              value={baseSalary}
                              onChange={(e) => setBaseSalary(Number(e.target.value))}
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={saveSalary}>Save Changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
