import BalanceTracker from '@/components/balance-tracker/BalanceTracker';

const BalanceTrackerDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Balance Tracker</h2>
        <p className="text-gray-600">
          Monitor real-time balance changes for multiple wallet addresses across supported networks.
        </p>
      </div>
      
      <BalanceTracker />
    </div>
  );
};

export default BalanceTrackerDashboard;