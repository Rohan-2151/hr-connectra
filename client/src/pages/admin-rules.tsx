import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_RULES, CompanyRules } from "@/lib/mock-data";
import { Clock, DollarSign, AlertCircle } from "lucide-react";

export default function AdminRulesPage() {
  const [rules, setRules] = useState<CompanyRules>(DEFAULT_RULES);
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, this would save to backend
    toast({
      title: "Rules Updated",
      description: "Company policies have been successfully updated.",
    });
  };

  const handleChange = (key: keyof CompanyRules, value: string | number) => {
    setRules(prev => ({
      ...prev,
      [key]: typeof DEFAULT_RULES[key] === 'number' ? Number(value) : value
    }));
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight font-heading">Company Rules & Policies</h2>
        <p className="text-muted-foreground">
          Configure attendance rules, overtime calculations, and salary structures.
        </p>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Attendance & Shifts</TabsTrigger>
          <TabsTrigger value="overtime">Overtime & Salary</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Shift Timing & Attendance</CardTitle>
                  <CardDescription>Define working hours and late policies.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Shift Start Time</Label>
                  <Input 
                    type="time" 
                    value={rules.shiftStart}
                    onChange={(e) => handleChange('shiftStart', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Shift End Time</Label>
                  <Input 
                    type="time" 
                    value={rules.shiftEnd}
                    onChange={(e) => handleChange('shiftEnd', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Full Day Duration (Hours)</Label>
                  <Input 
                    type="number" 
                    value={rules.fullDayHours}
                    onChange={(e) => handleChange('fullDayHours', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Half Day Duration (Hours)</Label>
                  <Input 
                    type="number" 
                    value={rules.halfDayHours}
                    onChange={(e) => handleChange('halfDayHours', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Late Grace Period (Minutes)</Label>
                  <Input 
                    type="number" 
                    value={rules.lateGracePeriodMinutes}
                    onChange={(e) => handleChange('lateGracePeriodMinutes', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Time allowed after shift start before marking as late.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-4">
              <Button onClick={handleSave}>Save Attendance Rules</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="overtime">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900/30">
                  <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <CardTitle>Overtime & Compensation</CardTitle>
                  <CardDescription>Configure how extra hours are calculated and paid.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>OT Starts After (Hours)</Label>
                  <Input 
                    type="number" 
                    value={rules.otStartAfter}
                    onChange={(e) => handleChange('otStartAfter', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Usually same as Full Day Duration (9 hours).</p>
                </div>
                <div className="space-y-2">
                  <Label>OT Rate Multiplier</Label>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">x</span>
                    <Input 
                      type="number" 
                      step="0.1"
                      value={rules.otRateMultiplier}
                      onChange={(e) => handleChange('otRateMultiplier', e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Example: 1.5x means 50% extra per hour.</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="rounded-md bg-blue-50 p-4 dark:bg-blue-900/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-300">Formula Explanation</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                      Hourly Rate = (Monthly Salary / 30) / 9 <br/>
                      OT Earnings = OT Hours * Hourly Rate * {rules.otRateMultiplier}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-4">
              <Button onClick={handleSave}>Save Compensation Rules</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
