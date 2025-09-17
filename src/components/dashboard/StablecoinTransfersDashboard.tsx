import StablecoinTransfersTab from '@/components/StablecoinTransfersTab';

const StablecoinTransfersDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Stablecoin Transfers</h2>
        <p className="text-gray-600">
          Monitor live stablecoin transfers across all supported blockchains with real-time updates.
        </p>
      </div>
      
      <StablecoinTransfersTab />
    </div>
  );
};

export default StablecoinTransfersDashboard;