import StablecoinTransfersTab from "@/components/StablecoinTransfersTab";

const StablecoinTransfersDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Stablecoin Transfers</h1>
        <p className="text-muted-foreground">
          Real-time tracking of stablecoin transfers across all supported blockchains with automatic updates every 15 seconds.
        </p>
      </div>
      
      <StablecoinTransfersTab />
    </div>
  );
};

export default StablecoinTransfersDashboard;