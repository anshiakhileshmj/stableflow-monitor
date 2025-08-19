
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import StablecoinTransfers from "./pages/StablecoinTransfers";
import WalletAnalysis from "./pages/WalletAnalysis";
import Monitor from "./pages/Monitor";
import Balances from "./pages/Balances";
import HistoryPage from "./pages/HistoryPage";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            <Route path="/stablecoin-transfers" element={
              <ProtectedRoute>
                <StablecoinTransfers />
              </ProtectedRoute>
            } />
            <Route path="/wallet-analysis" element={
              <ProtectedRoute>
                <WalletAnalysis />
              </ProtectedRoute>
            } />
            <Route path="/monitor" element={
              <ProtectedRoute>
                <Monitor />
              </ProtectedRoute>
            } />
            <Route path="/balances" element={
              <ProtectedRoute>
                <Balances />
              </ProtectedRoute>
            } />
            <Route path="/history" element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            } />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
