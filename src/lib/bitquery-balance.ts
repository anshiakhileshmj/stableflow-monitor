
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

  // Initialize WebSocket connection
  async initWebSocket(): Promise<void> {
    if (this.wsConnection?.readyState === WebSocket.OPEN) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const wsUrl = 'wss://streaming.bitquery.io/graphql';
      this.wsConnection = new WebSocket(wsUrl, ['graphql-ws']);

      this.wsConnection.onopen = () => {
        console.log('🔗 Bitquery Balance WebSocket connected');
        this.wsConnection?.send(JSON.stringify({
          type: 'connection_init',
          payload: {
            headers: {
              'X-API-KEY': import.meta.env.VITE_BITQUERY_API_KEY || '',
              'Authorization': `Bearer ${import.meta.env.VITE_BITQUERY_TOKEN || ''}`
            }
          }
        }));
      };

      this.wsConnection.onmessage = (event) => {
        const message = JSON.parse(event.data);
        
        switch (message.type) {
          case 'connection_ack':
            console.log('✅ Balance WebSocket connection acknowledged');
            resolve();
            break;
            
          case 'data':
            this.handleBalanceUpdate(message);
            break;
            
          case 'error':
            console.error('❌ Balance WebSocket error:', message.payload);
            break;
        }
      };

      this.wsConnection.onerror = (error) => {
        console.error('Balance WebSocket error:', error);
        reject(error);
      };

      this.wsConnection.onclose = () => {
        console.log('Balance WebSocket connection closed');
        this.wsConnection = null;
      };
    });
  }

  // Get current balances for multiple wallets
  async getCurrentBalances(wallets: WalletData[], network: string = 'eth'): Promise<Record<string, WalletBalance>> {
    const addresses = wallets.map(w => w.address.toLowerCase());
    
    const query = `
      query GetWalletBalances($addresses: [String!]!) {
        EVM(network: ${network}, dataset: combined) {
          BalanceUpdates(
            where: {
              BalanceUpdate: {
                Address: { in: $addresses }
              }
            }
            limit: { count: 1000 }
          ) {
            BalanceUpdate {
              Address
              Amount
            }
            Currency {
              Name
              Symbol
              SmartContract
              Decimals
            }
            sum: sum(of: BalanceUpdate_Amount)
          }
        }
      }
    `;

    try {
      const response = await fetch('https://streaming.bitquery.io/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': import.meta.env.VITE_BITQUERY_API_KEY || '',
          'Authorization': `Bearer ${import.meta.env.VITE_BITQUERY_TOKEN || ''}`
        },
        body: JSON.stringify({
          query,
          variables: { addresses }
        })
      });

      const result = await response.json();
      
      if (result.errors) {
        console.error('Balance query errors:', result.errors);
        throw new Error(result.errors[0].message);
      }

      return this.processBalanceData(result.data?.EVM?.BalanceUpdates || []);
    } catch (error) {
      console.error('❌ Balance query failed:', error);
      throw error;
    }
  }

  // Subscribe to real-time balance updates
  subscribeToBalanceUpdates(wallets: WalletData[], network: string = 'eth'): string {
    if (!this.wsConnection || this.wsConnection.readyState !== WebSocket.OPEN) {
      console.warn('WebSocket not connected for balance updates');
      return '';
    }

    const addresses = wallets.map(w => w.address.toLowerCase());
    const subscriptionId = `balance-updates-${Date.now()}`;

    const subscription = `
      subscription BalanceUpdates($addresses: [String!]!) {
        EVM(network: ${network}) {
          BalanceUpdates(
            where: {
              BalanceUpdate: {
                Address: { in: $addresses }
              }
            }
          ) {
            BalanceUpdate {
              Address
              Amount
              Type
            }
            Currency {
              Name
              Symbol
              SmartContract
              Decimals
            }
            Block {
              Time
            }
            Transaction {
              Hash
            }
          }
        }
      }
    `;

    this.wsConnection.send(JSON.stringify({
      type: 'start',
      id: subscriptionId,
      payload: {
        query: subscription,
        variables: { addresses }
      }
    }));

    this.subscriptions.set(subscriptionId, { addresses, network });
    return subscriptionId;
  }

  // Process balance data into organized structure
  private processBalanceData(balanceUpdates: any[]): Record<string, WalletBalance> {
    const balancesByAddress: Record<string, WalletBalance> = {};

    balanceUpdates.forEach(update => {
      const address = update.BalanceUpdate.Address.toLowerCase();
      const isNative = !update.Currency.SmartContract;
      
      if (!balancesByAddress[address]) {
        balancesByAddress[address] = {
          address,
          native: { amount: '0' },
          tokens: [],
          lastUpdated: new Date().toISOString()
        };
      }

      if (isNative) {
        balancesByAddress[address].native = {
          amount: update.sum || '0',
          currency: update.Currency
        };
      } else {
        const existingTokenIndex = balancesByAddress[address].tokens
          .findIndex(t => t.currency.smartContract === update.Currency.SmartContract);

        const tokenBalance = {
          amount: update.sum || '0',
          currency: update.Currency
        };

        if (existingTokenIndex >= 0) {
          balancesByAddress[address].tokens[existingTokenIndex] = tokenBalance;
        } else {
          balancesByAddress[address].tokens.push(tokenBalance);
        }
      }
    });

    return balancesByAddress;
  }

  // Handle real-time balance updates
  private handleBalanceUpdate(message: any): void {
    const balanceUpdate = message.payload?.data?.EVM?.BalanceUpdates?.[0];
    
    if (!balanceUpdate) return;

    const address = balanceUpdate.BalanceUpdate.Address.toLowerCase();
    const updateData = {
      address,
      amount: balanceUpdate.BalanceUpdate.Amount,
      currency: balanceUpdate.Currency,
      timestamp: balanceUpdate.Block.Time,
      txHash: balanceUpdate.Transaction.Hash
    };

    // Notify all listeners
    this.listeners.forEach(listener => {
      listener(updateData);
    });
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
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({
        type: 'stop',
        id: subscriptionId
      }));
    }
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
