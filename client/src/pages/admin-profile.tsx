import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { KeyRound, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChangePasswordDialog } from "@/components/dialogs/change-password-dialog";

interface Admin {
  id: string;
  name: string;
  email: string;
  mobile: string;
  permissions: "read_only" | "read_write";
  joiningDate: string;
}

export default function AdminProfile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false);
  const [isEditPermissionOpen, setIsEditPermissionOpen] = useState(false);
  const [editData, setEditData] = useState({
    email: user?.email || "",
    mobile: user?.mobile || "",
  });
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    mobile: "",
    permissions: "read_only" as "read_only" | "read_write"
  });
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [editPermission, setEditPermission] = useState<"read_only" | "read_write">("read_only");

  useEffect(() => {
    // Load admins from localStorage or use defaults
    const stored = localStorage.getItem("hrms_admins");
    if (stored) {
      setAdmins(JSON.parse(stored));
    } else {
      const defaultAdmins: Admin[] = [
        {
          id: "EMP001",
          name: "Admin User",
          email: "admin@company.com",
          mobile: "9876543210",
          permissions: "read_write",
          joiningDate: "2023-01-01"
        },
        {
          id: "EMP004",
          name: "Sarah Manager",
          email: "sarah@company.com",
          mobile: "9876543213",
          permissions: "read_only",
          joiningDate: "2023-03-15"
        }
      ];
      setAdmins(defaultAdmins);
      localStorage.setItem("hrms_admins", JSON.stringify(defaultAdmins));
    }
  }, []);

  if (!user) return null;

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile details have been saved successfully.",
    });
    setIsEditMode(false);
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.mobile) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all fields.",
      });
      return;
    }

    const newAdminData: Admin = {
      id: `EMP${String(Date.now()).slice(-3)}`,
      ...newAdmin,
      joiningDate: new Date().toISOString().split('T')[0]
    };

    const updatedAdmins = [...admins, newAdminData];
    setAdmins(updatedAdmins);
    localStorage.setItem("hrms_admins", JSON.stringify(updatedAdmins));

    toast({
      title: "Admin Added",
      description: `${newAdmin.name} has been added as an admin with ${newAdmin.permissions === 'read_write' ? 'Read & Write' : 'Read-Only'} permissions.`,
    });
    setIsAddAdminOpen(false);
    setNewAdmin({
      name: "",
      email: "",
      mobile: "",
      permissions: "read_only"
    });
  };

  const handleEditPermission = () => {
    if (!selectedAdmin) return;

    const updatedAdmins = admins.map(admin =>
      admin.id === selectedAdmin.id
        ? { ...admin, permissions: editPermission }
        : admin
    );
    setAdmins(updatedAdmins);
    localStorage.setItem("hrms_admins", JSON.stringify(updatedAdmins));

    toast({
      title: "Permissions Updated",
      description: `${selectedAdmin.name}'s permissions have been changed to ${editPermission === 'read_write' ? 'Read & Write' : 'Read-Only'}.`,
    });
    setIsEditPermissionOpen(false);
    setSelectedAdmin(null);
  };

  const handleRemoveAdmin = (admin: Admin) => {
    if (admin.id === "EMP001") {
      toast({
        variant: "destructive",
        title: "Cannot Remove",
        description: "You cannot remove the primary admin account.",
      });
      return;
    }

    const updatedAdmins = admins.filter(a => a.id !== admin.id);
    setAdmins(updatedAdmins);
    localStorage.setItem("hrms_admins", JSON.stringify(updatedAdmins));

    toast({
      title: "Admin Removed",
      description: `${admin.name} has been removed from the system.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight font-heading">Admin Profile</h2>
        <p className="text-muted-foreground">
          Manage your account details and system administrators.
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="admins">Manage Admins</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
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
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Account Details</CardTitle>
                    <CardDescription>Manage your login credentials and contact information.</CardDescription>
                  </div>
                  <Button 
                    variant={isEditMode ? "secondary" : "outline"} 
                    onClick={() => setIsEditMode(!isEditMode)}
                  >
                    {isEditMode ? "Cancel" : "Edit"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input value={user.name} readOnly />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input 
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      readOnly={!isEditMode}
                      className={isEditMode ? "" : "bg-muted"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Mobile Number</Label>
                    <Input 
                      value={editData.mobile}
                      onChange={(e) => setEditData({...editData, mobile: e.target.value})}
                      readOnly={!isEditMode}
                      className={isEditMode ? "" : "bg-muted"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Address</Label>
                    <Input value={user.address} readOnly className="bg-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Banking & Identity</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>PAN Number</Label>
                      <Input value={user.pan} readOnly className="font-mono bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Aadhar Number</Label>
                      <Input value={user.aadhar} readOnly className="font-mono bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>Bank Account</Label>
                      <Input value={user.bankAccount} readOnly className="font-mono bg-muted" />
                    </div>
                    <div className="space-y-2">
                      <Label>IFSC Code</Label>
                      <Input value={user.ifsc} readOnly className="font-mono bg-muted" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  {isEditMode && (
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                  )}
                  <ChangePasswordDialog 
                    trigger={
                      <Button variant="outline">
                        <KeyRound className="mr-2 h-4 w-4" /> Change Password
                      </Button>
                    } 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Manage Admins Tab */}
        <TabsContent value="admins">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">System Administrators ({admins.length})</h3>
                <p className="text-muted-foreground">Manage admin accounts and permissions</p>
              </div>
              <Button onClick={() => setIsAddAdminOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Admin
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {admins.map((admin) => (
                <Card key={admin.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{admin.name}</CardTitle>
                        <CardDescription>{admin.email} • {admin.mobile}</CardDescription>
                      </div>
                      <span className={`px-3 py-1 text-xs font-semibold rounded ${
                        admin.permissions === 'read_write' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {admin.permissions === 'read_write' ? 'Read & Write' : 'Read Only'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Employee ID: {admin.id}</p>
                      <p className="text-sm text-muted-foreground">Joined: {admin.joiningDate}</p>
                    </div>
                    {admin.id === "EMP001" && (
                      <p className="text-xs text-muted-foreground">Super Admin with full system access</p>
                    )}
                    {admin.id !== "EMP001" && (
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setSelectedAdmin(admin);
                            setEditPermission(admin.permissions);
                            setIsEditPermissionOpen(true);
                          }}
                        >
                          Edit Permissions
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleRemoveAdmin(admin)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Permission Levels Info */}
            <Card className="bg-blue-50 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="text-base">Permission Levels</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-semibold text-sm mb-1">Read & Write</p>
                  <p className="text-sm text-muted-foreground">Full access to edit attendance, salary, advances, rules, and manage all employees.</p>
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">Read Only</p>
                  <p className="text-sm text-muted-foreground">Can view all data and reports but cannot make any changes to system data.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Admin Dialog */}
      <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Administrator</DialogTitle>
            <DialogDescription>Create a new admin account with specific permissions.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input 
                placeholder="Enter admin name"
                value={newAdmin.name}
                onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Email Address</Label>
              <Input 
                type="email"
                placeholder="admin@company.com"
                value={newAdmin.email}
                onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Mobile Number</Label>
              <Input 
                placeholder="10-digit mobile number"
                value={newAdmin.mobile}
                onChange={(e) => setNewAdmin({...newAdmin, mobile: e.target.value})}
              />
            </div>
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <Select 
                value={newAdmin.permissions}
                onValueChange={(val: any) => setNewAdmin({...newAdmin, permissions: val})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read_write">Read & Write (Full Access)</SelectItem>
                  <SelectItem value="read_only">Read Only (View Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddAdmin}>Create Admin Account</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Permission Dialog */}
      <Dialog open={isEditPermissionOpen} onOpenChange={setIsEditPermissionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Admin Permissions</DialogTitle>
            <DialogDescription>Change permissions for {selectedAdmin?.name}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Permissions</Label>
              <Select 
                value={editPermission}
                onValueChange={(val: any) => setEditPermission(val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="read_write">Read & Write (Full Access)</SelectItem>
                  <SelectItem value="read_only">Read Only (View Only)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEditPermission}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
