import React, { useState } from "react";
import {
  Home,
  Coins,
  Search,
  Monitor,
  Wallet,
  History,
  Settings,
  HelpCircle,
  ChevronsRight,
  ChevronDown,
} from "lucide-react";

interface SidebarOptionProps {
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  selected: string;
  setSelected: (title: string) => void;
  open: boolean;
  notifs?: number;
  onClick?: () => void;
}

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Option: React.FC<SidebarOptionProps> = ({ Icon, title, selected, setSelected, open, notifs, onClick }) => {
  const isSelected = selected === title.toLowerCase().replace(/\s+/g, '-');
  
  return (
    <button
      onClick={() => {
        if (onClick) {
          onClick();
        } else {
          setSelected(title.toLowerCase().replace(/\s+/g, '-'));
        }
      }}
      className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
        isSelected 
          ? "bg-muted text-foreground shadow-sm border-l-2 border-primary" 
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      <div className="grid h-full w-12 place-content-center">
        <Icon className="h-4 w-4" />
      </div>
      
      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {title}
        </span>
      )}

      {notifs && open && (
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-medium">
          {notifs}
        </span>
      )}
    </button>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  return (
    <div className="mb-6 border-b pb-4">
      <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-muted/50">
        <div className="flex items-center gap-3">
          <Logo />
          {open && (
            <div className={`transition-opacity duration-200 ${open ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center gap-2">
                <div>
                  <span className="block text-sm font-semibold">
                    CryptoAnalyzer
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    Pro Dashboard
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        {open && (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-sm">
      <Coins className="h-5 w-5 text-primary-foreground" />
    </div>
  );
};

const ToggleClose = ({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) => {
  return (
    <button
      onClick={() => setOpen(!open)}
      className="absolute bottom-0 left-0 right-0 border-t transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center p-3">
        <div className="grid size-10 place-content-center">
          <ChevronsRight
            className={`h-4 w-4 transition-transform duration-300 text-muted-foreground ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
        {open && (
          <span
            className={`text-sm font-medium text-muted-foreground transition-opacity duration-200 ${
              open ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Hide
          </span>
        )}
      </div>
    </button>
  );
};

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ activeSection, onSectionChange }) => {
  const [open, setOpen] = useState(true);

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } bg-background p-2 shadow-sm`}
    >
      <TitleSection open={open} />

      <div className="space-y-1 mb-8">
        <Option
          Icon={Coins}
          title="Stablecoin Transfers"
          selected={activeSection}
          setSelected={onSectionChange}
          open={open}
          onClick={() => onSectionChange('stablecoin-transfers')}
        />
        <Option
          Icon={Search}
          title="Wallet Analysis"
          selected={activeSection}
          setSelected={onSectionChange}
          open={open}
          onClick={() => onSectionChange('wallet-analysis')}
        />
        <Option
          Icon={Monitor}
          title="Real Time Monitor"
          selected={activeSection}
          setSelected={onSectionChange}
          open={open}
          onClick={() => onSectionChange('real-time-monitor')}
        />
        <Option
          Icon={Wallet}
          title="Balance Tracker"
          selected={activeSection}
          setSelected={onSectionChange}
          open={open}
          onClick={() => onSectionChange('balance-tracker')}
        />
        <Option
          Icon={History}
          title="History Check"
          selected={activeSection}
          setSelected={onSectionChange}
          open={open}
          onClick={() => onSectionChange('history-check')}
        />
      </div>

      {open && (
        <div className="border-t pt-4 space-y-1">
          {/*
          <div className="px-3 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Account
          </div>
          */}
          {/*
          <Option
            Icon={Settings}
            title="Settings"
            selected={activeSection}
            setSelected={onSectionChange}
            open={open}
          />
          <Option
            Icon={HelpCircle}
            title="Help & Support"
            selected={activeSection}
            setSelected={onSectionChange}
            open={open}
          />
          */}
        </div>
      )}

      <ToggleClose open={open} setOpen={setOpen} />
    </nav>
  );
};

export default DashboardSidebar;
