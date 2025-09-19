
import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import StablecoinTransfersDashboard from "@/components/dashboard/StablecoinTransfersDashboard";
import WalletAnalysisDashboard from "@/components/dashboard/WalletAnalysisDashboard";
import RealTimeMonitorDashboard from "@/components/dashboard/RealTimeMonitorDashboard";
import BalanceTrackerDashboard from "@/components/dashboard/BalanceTrackerDashboard";
import HistoryCheckDashboard from "@/components/dashboard/HistoryCheckDashboard";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('stablecoin-transfers');
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'stablecoin-transfers':
        return <StablecoinTransfersDashboard />;
      case 'wallet-analysis':
        return <WalletAnalysisDashboard />;
      case 'real-time-monitor':
        return <RealTimeMonitorDashboard />;
      case 'balance-tracker':
        return <BalanceTrackerDashboard />;
      case 'history-check':
        return <HistoryCheckDashboard />;
      default:
        return <StablecoinTransfersDashboard />;
    }
  };

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark bg-gray-950 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <DashboardSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b bg-background px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Stablecoin AML Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              {(() => {
                switch (activeSection) {
                  case 'stablecoin-transfers':
                    return '';
                  case 'wallet-analysis':
                    return '';
                  case 'real-time-monitor':
                    return 'Real-time monitoring of blockchain activities';
                  case 'balance-tracker':
                    return 'Track wallet balances and portfolio values';
                  case 'history-check':
                    return 'View historical data and transaction records';
                  default:
                    return 'Analytics dashboard';
                }
              })()}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {/* Dark mode toggle button */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="rounded-full p-2 border bg-background hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? (
                // Sun icon for dark mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2" fill="currentColor" />
                  <g stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                  </g>
                </svg>
              ) : (
                // Moon icon for light mode
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                </svg>
              )}
            </button>
            {/* Notification, profile, sign out buttons */}
            <button className="relative rounded-full p-2 hover:bg-muted transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full"></span>
            </button>
            {/* Profile button removed as per request */}
            <button className="flex items-center gap-2 px-5 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-geist-mono text-base font-semibold shadow transition-colors" style={{ fontFamily: 'Geist Mono, monospace' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" /></svg>
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
