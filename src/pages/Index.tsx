
import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import StablecoinTransfersDashboard from "@/components/dashboard/StablecoinTransfersDashboard";
import WalletAnalysisDashboard from "@/components/dashboard/WalletAnalysisDashboard";
import RealTimeMonitorDashboard from "@/components/dashboard/RealTimeMonitorDashboard";
import BalanceTrackerDashboard from "@/components/dashboard/BalanceTrackerDashboard";
import HistoryCheckDashboard from "@/components/dashboard/HistoryCheckDashboard";

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('dashboard');

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
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <DashboardSidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader activeSection={activeSection} />
        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
