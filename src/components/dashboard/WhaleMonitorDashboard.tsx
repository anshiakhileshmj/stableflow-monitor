import RealTimeMonitor from '@/components/RealTimeMonitor';

const WhaleMonitorDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Whale Monitor</h2>
        <p className="text-gray-600">
          Track large cryptocurrency transfers and whale activities across all supported networks in real-time.
        </p>
      </div>
      
      <RealTimeMonitor />
    </div>
  );
};

export default WhaleMonitorDashboard;