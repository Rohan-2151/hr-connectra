import { Button } from "@/components/ui/button";
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
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Employee } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EditEmployeeDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditEmployeeDialog({ employee, open, onOpenChange }: EditEmployeeDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Employee>>({});

  useEffect(() => {
    if (employee) {
      setFormData({
        ...employee,
      });
    }
  }, [employee]);

  const handleChange = (key: keyof Employee, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onOpenChange(false);
      toast({
        title: "Employee Updated",
        description: "Employee details have been successfully updated.",
      });
    }, 1500);
  };

  if (!employee) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Employee Details</DialogTitle>
          <DialogDescription>
            Update personal information, contact details, and salary configuration.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="personal">Personal & Contact</TabsTrigger>
              <TabsTrigger value="salary">Salary & Payroll</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={formData.name || ''} 
                    onChange={(e) => handleChange('name', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={formData.email || ''} 
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input 
                    id="mobile" 
                    value={formData.mobile || ''} 
                    onChange={(e) => handleChange('mobile', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="joiningDate">Joining Date</Label>
                  <Input 
                    id="joiningDate" 
                    type="date"
                    value={formData.joiningDate || ''} 
                    onChange={(e) => handleChange('joiningDate', e.target.value)}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    value={formData.address || ''} 
                    onChange={(e) => handleChange('address', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2 border-t pt-4 mt-4">
                <h3 className="text-sm font-medium text-muted-foreground">Identity Documents</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="aadhar">Aadhar Number</Label>
                    <Input 
                      id="aadhar" 
                      value={formData.aadhar || ''} 
                      onChange={(e) => handleChange('aadhar', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pan">PAN Number</Label>
                    <Input 
                      id="pan" 
                      value={formData.pan || ''} 
                      onChange={(e) => handleChange('pan', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="salary" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="baseSalary">Monthly Base Salary (₹)</Label>
                  <Input 
                    id="baseSalary" 
                    type="number"
                    value={formData.baseSalary || ''} 
                    onChange={(e) => handleChange('baseSalary', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryFormula">Salary Calculation Formula</Label>
                  <Select 
                    value={formData.salaryFormula || "Standard (Monthly / 30)"} 
                    onValueChange={(val) => handleChange('salaryFormula', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select calculation method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Standard (Monthly / 30)">Standard (Monthly / 30 days)</SelectItem>
                      <SelectItem value="Actual Days (Monthly / Days in Month)">Actual Days (Monthly / Days in Month)</SelectItem>
                      <SelectItem value="Fixed Contract">Fixed Contract Amount</SelectItem>
                      <SelectItem value="Hourly Rate">Hourly Rate Basis</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Determines how the daily rate is derived from base salary.</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otFormula">Overtime (OT) Formula</Label>
                  <Select 
                    value={formData.otFormula || "1.5x Hourly Rate"} 
                    onValueChange={(val) => handleChange('otFormula', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select OT method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1.5x Hourly Rate">1.5x Hourly Rate (Standard)</SelectItem>
                      <SelectItem value="2.0x Hourly Rate">2.0x Hourly Rate (Double)</SelectItem>
                      <SelectItem value="1.0x Hourly Rate">1.0x Hourly Rate (Flat)</SelectItem>
                      <SelectItem value="Fixed Amount per Hour">Fixed Amount per Hour (₹100/hr)</SelectItem>
                      <SelectItem value="No Overtime">No Overtime</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Calculates compensation for hours worked beyond shift time.</p>
                </div>

                <div className="space-y-2 border-t pt-4 mt-4">
                  <h3 className="text-sm font-medium text-muted-foreground">Bank Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankAccount">Account Number</Label>
                      <Input 
                        id="bankAccount" 
                        value={formData.bankAccount || ''} 
                        onChange={(e) => handleChange('bankAccount', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ifsc">IFSC Code</Label>
                      <Input 
                        id="ifsc" 
                        value={formData.ifsc || ''} 
                        onChange={(e) => handleChange('ifsc', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
