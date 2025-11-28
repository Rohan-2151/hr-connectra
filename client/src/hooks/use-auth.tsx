import { createContext, ReactNode, useContext, useState, useEffect } from "react";
import { Employee, MOCK_EMPLOYEES } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: Employee | null;
  login: (email: string, role: "admin" | "employee") => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check local storage for persisted session
    const storedUser = localStorage.getItem("hrms_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, role: "admin" | "employee") => {
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const foundUser = MOCK_EMPLOYEES.find((u) => u.email === email && u.role === role);
      
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem("hrms_user", JSON.stringify(foundUser));
        toast({
          title: "Welcome back!",
          description: `Logged in as ${foundUser.name}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "Invalid credentials or role selection.",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hrms_user");
    toast({
      title: "Logged out",
      description: "See you next time!",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
