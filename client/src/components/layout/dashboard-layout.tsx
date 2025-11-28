import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  LogOut, 
  Menu, 
  X, 
  UserCircle,
  Building2,
  Settings,
  Banknote,
  Wallet,
  Bell
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { NotificationPanel } from "@/components/dialogs/notification-panel";
import { MOCK_NOTIFICATIONS } from "@/lib/mock-data";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Filter notifications for current user
  const userNotifications = MOCK_NOTIFICATIONS.filter(n => n.userId === user?.id || (user?.role === 'admin' && n.type !== 'advance_approved'));
  const unreadCount = userNotifications.filter(n => !n.read).length;

  const navItems = user?.role === "admin" 
    ? [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/employees", label: "Employees", icon: Users },
        { href: "/admin/attendance", label: "Attendance", icon: Building2 },
        { href: "/admin/salary", label: "Payroll & Salary", icon: Banknote },
        { href: "/admin/advances", label: "Advances", icon: Wallet },
        { href: "/admin/rules", label: "Rules & Policies", icon: Settings },
        { href: "/admin/profile", label: "My Profile", icon: UserCircle },
      ]
    : [
        { href: "/employee", label: "Dashboard", icon: LayoutDashboard },
        { href: "/employee/profile", label: "My Profile", icon: UserCircle },
      ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col gap-4">
      <div className="flex h-16 items-center px-6">
        <Link href={user?.role === 'admin' ? '/admin' : '/employee'}>
          <div className="flex items-center gap-2 font-heading text-xl font-bold text-primary cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              HR
            </div>
            <span>Nexus</span>
          </div>
        </Link>
      </div>
      
      <div className="flex-1 px-4">
        <nav className="grid gap-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== '/admin' && location.startsWith(item.href));
            
            return (
              <Link key={item.href} href={item.href}>
                <div 
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent cursor-pointer ${
                    isActive 
                      ? "bg-accent text-accent-foreground shadow-sm" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4">
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium">{user?.name}</p>
              <p className="truncate text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
          </div>
          <Separator className="my-3" />
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background md:grid md:grid-cols-[240px_1fr]">
      {/* Desktop Sidebar */}
      <aside className="hidden border-r bg-sidebar md:block sticky top-0 h-screen overflow-y-auto z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="flex flex-col min-h-screen">
        <header className="flex h-16 items-center justify-between border-b bg-background px-4 md:hidden sticky top-0 z-40">
          <div className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              HR
            </div>
            <span>Nexus</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsNotificationOpen(true)}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              )}
            </Button>

            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[280px]">
                <SidebarContent />
              </SheetContent>
            </Sheet>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-0">
          <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Desktop Notification Button */}
            {(user?.role === 'admin' || user?.role === 'employee') && (
              <div className="absolute top-8 right-8 md:flex hidden">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={() => setIsNotificationOpen(true)}
                  className="relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>

      {/* Notification Panel */}
      <NotificationPanel 
        open={isNotificationOpen}
        onOpenChange={setIsNotificationOpen}
        notifications={userNotifications}
      />
    </div>
  );
}
