import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Shield, 
  Radio, 
  Wallet, 
  History,
  BarChart3,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sidebarItems = [
  {
    id: 'overview',
    label: 'Dashboard Overview',
    icon: BarChart3,
    description: 'System overview and stats'
  },
  {
    id: 'transfers',
    label: 'Stablecoin Transfers',
    icon: TrendingUp,
    description: 'Live stablecoin movements'
  },
  {
    id: 'wallet',
    label: 'Wallet Analysis',
    icon: Shield,
    description: 'Risk assessment tools'
  },
  {
    id: 'monitor',
    label: 'Real-Time Monitor',
    icon: Radio,
    description: 'Live whale tracking'
  },
  {
    id: 'balances',
    label: 'Balance Tracker',
    icon: Wallet,
    description: 'Multi-wallet monitoring'
  },
  {
    id: 'history',
    label: 'History Check',
    icon: History,
    description: 'Historical analysis'
  }
];

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ 
  activeSection, 
  onSectionChange 
}) => {
  return (
    <div className="w-64 bg-card border-r border-border h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">AML Tracker</h2>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3 text-left",
                  isActive && "bg-primary text-primary-foreground"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className={cn(
                      "text-xs mt-0.5",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DashboardSidebar;