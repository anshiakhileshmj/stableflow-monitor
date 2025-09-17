
import { useState } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import StablecoinTransfersDashboard from "@/components/dashboard/StablecoinTransfersDashboard";
import WalletAnalysisDashboard from "@/components/dashboard/WalletAnalysisDashboard";
import WhaleMonitorDashboard from "@/components/dashboard/WhaleMonitorDashboard";
import BalanceTrackerDashboard from "@/components/dashboard/BalanceTrackerDashboard";
import HistoryCheckDashboard from "@/components/dashboard/HistoryCheckDashboard";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'transfers':
        return <StablecoinTransfersDashboard />;
      case 'wallet-analysis':
        return <WalletAnalysisDashboard />;
      case 'whale-monitor':
        return <WhaleMonitorDashboard />;
      case 'balance-tracker':
        return <BalanceTrackerDashboard />;
      case 'history-check':
        return <HistoryCheckDashboard />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="flex pt-16">
        <DashboardSidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        
        <main className="flex-1 md:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {renderActiveSection()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
