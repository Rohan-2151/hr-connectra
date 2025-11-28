import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Edit, Trash2, KeyRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MOCK_EMPLOYEES, Employee } from "@/lib/mock-data";
import { ChangePasswordDialog } from "@/components/dialogs/change-password-dialog";
import { EditEmployeeDialog } from "@/components/dialogs/edit-employee-dialog";
import { useState } from "react";

export function EmployeeTable({ filter }: { filter?: string | null }) {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handlePasswordChange = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsPasswordDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditDialogOpen(true);
  };

  // Simple mock filter logic
  const filteredEmployees = MOCK_EMPLOYEES.filter(emp => {
    if (!filter || filter === 'all') return true;
    // In a real app, this would check attendance status for today
    // For mock purposes, we'll randomly filter or just show all
    // Let's mock some states based on the filter request
    if (filter === 'present') return emp.id !== 'EMP003'; // Mock absent
    if (filter === 'absent') return emp.id === 'EMP003'; // Mock present
    if (filter === 'late') return emp.id === 'EMP002'; // Mock late
    return true;
  });

  return (
    <div className="rounded-md border">
      <ChangePasswordDialog 
        open={isPasswordDialogOpen} 
        onOpenChange={setIsPasswordDialogOpen}
        employeeName={selectedEmployee?.name}
      />

      <EditEmployeeDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        employee={selectedEmployee}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Employee</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Joining Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredEmployees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                No employees found for this filter.
              </TableCell>
            </TableRow>
          ) : (
            filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium leading-none">{employee.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{employee.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {employee.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      employee.status === 'active' 
                        ? "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-red-100 text-red-700 hover:bg-red-100"
                    }
                  >
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell>{employee.joiningDate}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditEmployee(employee)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Employee
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePasswordChange(employee)}>
                        <KeyRound className="mr-2 h-4 w-4" /> Reset Password
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
