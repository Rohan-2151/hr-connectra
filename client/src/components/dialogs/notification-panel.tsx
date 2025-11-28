import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/lib/mock-data";
import { format } from "date-fns";
import { Trash2, CheckCheck } from "lucide-react";

interface NotificationPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notifications: Notification[];
}

export function NotificationPanel({ open, onOpenChange, notifications }: NotificationPanelProps) {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case "attendance_edited":
        return "📋";
      case "employee_modified":
        return "👤";
      case "admin_added":
        return "👨‍💼";
      case "advance_approved":
        return "✅";
      case "profile_updated":
        return "🖼️";
      default:
        return "📬";
    }
  };

  const getNotificationColor = (type: string) => {
    switch(type) {
      case "attendance_edited":
        return "bg-blue-50 dark:bg-blue-950/20 border-blue-200";
      case "employee_modified":
        return "bg-purple-50 dark:bg-purple-950/20 border-purple-200";
      case "admin_added":
        return "bg-green-50 dark:bg-green-950/20 border-green-200";
      case "advance_approved":
        return "bg-amber-50 dark:bg-amber-950/20 border-amber-200";
      case "profile_updated":
        return "bg-pink-50 dark:bg-pink-950/20 border-pink-200";
      default:
        return "bg-muted";
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[450px] flex flex-col">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            {unreadCount > 0 ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : "All caught up!"}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 -mx-6 px-6 my-4">
          <div className="space-y-3">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    notif.read ? "opacity-60" : ""
                  } ${getNotificationColor(notif.type)}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notif.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-sm">{notif.title}</p>
                          <p className="text-sm text-muted-foreground mt-1">{notif.message}</p>
                        </div>
                        {!notif.read && (
                          <span className="flex h-2 w-2 rounded-full bg-blue-600 flex-shrink-0 mt-1"></span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(notif.timestamp), 'PPp')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No notifications yet</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="flex gap-2 border-t pt-4">
          <Button variant="outline" className="flex-1" size="sm">
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark All as Read
          </Button>
          <Button variant="outline" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
