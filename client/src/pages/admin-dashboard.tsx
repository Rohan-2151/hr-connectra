import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { EmployeeTable } from "@/components/dashboard/employee-table";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Plus } from "lucide-react";

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your team's performance and attendance.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <StatsCards />
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Attendance Overview</CardTitle>
              <CardDescription>
                Weekly working hours analysis per department
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <AttendanceChart />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest punches and system logs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div className="flex items-center" key={i}>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Employee Punched In
                      </p>
                      <p className="text-sm text-muted-foreground">
                        John Doe - 09:0{i} AM
                      </p>
                    </div>
                    <div className="ml-auto font-medium text-sm text-green-600">
                      On Time
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-tight">Employee Directory</h3>
          <EmployeeTable />
        </div>
      </div>
    </DashboardLayout>
  );
}
