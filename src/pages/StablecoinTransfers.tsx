
import { DashboardLayout } from "@/components/DashboardLayout";
import StablecoinTransfersTab from "@/components/StablecoinTransfersTab";

const StablecoinTransfers = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Stablecoin Transfers</h1>
          <p className="text-muted-foreground">
            Track and monitor stablecoin transfers across multiple blockchains in real-time.
          </p>
        </div>
        <StablecoinTransfersTab />
      </div>
    </DashboardLayout>
  );
};

export default StablecoinTransfers;
