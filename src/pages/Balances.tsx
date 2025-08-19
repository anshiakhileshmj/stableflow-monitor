
import { DashboardLayout } from "@/components/DashboardLayout";
import BalanceTracker from "@/components/balance-tracker/BalanceTracker";

const Balances = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Balance Tracker</h1>
          <p className="text-muted-foreground">
            Track and monitor wallet balances across multiple cryptocurrencies and blockchains.
          </p>
        </div>
        <BalanceTracker />
      </div>
    </DashboardLayout>
  );
};

export default Balances;
