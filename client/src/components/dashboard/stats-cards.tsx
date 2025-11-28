import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, UserMinus, Clock } from "lucide-react";
import { useLocation } from "wouter";

export function StatsCards() {
  const [_, setLocation] = useLocation();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card 
        className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
        onClick={() => setLocation("/admin/employees?filter=all")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">124</div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer transition-all hover:shadow-md hover:border-green-500/50"
        onClick={() => setLocation("/admin/employees?filter=present")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">108</div>
          <p className="text-xs text-muted-foreground">
            87% attendance rate
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer transition-all hover:shadow-md hover:border-red-500/50"
        onClick={() => setLocation("/admin/employees?filter=absent")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Absent</CardTitle>
          <UserMinus className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">16</div>
          <p className="text-xs text-muted-foreground">
            4 on approved leave
          </p>
        </CardContent>
      </Card>
      
      <Card 
        className="cursor-pointer transition-all hover:shadow-md hover:border-orange-500/50"
        onClick={() => setLocation("/admin/employees?filter=late")}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Late Comers</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">12</div>
          <p className="text-xs text-muted-foreground">
            +3 from yesterday
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
