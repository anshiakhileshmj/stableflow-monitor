import RealTimeMonitor from "@/components/RealTimeMonitor";

const WhaleMonitorDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Whale Monitor</h1>
        <p className="text-muted-foreground">
          Real-time monitoring of large cryptocurrency transfers with instant alerts and comprehensive whale activity tracking.
        </p>
      </div>
      
      <RealTimeMonitor />
    </div>
  );
};

export default WhaleMonitorDashboard;