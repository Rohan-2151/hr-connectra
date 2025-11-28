import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MOCK_EMPLOYEES, MOCK_ADVANCES, AdvanceRecord } from "@/lib/mock-data";
import { useState } from "react";
import { Plus, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export default function AdminAdvancesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const { toast } = useToast();
  const [newAdvance, setNewAdvance] = useState<Partial<AdvanceRecord>>({
    date: new Date().toISOString().split('T')[0],
    type: "salary_advance"
  });

  const handleSaveAdvance = () => {
    // Mock save
    toast({
      title: "Advance Added",
      description: "Advance record has been saved successfully.",
    });
    setIsAddDialogOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Advance Management</h2>
          <p className="text-muted-foreground">
            Track and manage employee salary advances and loans.
          </p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Advance
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advance History</CardTitle>
          <CardDescription>List of all advances given to employees.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ADVANCES.map((adv) => {
                const emp = MOCK_EMPLOYEES.find(e => e.id === adv.employeeId);
                return (
                  <TableRow key={adv.id}>
                    <TableCell>{format(new Date(adv.date), 'PPP')}</TableCell>
                    <TableCell className="font-medium">{emp?.name || adv.employeeId}</TableCell>
                    <TableCell className="capitalize">{adv.type.replace('_', ' ')}</TableCell>
                    <TableCell>{adv.remark}</TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      ₹{adv.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Advance</DialogTitle>
            <DialogDescription>Record a new advance payment to an employee.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Employee</Label>
              <Select onValueChange={(val) => setNewAdvance({...newAdvance, employeeId: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Employee" />
                </SelectTrigger>
                <SelectContent>
                  {MOCK_EMPLOYEES.filter(e => e.role !== 'admin').map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input 
                type="date" 
                value={newAdvance.date}
                onChange={(e) => setNewAdvance({...newAdvance, date: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Amount (₹)</Label>
              <Input 
                type="number" 
                placeholder="5000"
                onChange={(e) => setNewAdvance({...newAdvance, amount: Number(e.target.value)})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Type</Label>
              <Select 
                defaultValue="salary_advance" 
                onValueChange={(val: any) => setNewAdvance({...newAdvance, type: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salary_advance">Salary Advance</SelectItem>
                  <SelectItem value="loan">Loan</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Remark</Label>
              <Textarea 
                placeholder="Reason for advance..."
                onChange={(e) => setNewAdvance({...newAdvance, remark: e.target.value})}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveAdvance}>Save Advance</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
