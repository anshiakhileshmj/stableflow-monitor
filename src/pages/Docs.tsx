
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Book, Code, Zap, Shield, Globe } from 'lucide-react';
import { toast } from 'sonner';

interface ApiParameter {
  type: string;
  required: boolean;
  description: string;
  default?: string | number;
}

interface ApiEndpoint {
  id: string;
  name: string;
  method: string;
  path: string;
  category: string;
  description: string;
  parameters: Record<string, ApiParameter>;
  example: {
    request: string;
    response: string;
  };
}

const Docs = () => {
  const [selectedEndpoint, setSelectedEndpoint] = useState('analyze-wallet');

  const apiEndpoints: ApiEndpoint[] = [
    {
      id: 'analyze-wallet',
      name: 'Analyze Wallet',
      method: 'POST',
      path: '/analyze-wallet',
      category: 'Wallet Analysis',
      description: 'Analyze a wallet address for risk assessment and transaction history',
      parameters: {
        walletAddress: { type: 'string', required: true, description: 'The wallet address to analyze' },
        network: { type: 'string', required: false, default: 'ethereum', description: 'The blockchain network' }
      },
      example: {
        request: `curl -X POST https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/analyze-wallet \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b8D81d92d2623C7245",
    "network": "ethereum"
  }'`,
        response: `{
  "walletAddress": "0x742d35Cc6634C0532925a3b8D81d92d2623C7245",
  "network": "ethereum",
  "balance": "1.234567",
  "transactions": [...],
  "riskAnalysis": {
    "totalTransactions": 150,
    "failedTransactions": 2,
    "riskScore": 3,
    "riskLevel": "LOW"
  }
}`
      }
    },
    {
      id: 'wallet-history',
      name: 'Get Wallet History',
      method: 'POST',
      path: '/wallet-history',
      category: 'Transaction History',
      description: 'Retrieve transaction history for a wallet address within a date range',
      parameters: {
        walletAddress: { type: 'string', required: true, description: 'The wallet address' },
        startDate: { type: 'string', required: true, description: 'Start date (ISO format)' },
        endDate: { type: 'string', required: true, description: 'End date (ISO format)' },
        network: { type: 'string', required: false, default: 'ethereum', description: 'The blockchain network' },
        limit: { type: 'number', required: false, default: 100, description: 'Maximum number of transactions' }
      },
      example: {
        request: `curl -X POST https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/wallet-history \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b8D81d92d2623C7245",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "network": "ethereum"
  }'`,
        response: `{
  "data": {
    "EVM": {
      "Transactions": [
        {
          "Transaction": {
            "Hash": "0x...",
            "From": "0x...",
            "To": "0x...",
            "Value": "1000000000000000000"
          },
          "Block": {
            "Time": "2024-01-15T10:30:00Z"
          }
        }
      ]
    }
  }
}`
      }
    },
    {
      id: 'stablecoin-transfers',
      name: 'Get Stablecoin Transfers',
      method: 'GET',
      path: '/stablecoin-transfers',
      category: 'Market Data',
      description: 'Fetch recent stablecoin transfers across networks',
      parameters: {
        network: { type: 'string', required: false, default: 'all', description: 'Filter by specific network' },
        limit: { type: 'number', required: false, default: 50, description: 'Maximum number of transfers' }
      },
      example: {
        request: `curl -X GET "https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/stablecoin-transfers?network=ethereum&limit=25" \\
  -H "X-API-Key: your_api_key"`,
        response: `{
  "transfers": [
    {
      "tokenSymbol": "USDC",
      "tokenName": "USD Coin",
      "amount": "10000",
      "senderAddress": "0x...",
      "receiverAddress": "0x...",
      "timestamp": "2024-01-01T00:00:00Z",
      "network": "ethereum"
    }
  ]
}`
      }
    },
    {
      id: 'wallet-balances',
      name: 'Get Wallet Balances',
      method: 'POST',
      path: '/wallet-balances',
      category: 'Balance Tracking',
      description: 'Get current balances for multiple wallet addresses',
      parameters: {
        addresses: { type: 'array', required: true, description: 'Array of wallet addresses' },
        network: { type: 'string', required: false, default: 'eth', description: 'The blockchain network' }
      },
      example: {
        request: `curl -X POST https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/wallet-balances \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "addresses": ["0x742d35Cc6634C0532925a3b8D81d92d2623C7245"],
    "network": "eth"
  }'`,
        response: `{
  "0x742d35cc6634c0532925a3b8d81d92d2623c7245": {
    "address": "0x742d35cc6634c0532925a3b8d81d92d2623c7245",
    "native": {
      "amount": "1234567890000000000",
      "currency": {
        "Name": "Ether",
        "Symbol": "ETH"
      }
    },
    "tokens": []
  }
}`
      }
    }
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const currentEndpoint = apiEndpoints.find(ep => ep.id === selectedEndpoint);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Book className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">API Documentation</h1>
              <p className="text-muted-foreground">Powerful blockchain analytics APIs for developers</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">API Reference</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2">
                    {apiEndpoints.map((endpoint) => (
                      <button
                        key={endpoint.id}
                        onClick={() => setSelectedEndpoint(endpoint.id)}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors ${
                          selectedEndpoint === endpoint.id ? 'bg-muted border-r-2 border-primary' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{endpoint.name}</span>
                          <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'} className="text-xs">
                            {endpoint.method}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Start */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Quick Start</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-primary" />
                    <span className="text-sm">Get API Key</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Code className="w-4 h-4 text-primary" />
                    <span className="text-sm">Make Requests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="text-sm">Handle Responses</span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href="/dashboard">Get Started</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Globe className="w-5 h-5" />
                    <span>Blockchain Analytics API</span>
                  </CardTitle>
                  <CardDescription>
                    Access powerful blockchain analytics, wallet analysis, and real-time monitoring through our REST API.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Secure</h3>
                      <p className="text-sm text-muted-foreground">API key authentication with rate limiting</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Fast</h3>
                      <p className="text-sm text-muted-foreground">Real-time data with low latency</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Globe className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold">Multi-chain</h3>
                      <p className="text-sm text-muted-foreground">Support for Ethereum, Polygon, Avalanche & more</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Authentication */}
            <div className="mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>
                    All API requests require authentication using your API key in the X-API-Key header.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Example Request</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard('curl -H "X-API-Key: your_api_key"')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                    <code className="text-sm">curl -H "X-API-Key: your_api_key"</code>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Endpoint Details */}
            {currentEndpoint && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <Badge variant={currentEndpoint.method === 'GET' ? 'secondary' : 'default'}>
                          {currentEndpoint.method}
                        </Badge>
                        <span>{currentEndpoint.name}</span>
                      </CardTitle>
                      <CardDescription className="mt-2">{currentEndpoint.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="parameters" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="example">Example</TabsTrigger>
                      <TabsTrigger value="response">Response</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="parameters" className="space-y-4">
                      <div className="space-y-4">
                        {Object.entries(currentEndpoint.parameters).map(([key, param]) => (
                          <div key={key} className="border rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <code className="text-sm bg-muted px-2 py-1 rounded">{key}</code>
                              <Badge variant={param.required ? 'destructive' : 'secondary'} className="text-xs">
                                {param.required ? 'required' : 'optional'}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{param.type}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">{param.description}</p>
                            {param.default !== undefined && (
                              <p className="text-xs text-muted-foreground mt-1">Default: {param.default}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="example">
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">Request</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(currentEndpoint.example.request)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                            {currentEndpoint.example.request}
                          </pre>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="response">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">Response</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(currentEndpoint.example.response)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
                          {currentEndpoint.example.response}
                        </pre>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
