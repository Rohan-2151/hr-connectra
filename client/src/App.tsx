import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminEmployeesPage from "@/pages/admin-employees";
import AdminAttendancePage from "@/pages/admin-attendance";
import AdminRulesPage from "@/pages/admin-rules";
import AdminSalaryPage from "@/pages/admin-salary";
import EmployeeDashboard from "@/pages/employee-dashboard";
import EmployeeProfile from "@/pages/employee-profile";

function ProtectedRoute({ component: Component, role }: { component: React.ComponentType, role?: "admin" | "employee" }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (!user) return <Redirect to="/" />;

  if (role && user.role !== role) {
    return <Redirect to={user.role === "admin" ? "/admin" : "/employee"} />;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      
      {/* Admin Routes */}
      <Route path="/admin">
        <ProtectedRoute component={AdminDashboard} role="admin" />
      </Route>
      <Route path="/admin/employees">
        <ProtectedRoute component={AdminEmployeesPage} role="admin" />
      </Route>
      <Route path="/admin/attendance">
        <ProtectedRoute component={AdminAttendancePage} role="admin" />
      </Route>
      <Route path="/admin/rules">
        <ProtectedRoute component={AdminRulesPage} role="admin" />
      </Route>
      <Route path="/admin/salary">
        <ProtectedRoute component={AdminSalaryPage} role="admin" />
      </Route>
      <Route path="/admin/profile">
        <ProtectedRoute component={EmployeeProfile} role="admin" />
      </Route>

      {/* Employee Routes */}
      <Route path="/employee">
        <ProtectedRoute component={EmployeeDashboard} role="employee" />
      </Route>
      <Route path="/employee/profile">
         <ProtectedRoute component={EmployeeProfile} role="employee" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
