
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
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
      case "dashboard":
        return <DashboardOverview />;
      case "transfers":
        return <StablecoinTransfersDashboard />;
      case "analysis":
        return <WalletAnalysisDashboard />;
      case "whale":
        return <WhaleMonitorDashboard />;
      case "balance":
        return <BalanceTrackerDashboard />;
      case "history":
        return <HistoryCheckDashboard />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <DashboardSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <div className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-16 border-b bg-background flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-xl font-semibold">Stablecoin AML Tracker</h1>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6 bg-muted/20">
            <div className="max-w-7xl mx-auto">
              {renderActiveSection()}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
