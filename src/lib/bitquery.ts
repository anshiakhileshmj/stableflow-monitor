import { GraphQLClient } from 'graphql-request';
import {
  RecentStablecoinTransfersDocument,
  type RecentStablecoinTransfersQuery,
  type RecentStablecoinTransfersQueryVariables,
  AnalyzeWalletDocument,
  type AnalyzeWalletQuery,
  type AnalyzeWalletQueryVariables,
} from './schema';
import { bitqueryBalanceService } from './bitquery-balance';

const endpoint = 'https://graphql.bitquery.io/';

class BitqueryClient {
  private client: GraphQLClient;

  constructor(apiKey: string) {
    this.client = new GraphQLClient(endpoint, {
      headers: {
        'X-API-KEY': apiKey,
      },
    });
  }

  async getRecentStablecoinTransfers(variables: RecentStablecoinTransfersQueryVariables): Promise<RecentStablecoinTransfersQuery> {
    return this.client.request(RecentStablecoinTransfersDocument, variables);
  }

  async analyzeWallet(variables: AnalyzeWalletQueryVariables): Promise<AnalyzeWalletQuery> {
    return this.client.request(AnalyzeWalletDocument, variables);
  }

  // Add balance tracking methods
  async getCurrentBalances(wallets: any[], network: string = 'eth') {
    return bitqueryBalanceService.getCurrentBalances(wallets, network);
  }

  subscribeToBalanceUpdates(wallets: any[], network: string = 'eth') {
    return bitqueryBalanceService.subscribeToBalanceUpdates(wallets, network);
  }

  addBalanceListener(callback: (data: any) => void) {
    return bitqueryBalanceService.addBalanceListener(callback);
  }

  removeBalanceListener(callback: (data: any) => void) {
    bitqueryBalanceService.removeBalanceListener(callback);
  }

  unsubscribe(subscriptionId: string) {
    bitqueryBalanceService.unsubscribe(subscriptionId);
  }

  async initBalanceWebSocket() {
    return bitqueryBalanceService.initWebSocket();
  }

  // Update the main initWebSocket method to include balance WebSocket
  async initWebSocket() {
    // Also initialize balance WebSocket
    try {
      await this.initBalanceWebSocket();
    } catch (error) {
      console.error('Failed to initialize balance WebSocket:', error);
    }
  }
}

export const bitqueryClient = new BitqueryClient(process.env.NEXT_PUBLIC_BITQUERY_API_KEY as string);
