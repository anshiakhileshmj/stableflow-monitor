import HistoryCheck from '@/components/HistoryCheck';

const HistoryCheckDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">History Check</h2>
        <p className="text-gray-600">
          Perform comprehensive historical analysis of wallet transactions within specific time periods.
        </p>
      </div>
      
      <HistoryCheck />
    </div>
  );
};

export default HistoryCheckDashboard;