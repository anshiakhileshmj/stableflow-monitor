
import { supabase } from '@/integrations/supabase/client';

export interface FeatureHit {
  key: string;
  base: number;
  occurredAt: string;
  critical?: boolean;
  details?: Record<string, any>;
}

export interface CheckRequest {
  chain: string;
  to: string;
  from?: string;
  value?: string;
  asset?: string;
  features?: FeatureHit[];
}

export interface RelayRequest {
  chain: string;
  rawTx: string;
  idempotencyKey?: string;
  features?: FeatureHit[];
}

export interface RelayResponse {
  allowed: boolean;
  risk_band: string;
  risk_score: number;
  txHash?: string;
  reasons?: string[];
  status?: string;
}

class RelayApiClient {
  private baseUrl: string;
  private apiKey: string | null = null;

  constructor(baseUrl: string = 'https://resumeak.onrender.com') {
    this.baseUrl = baseUrl;
  }

  async setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async makeRequest(endpoint: string, data: any): Promise<any> {
    if (!this.apiKey) {
      throw new Error('API key not set. Please configure your relay API key.');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Relay API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  async checkTransaction(request: CheckRequest): Promise<RelayResponse> {
    return this.makeRequest('/v1/check', request);
  }

  async relayTransaction(request: RelayRequest): Promise<RelayResponse> {
    return this.makeRequest('/v1/relay', request);
  }

  // Convenience method to check if an address is high risk
  async checkAddressRisk(address: string, chain: string = 'ethereum'): Promise<RelayResponse> {
    return this.checkTransaction({
      chain,
      to: address,
    });
  }

  // Method to add common risk features
  createFeatureHits(address: string, analysisData?: any): FeatureHit[] {
    const features: FeatureHit[] = [];
    const now = new Date().toISOString();

    if (analysisData) {
      // Add mixer detection if found
      if (analysisData.mixerInteraction) {
        features.push({
          key: 'mixer_direct',
          base: 40,
          occurredAt: now,
          critical: true,
          details: {
            counterparty: analysisData.mixerAddress,
            valueUSD: analysisData.mixerValue || 0
          }
        });
      }

      // Add high value transaction flag
      if (analysisData.maxTransactionValue > 10000) {
        features.push({
          key: 'value_gt_10k',
          base: 10,
          occurredAt: now,
          details: { maxValue: analysisData.maxTransactionValue }
        });
      }

      // Add wallet age factor
      if (analysisData.walletAgeDays < 7) {
        features.push({
          key: 'wallet_age_lt_7d',
          base: 20,
          occurredAt: now,
          details: { ageDays: analysisData.walletAgeDays }
        });
      }

      // Add high velocity flag
      if (analysisData.dailyTxCount > 100) {
        features.push({
          key: 'velocity_high',
          base: 15,
          occurredAt: now,
          details: { dailyTxCount: analysisData.dailyTxCount }
        });
      }
    }

    return features;
  }
}

export const relayClient = new RelayApiClient();
