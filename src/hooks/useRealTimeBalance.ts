
import { useState, useEffect, useCallback, useRef } from 'react';
import { bitqueryService } from '@/lib/bitquery';

interface TokenBalance {
  amount: string;
  currency: {
    symbol?: string;
    name?: string;
    smartContract?: string;
    decimals?: number;
  };
}

interface WalletBalance {
  address: string;
  native: {
    amount: string;
    currency?: any;
  };
  tokens: TokenBalance[];
  lastUpdated: string;
}

interface WalletData {
  id: string;
  address: string;
  name?: string;
  network: string;
}

export const useRealTimeBalance = (wallets: WalletData[], network: string) => {
  const [balances, setBalances] = useState<Record<string, WalletBalance>>({});
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const subscriptionRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchBalances = useCallback(async () => {
    if (wallets.length === 0) return;

    try {
      console.log('🔍 Fetching balances for wallets:', wallets.map(w => w.address));
      const balanceData = await bitqueryService.getCurrentBalances(wallets, network);
      setBalances(balanceData);
      setLastUpdate(new Date());
      console.log('✅ Balances updated:', balanceData);
    } catch (error) {
      console.error('❌ Failed to fetch balances:', error);
    }
  }, [wallets, network]);

  const handleBalanceUpdate = useCallback((updateData: any) => {
    console.log('📊 Real-time balance update received:', updateData);
    
    setBalances(prev => ({
      ...prev,
      [updateData.address]: {
        ...prev[updateData.address],
        lastUpdated: new Date().toISOString()
      }
    }));
    
    setLastUpdate(new Date());
  }, []);

  const startTracking = useCallback(async () => {
    if (wallets.length === 0) return;

    try {
      console.log('🚀 Starting balance tracking...');
      
      // Initialize WebSocket connection
      await bitqueryService.initWebSocket();
      setIsConnected(true);

      // Add balance update listener
      bitqueryService.addBalanceListener(handleBalanceUpdate);

      // Subscribe to real-time updates
      subscriptionRef.current = bitqueryService.subscribeToBalanceUpdates(wallets, network);

      // Fetch initial balances
      await fetchBalances();

      // Set up periodic refresh
      intervalRef.current = setInterval(fetchBalances, 30000); // Every 30 seconds

      console.log('✅ Balance tracking started');
    } catch (error) {
      console.error('❌ Failed to start balance tracking:', error);
      setIsConnected(false);
    }
  }, [wallets, network, fetchBalances, handleBalanceUpdate]);

  const stopTracking = useCallback(() => {
    console.log('🛑 Stopping balance tracking...');
    
    if (subscriptionRef.current) {
      bitqueryService.unsubscribe(subscriptionRef.current);
      subscriptionRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    bitqueryService.removeBalanceListener(handleBalanceUpdate);
    setIsConnected(false);
  }, [handleBalanceUpdate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, [stopTracking]);

  return {
    balances,
    isConnected,
    lastUpdate,
    startTracking,
    stopTracking,
    fetchBalances
  };
};
