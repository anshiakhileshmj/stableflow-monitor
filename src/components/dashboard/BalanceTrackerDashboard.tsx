import BalanceTracker from "@/components/balance-tracker/BalanceTracker";

const BalanceTrackerDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Balance Tracker</h1>
        <p className="text-muted-foreground">
          Monitor wallet balances across multiple networks in real-time with automatic updates and balance change tracking.
        </p>
      </div>
      
      <BalanceTracker />
    </div>
  );
};

export default BalanceTrackerDashboard;