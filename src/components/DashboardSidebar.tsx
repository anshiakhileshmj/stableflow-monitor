import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  TrendingUp, 
  Shield, 
  Waves, 
  Wallet, 
  History,
  LogOut,
  User
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface NavigationItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Overview and metrics"
  },
  {
    title: "Stablecoin Transfers",
    href: "/?section=transfers",
    icon: TrendingUp,
    description: "Real-time transfer tracking"
  },
  {
    title: "Wallet Analysis",
    href: "/?section=analysis",
    icon: Shield,
    description: "Risk assessment tools"
  },
  {
    title: "Whale Monitor",
    href: "/?section=whale",
    icon: Waves,
    description: "Large transaction alerts"
  },
  {
    title: "Balance Tracker",
    href: "/?section=balance",
    icon: Wallet,
    description: "Real-time balance monitoring"
  },
  {
    title: "History Check",
    href: "/?section=history",
    icon: History,
    description: "Historical transaction analysis"
  },
];

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { user, signOut } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleNavigation = (href: string, title: string) => {
    const urlParams = new URLSearchParams(href.split('?')[1] || '');
    const section = urlParams.get('section') || 'dashboard';
    onSectionChange(section);
  };

  return (
    <Sidebar className="border-r bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold text-sidebar-foreground">
                Stablecoin AML
              </span>
              <span className="truncate text-xs text-sidebar-foreground/60">
                Tracker
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const section = item.href.includes('section=') 
                  ? item.href.split('section=')[1] 
                  : 'dashboard';
                const isActive = activeSection === section;
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      onClick={() => handleNavigation(item.href, item.title)}
                      className={`cursor-pointer transition-colors ${
                        isActive 
                          ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                      }`}
                      tooltip={collapsed ? item.title : undefined}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && (
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {item.title}
                          </span>
                          <span className="truncate text-xs text-sidebar-foreground/50">
                            {item.description}
                          </span>
                        </div>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 p-2 text-sidebar-foreground/70">
              <User className="h-4 w-4" />
              {!collapsed && (
                <span className="text-sm truncate">{user?.email}</span>
              )}
            </div>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="w-full justify-start text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}