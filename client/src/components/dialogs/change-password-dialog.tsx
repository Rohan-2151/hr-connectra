import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Lock, KeyRound } from "lucide-react";

interface ChangePasswordDialogProps {
  trigger?: React.ReactNode;
  employeeName?: string; // If changing for someone else
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChangePasswordDialog({ trigger, employeeName, open, onOpenChange }: ChangePasswordDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (val: boolean) => {
    setIsOpen(val);
    if (onOpenChange) onOpenChange(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      handleOpenChange(false);
      toast({
        title: "Password Updated",
        description: employeeName 
          ? `Password for ${employeeName} has been reset.` 
          : "Your password has been successfully changed.",
      });
    }, 1500);
  };

  // Controlled or uncontrolled
  const show = open !== undefined ? open : isOpen;
  const setShow = onOpenChange || setIsOpen;

  return (
    <Dialog open={show} onOpenChange={setShow}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            {employeeName 
              ? `Enter a new temporary password for ${employeeName}.` 
              : "Enter your new password below. Make it strong!"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {!employeeName && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="current-password" className="text-right">
                Current
              </Label>
              <div className="col-span-3 relative">
                <Input id="current-password" type="password" className="pl-8" />
                <KeyRound className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              New
            </Label>
            <div className="col-span-3 relative">
              <Input id="new-password" type="password" className="pl-8" />
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirm-password" className="text-right">
              Confirm
            </Label>
            <div className="col-span-3 relative">
              <Input id="confirm-password" type="password" className="pl-8" />
              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
