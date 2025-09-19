
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, TrendingUp, RefreshCw } from "lucide-react";
import AddressDisplay from "@/components/AddressDisplay";
import { SUPPORTED_NETWORKS } from '@/lib/networks';
import { NETWORK_LOGOS } from '@/lib/network-logos';

interface Transfer {
  tokenSymbol: string;
  tokenName: string;
  amount: string;
  senderAddress: string;
  receiverAddress: string;
  timestamp: string;
  network: string;
}

const StablecoinTransfersTab = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchAllNetworkTransfers = async () => {
    setIsLoadingTransfers(true);
    const allTransfers: Transfer[] = [];
    
    try {
      console.log('🔍 Fetching stablecoin transfers from all networks...');
      
      // Get all supported networks (excluding XRP as it uses different format)
      const networks = Object.keys(SUPPORTED_NETWORKS).filter(net => net !== 'xrp');
      
      const transferPromises = networks.map(async (networkKey) => {
        try {
          const network = SUPPORTED_NETWORKS[networkKey];
          const { data, error } = await supabase.functions.invoke('fetch-stablecoin-transfers', {
            body: { network: network.bitqueryId }
          });
          
          if (error) {
            console.error(`Error fetching transfers for ${network.name}:`, error);
            return [];
          }
          
          // Check if the response contains an error message
          if (data?.error) {
            console.error(`API error for ${network.name}:`, data.error, data.message);
            toast({
              title: `Error fetching ${network.name} transfers`,
              description: data.message || data.error,
              variant: "destructive",
            });
            return [];
          }
          
          const networkTransfers = Array.isArray(data?.transfers) ? data.transfers : [];
          return networkTransfers.map((transfer: any) => ({
            ...transfer,
            network: networkKey // Use the frontend network key
          }));
          
        } catch (error) {
          console.error(`Failed to fetch transfers for ${networkKey}:`, error);
          toast({
            title: `Error fetching ${SUPPORTED_NETWORKS[networkKey]?.name || networkKey} transfers`,
            description: "Failed to connect to the API",
            variant: "destructive",
          });
          return [];
        }
      });

      const results = await Promise.all(transferPromises);
      const combinedTransfers = results.flat();
      
      // Sort by timestamp (most recent first) and limit to 100
      const sortedTransfers = combinedTransfers
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 100);
      
      allTransfers.push(...sortedTransfers);
      setTransfers(allTransfers);
      setLastUpdate(new Date());
      
      console.log(`✅ Fetched ${allTransfers.length} transfers from ${networks.length} networks`);
      
    } catch (error) {
      console.error('Error fetching transfers from all networks:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stablecoin transfers from networks",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTransfers(false);
    }
  };

  // Auto-fetch on mount and every 15 seconds
  useEffect(() => {
    fetchAllNetworkTransfers();
    
    const interval = setInterval(() => {
      fetchAllNetworkTransfers();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Stablecoin Transfers</span>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdate && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </div>
            )}
            <button
              onClick={fetchAllNetworkTransfers}
              disabled={isLoadingTransfers}
              className="flex items-center gap-2 px-3 py-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg text-sm font-medium hover:bg-gray-800 dark:hover:bg-gray-200"
            >
              {isLoadingTransfers ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
        <div className="px-6 pb-6 pt-2">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Network</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Token</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">From</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">To</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((transfer, index) => (
                  <tr key={`${transfer.network}-${index}`} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-2">
                      <span className="inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300">
                        {NETWORK_LOGOS[transfer.network] && (
                          <img src={NETWORK_LOGOS[transfer.network]} alt={transfer.network + ' logo'} className="w-5 h-5 inline-block" />
                        )}
                        {SUPPORTED_NETWORKS[transfer.network]?.name || transfer.network}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span className="inline-block px-2 py-1 rounded border border-gray-300 dark:border-gray-700 text-xs font-medium text-gray-900 dark:text-gray-100">
                        {transfer.tokenSymbol}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-gray-900 dark:text-gray-100">
                      {parseFloat(transfer.amount).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <AddressDisplay address={transfer.senderAddress} />
                    </td>
                    <td className="px-4 py-2">
                      <AddressDisplay address={transfer.receiverAddress} />
                    </td>
                    <td className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      {formatTimestamp(transfer.timestamp)}
                    </td>
                  </tr>
                ))}
                {transfers.length === 0 && !isLoadingTransfers && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No transfers found across all networks. Transfers will auto-refresh every 15 seconds.
                    </td>
                  </tr>
                )}
                {isLoadingTransfers && transfers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-gray-500 dark:text-gray-400">Fetching transfers from all networks...</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StablecoinTransfersTab;
