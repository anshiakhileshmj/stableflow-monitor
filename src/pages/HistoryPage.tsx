
import { DashboardLayout } from "@/components/DashboardLayout";
import HistoryCheck from "@/components/HistoryCheck";

const HistoryPage = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">History Check</h1>
          <p className="text-muted-foreground">
            Search and analyze historical transaction data and wallet activities.
          </p>
        </div>
        <HistoryCheck />
      </div>
    </DashboardLayout>
  );
};

export default HistoryPage;
