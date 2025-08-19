
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Shield, 
  Radio, 
  Wallet, 
  History, 
  TrendingUp,
  Menu,
  X,
  Home
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import AppHeader from "@/components/AppHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigationItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: Home,
    description: "Overview & Analytics"
  },
  {
    title: "Stablecoin Transfers",
    href: "/stablecoin-transfers",
    icon: TrendingUp,
    description: "Track transfers"
  },
  {
    title: "Wallet Analysis",
    href: "/wallet-analysis", 
    icon: Shield,
    description: "AML compliance"
  },
  {
    title: "Real-Time Monitor",
    href: "/monitor",
    icon: Radio,
    description: "Live tracking"
  },
  {
    title: "Balance Tracker",
    href: "/balances",
    icon: Wallet,
    description: "Portfolio monitoring"
  },
  {
    title: "History Check",
    href: "/history",
    icon: History,
    description: "Transaction history"
  }
];

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="flex">
        {/* Sidebar */}
        <aside className={cn(
          "bg-card border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16"
        )}>
          <div className="p-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-4"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
            
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {sidebarOpen && (
                      <div>
                        <div>{item.title}</div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
