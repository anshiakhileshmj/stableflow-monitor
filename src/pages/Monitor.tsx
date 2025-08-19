
import { DashboardLayout } from "@/components/DashboardLayout";
import RealTimeMonitor from "@/components/RealTimeMonitor";

const Monitor = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Real-Time Monitor</h1>
          <p className="text-muted-foreground">
            Monitor blockchain transactions and wallet activities in real-time across multiple networks.
          </p>
        </div>
        <RealTimeMonitor />
      </div>
    </DashboardLayout>
  );
};

export default Monitor;
