import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { ShieldCheck } from "lucide-react";

// Updated regex to allow email OR mobile number (simple 10 digit check for mobile)
const loginIdentifierSchema = z.string().refine((val) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^\d{10}$/;
  return emailRegex.test(val) || mobileRegex.test(val);
}, "Must be a valid email or 10-digit mobile number");

const loginSchema = z.object({
  identifier: loginIdentifierSchema,
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === "admin") setLocation("/admin");
      else setLocation("/employee");
    }
  }, [user, setLocation]);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>, role: "admin" | "employee") {
    // Pass identifier as email for mock auth (mock auth checks email field)
    // In real app, backend would handle lookup by email OR mobile
    login(values.identifier, role);
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-heading">HR Nexus</h1>
          <p className="text-muted-foreground mt-2">Secure Access Portal</p>
        </div>

        <Tabs defaultValue="employee" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="employee">Employee</TabsTrigger>
            <TabsTrigger value="admin">Administrator</TabsTrigger>
          </TabsList>

          <TabsContent value="employee">
            <Card>
              <CardHeader>
                <CardTitle>Employee Login</CardTitle>
                <CardDescription>
                  Enter your credentials to access your dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((v) => onSubmit(v, "employee"))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email or Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="john@company.com or 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {/* Remember me checkbox would go here */}
                      </div>
                      <Button variant="link" className="px-0 font-normal text-xs">
                        Forgot password?
                      </Button>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Authenticating..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                 <div className="bg-muted/50 p-3 rounded-md w-full text-xs">
                    <p>Demo Credentials:</p>
                    <p>User: <span className="font-mono text-foreground">john@company.com</span></p>
                    <p>Pass: <span className="font-mono text-foreground">any (6+ chars)</span></p>
                 </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
             <Card>
              <CardHeader>
                <CardTitle>Admin Login</CardTitle>
                <CardDescription>
                  Authorized personnel only.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit((v) => onSubmit(v, "admin"))} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="identifier"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email or Mobile Number</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@company.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Authenticating..." : "Admin Sign In"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                 <div className="bg-muted/50 p-3 rounded-md w-full text-xs">
                    <p>Demo Credentials:</p>
                    <p>User: <span className="font-mono text-foreground">admin@company.com</span></p>
                    <p>Pass: <span className="font-mono text-foreground">any (6+ chars)</span></p>
                 </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
