import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { PunchCard } from "@/components/dashboard/punch-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { useAuth } from "@/hooks/use-auth";

export default function EmployeeDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight font-heading">
          Welcome back, {user?.name.split(' ')[0]}!
        </h2>
        <p className="text-muted-foreground">
          Here's your daily summary and attendance status.
        </p>
      </div>

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
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Days Present
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Hours / Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8.2h</div>
                <p className="text-xs text-muted-foreground">+0.5h vs last month</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
