import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function AdminAttendancePage() {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-heading">Attendance Reports</h2>
          <p className="text-muted-foreground">
            Detailed view of employee attendance and working hours.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => alert("Downloading PDF report...")}>
             <Download className="mr-2 h-4 w-4" />
             Export PDF
          </Button>
          <Button variant="outline" onClick={() => alert("Downloading Excel report...")}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <Card>
            <CardHeader>
              <CardTitle>Weekly Overview</CardTitle>
              <CardDescription>
                Working hours analysis across all departments.
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <AttendanceChart />
            </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Logs</CardTitle>
            <CardDescription>
              Real-time punch in/out activity.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0" key={i}>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Employee Name {i}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Punched In at 09:0{i} AM
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-sm font-medium text-green-600">Present</span>
                        <span className="text-xs text-muted-foreground">San Francisco Office</span>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
