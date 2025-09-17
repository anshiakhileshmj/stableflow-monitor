import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Shield, 
  Radio, 
  Wallet, 
  History, 
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigationItems = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'transfers',
    name: 'Stablecoin Transfers',
    icon: TrendingUp,
  },
  {
    id: 'wallet-analysis',
    name: 'Wallet Analysis',
    icon: Shield,
  },
  {
    id: 'whale-monitor',
    name: 'Whale Monitor',
    icon: Radio,
  },
  {
    id: 'balance-tracker',
    name: 'Balance Tracker',
    icon: Wallet,
  },
  {
    id: 'history-check',
    name: 'History Check',
    icon: History,
  },
];

const DashboardSidebar = ({ activeSection, onSectionChange }: SidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={toggleSidebar}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-gray-900 text-white w-64 transform transition-transform duration-300 ease-in-out z-40",
          "md:translate-x-0 md:static md:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Title */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-lg">AML Tracker</h1>
                <p className="text-xs text-gray-400">Dashboard</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSectionClick(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              © 2024 Stablecoin AML Tracker
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardSidebar;