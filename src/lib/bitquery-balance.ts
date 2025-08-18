
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
  address: string;
  network: string;
}

class BitqueryBalanceService {
  private wsConnection: WebSocket | null = null;
  private subscriptions = new Map<string, any>();
  private listeners = new Set<(data: any) => void>();

  // Get current balances using Supabase edge function
  async getCurrentBalances(wallets: WalletData[], network: string = 'eth'): Promise<Record<string, WalletBalance>> {
    try {
      const addresses = wallets.map(w => w.address);
      
      console.log('🔍 Calling edge function with addresses:', addresses);
      
      const response = await fetch(`https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/bitquery-balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRud2duYW5lZWpra25va3dwa3dhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNDQ0NTEsImV4cCI6MjA3MDkyMDQ1MX0.G9NSvp59zg0pNEPWA8c5qECnfvri9MYUEJyqpUk2ILQ`
        },
        body: JSON.stringify({
          addresses,
          network
        })
      });

      console.log('📡 Edge function response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Edge function error response:', errorText);
        throw new Error(`Edge function failed: ${response.status} - ${errorText}`);
      }

      const balanceData = await response.json();
      console.log('✅ Edge function returned data:', balanceData);
      return balanceData;
    } catch (error) {
      console.error('❌ Balance query failed:', error);
      // Return empty balances instead of throwing
      const emptyBalances: Record<string, WalletBalance> = {};
      wallets.forEach(wallet => {
        emptyBalances[wallet.address.toLowerCase()] = {
          address: wallet.address.toLowerCase(),
          native: { amount: '0' },
          tokens: [],
          lastUpdated: new Date().toISOString()
        };
      });
      return emptyBalances;
    }
  }

  // Initialize WebSocket connection (simplified for now)
  async initWebSocket(): Promise<void> {
    console.log('WebSocket functionality requires additional setup with Supabase secrets');
    return Promise.resolve();
  }

  // Subscribe to real-time balance updates (placeholder)
  subscribeToBalanceUpdates(wallets: WalletData[], network: string = 'eth'): string {
    console.log('Real-time updates will be implemented with WebSocket support');
    return `subscription-${Date.now()}`;
  }

  // Add balance update listener
  addBalanceListener(callback: (data: any) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  // Remove balance update listener
  removeBalanceListener(callback: (data: any) => void): void {
    this.listeners.delete(callback);
  }

  // Unsubscribe from real-time updates
  unsubscribe(subscriptionId: string): void {
    this.subscriptions.delete(subscriptionId);
  }

  // Close WebSocket connection
  disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close();
      this.wsConnection = null;
    }
    this.subscriptions.clear();
    this.listeners.clear();
  }
}

export const bitqueryBalanceService = new BitqueryBalanceService();
