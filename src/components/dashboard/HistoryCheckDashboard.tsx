import HistoryCheck from "@/components/HistoryCheck";

const HistoryCheckDashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">History Check</h1>
        <p className="text-muted-foreground">
          Comprehensive historical transaction analysis with detailed analytics, reporting capabilities, and time-based filtering.
        </p>
      </div>
      
      <HistoryCheck />
    </div>
  );
};

export default HistoryCheckDashboard;