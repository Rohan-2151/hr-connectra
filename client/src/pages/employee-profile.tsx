import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function EmployeeProfile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight font-heading">My Profile</h2>
        <p className="text-muted-foreground">
          Manage your personal information and settings.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-4xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <CardTitle>{user.name}</CardTitle>
                <CardDescription className="mt-1">{user.role.toUpperCase()}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Employee ID</Label>
              <div className="font-mono text-sm">{user.id}</div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Joining Date</Label>
              <div className="text-sm">{user.joiningDate}</div>
            </div>
            <div className="grid gap-1">
              <Label className="text-xs text-muted-foreground">Status</Label>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm capitalize">{user.status}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>
              Contact and identification information.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input defaultValue={user.name} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input defaultValue={user.email} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Mobile Number</Label>
                <Input defaultValue={user.mobile} readOnly />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input defaultValue={user.address} readOnly />
              </div>
            </div>

            <div className="space-y-2">
               <h3 className="text-lg font-medium">Banking & Identity</h3>
               <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>PAN Number</Label>
                    <Input defaultValue={user.pan} readOnly className="font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Aadhar Number</Label>
                    <Input defaultValue={user.aadhar} readOnly className="font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Bank Account</Label>
                    <Input defaultValue={user.bankAccount} readOnly className="font-mono" />
                  </div>
                   <div className="space-y-2">
                    <Label>IFSC Code</Label>
                    <Input defaultValue={user.ifsc} readOnly className="font-mono" />
                  </div>
               </div>
            </div>

            <div className="flex justify-end">
              <Button disabled>Edit Profile (Admin Only)</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
