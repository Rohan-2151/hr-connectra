import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EmployeeTable } from "@/components/dashboard/employee-table";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";
import { useLocation } from "wouter";
import { AddEmployeeDialog } from "@/components/dialogs/add-employee-dialog";
import { useState } from "react";

export default function AdminEmployeesPage() {
  const [location] = useLocation();
  const queryParams = new URLSearchParams(window.location.search);
  const filter = queryParams.get("filter");
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);

  const getFilterTitle = () => {
    switch(filter) {
      case "present": return "Employees Present Today";
      case "absent": return "Absent Employees";
      case "late": return "Late Comers";
      default: return "All Employees";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Employees</h2>
          <p className="text-muted-foreground">
            {getFilterTitle()}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => alert("Downloading report...")}>
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button onClick={() => setIsAddEmployeeOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <AddEmployeeDialog 
        open={isAddEmployeeOpen} 
        onOpenChange={setIsAddEmployeeOpen} 
      />

      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Employee Directory</CardTitle>
            <CardDescription>
              Manage employee access and details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EmployeeTable filter={filter} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
