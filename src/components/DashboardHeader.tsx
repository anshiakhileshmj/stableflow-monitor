import React from "react";
import { Button } from "@/components/ui/button";
import { Bell, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface DashboardHeaderProps {
  activeSection: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeSection }) => {
  const { signOut } = useAuth();

  const getSectionTitle = (section: string) => {
    switch (section) {
      case 'dashboard':
        return 'Dashboard';
      case 'stablecoin-transfers':
        return 'Stablecoin Transfers';
      case 'wallet-analysis':
        return 'Wallet Analysis';
      case 'real-time-monitor':
        return 'Real Time Monitor';
      case 'balance-tracker':
        return 'Balance Tracker';
      case 'history-check':
        return 'History Check';
      default:
        return 'Dashboard';
    }
  };

  const getSectionDescription = (section: string) => {
    switch (section) {
      case 'dashboard':
        return 'Welcome to your crypto analytics dashboard';
      case 'stablecoin-transfers':
        return 'Monitor and analyze stablecoin transactions';
      case 'wallet-analysis':
        return 'Analyze wallet addresses across multiple networks';
      case 'real-time-monitor':
        return 'Real-time monitoring of blockchain activities';
      case 'balance-tracker':
        return 'Track wallet balances and portfolio values';
      case 'history-check':
        return 'View historical data and transaction records';
      default:
        return 'Analytics dashboard';
    }
  };

  return (
    <header className="border-b bg-background px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Stablecoin AML Tracker
          </h1>
          <p className="text-muted-foreground mt-1">
            {getSectionDescription(activeSection)}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={signOut}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;