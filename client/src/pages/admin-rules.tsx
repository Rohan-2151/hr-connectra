import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_RULES, CompanyRules } from "@/lib/mock-data";
import { Clock, DollarSign, AlertCircle, MapPin, CalendarDays } from "lucide-react";

export default function AdminRulesPage() {
  const [rules, setRules] = useState<CompanyRules>(DEFAULT_RULES);
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Rules Updated",
      description: "Company policies have been successfully updated.",
    });
  };

  const handleChange = (key: keyof CompanyRules, value: any) => {
    setRules(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleWeekOffToggle = (dayIndex: number) => {
    setRules(prev => {
      const newWeekOffs = prev.weekOffs.includes(dayIndex)
        ? prev.weekOffs.filter(d => d !== dayIndex)
        : [...prev.weekOffs, dayIndex];
      return { ...prev, weekOffs: newWeekOffs };
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight font-heading">Company Rules & Policies</h2>
        <p className="text-muted-foreground">
          Configure attendance, geofence, leaves, and payroll calculations.
        </p>
      </div>

      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-[600px]">
          <TabsTrigger value="attendance">Attendance & Geofence</TabsTrigger>
          <TabsTrigger value="leaves">Leaves & Holidays</TabsTrigger>
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
                  <CardTitle>Shift Timing & Location</CardTitle>
                  <CardDescription>Define working hours and geofence restrictions.</CardDescription>
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
                    onChange={(e) => handleChange('fullDayHours', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Half Day Duration (Hours)</Label>
                  <Input 
                    type="number" 
                    value={rules.halfDayHours}
                    onChange={(e) => handleChange('halfDayHours', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Late Grace Period (Minutes)</Label>
                  <Input 
                    type="number" 
                    value={rules.lateGracePeriodMinutes}
                    onChange={(e) => handleChange('lateGracePeriodMinutes', Number(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Geofence Configuration
                </h3>
                <div className="grid gap-6 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Office Latitude</Label>
                    <Input 
                      type="number" 
                      step="any"
                      value={rules.officeLat}
                      onChange={(e) => handleChange('officeLat', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Office Longitude</Label>
                    <Input 
                      type="number" 
                      step="any"
                      value={rules.officeLng}
                      onChange={(e) => handleChange('officeLng', Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Radius Restriction (Meters)</Label>
                    <Input 
                      type="number" 
                      value={rules.geofenceRadius}
                      onChange={(e) => handleChange('geofenceRadius', Number(e.target.value))}
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Employees will only be able to punch in/out if they are within {rules.geofenceRadius} meters of these coordinates.
                </p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-4">
              <Button onClick={handleSave}>Save Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="leaves">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg dark:bg-orange-900/30">
                  <CalendarDays className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <CardTitle>Leaves & Holidays</CardTitle>
                  <CardDescription>Manage week-offs and paid leave policies.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base">Weekly Off Days</Label>
                <div className="flex flex-wrap gap-4">
                  {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`day-${index}`} 
                        checked={rules.weekOffs.includes(index)}
                        onCheckedChange={() => handleWeekOffToggle(index)}
                      />
                      <label
                        htmlFor={`day-${index}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {day}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Paid Week Offs</Label>
                    <p className="text-sm text-muted-foreground">
                      Are weekly offs considered paid days?
                    </p>
                  </div>
                  <Switch 
                    checked={rules.isWeekOffPaid}
                    onCheckedChange={(checked) => handleChange('isWeekOffPaid', checked)}
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base">Paid Holidays</Label>
                    <p className="text-sm text-muted-foreground">
                      Are public holidays considered paid days?
                    </p>
                  </div>
                  <Switch 
                    checked={rules.isHolidayPaid}
                    onCheckedChange={(checked) => handleChange('isHolidayPaid', checked)}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 px-6 py-4">
              <Button onClick={handleSave}>Save Leave Policies</Button>
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
                    onChange={(e) => handleChange('otStartAfter', Number(e.target.value))}
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
                      onChange={(e) => handleChange('otRateMultiplier', Number(e.target.value))}
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
                      Hourly Rate = (Monthly Salary / 30) / {rules.fullDayHours} <br/>
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
