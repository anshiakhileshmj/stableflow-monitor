
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Book, Code, Zap, Shield, Globe, ChevronRight } from 'lucide-react';
import QuickStartSection from '@/components/docs/QuickStartSection';
import EndpointCard from '@/components/docs/EndpointCard';

const Docs = () => {
  const [activeSection, setActiveSection] = useState('quickstart');

  const sections = [
    { id: 'quickstart', name: 'Quickstart', icon: Zap },
    { id: 'authentication', name: 'Authentication', icon: Shield },
    { id: 'endpoints', name: 'Endpoints', icon: Code },
  ];

  const endpoints = [
    {
      id: 'analyze-wallet',
      name: 'Analyze Wallet',
      method: 'POST',
      path: '/analyze-wallet',
      description: 'Analyze a wallet address for risk assessment and transaction history across multiple blockchain networks',
      parameters: {
        walletAddress: { 
          type: 'string', 
          required: true, 
          description: 'The wallet address to analyze (supports Ethereum, Polygon, Avalanche, Arbitrum formats)' 
        },
        network: { 
          type: 'string', 
          required: false, 
          default: 'ethereum', 
          description: 'The blockchain network to analyze',
          enum: ['ethereum', 'polygon', 'avalanche', 'arbitrum', 'xrp']
        }
      },
      examples: {
        curl: `curl -X POST https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/analyze-wallet \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b8D81d92d2623C7245",
    "network": "ethereum"
  }'`,
        node: `const axios = require('axios');

const response = await axios.post(
  'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/analyze-wallet',
  {
    walletAddress: '0x742d35Cc6634C0532925a3b8D81d92d2623C7245',
    network: 'ethereum'
  },
  {
    headers: {
      'X-API-Key': 'your_api_key',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);`,
        python: `import requests

url = 'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/analyze-wallet'

headers = {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
}

data = {
    'walletAddress': '0x742d35Cc6634C0532925a3b8D81d92d2623C7245',
    'network': 'ethereum'
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
      },
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
    },
    {
      id: 'wallet-history',
      name: 'Get Wallet History',
      method: 'POST',
      path: '/wallet-history',
      description: 'Retrieve detailed transaction history for a wallet address within a specified date range',
      parameters: {
        walletAddress: { 
          type: 'string', 
          required: true, 
          description: 'The wallet address to get history for' 
        },
        startDate: { 
          type: 'string', 
          required: true, 
          description: 'Start date in ISO format (YYYY-MM-DD)' 
        },
        endDate: { 
          type: 'string', 
          required: true, 
          description: 'End date in ISO format (YYYY-MM-DD)' 
        },
        network: { 
          type: 'string', 
          required: false, 
          default: 'ethereum', 
          description: 'The blockchain network',
          enum: ['ethereum', 'polygon', 'avalanche', 'arbitrum', 'xrp']
        },
        limit: { 
          type: 'number', 
          required: false, 
          default: 100, 
          description: 'Maximum number of transactions to return (1-1000)' 
        }
      },
      examples: {
        curl: `curl -X POST https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/wallet-history \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "walletAddress": "0x742d35Cc6634C0532925a3b8D81d92d2623C7245",
    "startDate": "2024-01-01",
    "endDate": "2024-01-31",
    "network": "ethereum",
    "limit": 50
  }'`,
        node: `const axios = require('axios');

const response = await axios.post(
  'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/wallet-history',
  {
    walletAddress: '0x742d35Cc6634C0532925a3b8D81d92d2623C7245',
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    network: 'ethereum',
    limit: 50
  },
  {
    headers: {
      'X-API-Key': 'your_api_key',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);`,
        python: `import requests

url = 'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/wallet-history'

headers = {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
}

data = {
    'walletAddress': '0x742d35Cc6634C0532925a3b8D81d92d2623C7245',
    'startDate': '2024-01-01',
    'endDate': '2024-01-31',
    'network': 'ethereum',
    'limit': 50
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
      },
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
    },
    {
      id: 'stablecoin-transfers',
      name: 'Get Stablecoin Transfers',
      method: 'GET',
      path: '/stablecoin-transfers',
      description: 'Fetch recent stablecoin transfers across supported blockchain networks with real-time data',
      parameters: {
        network: { 
          type: 'string', 
          required: false, 
          default: 'all', 
          description: 'Filter by specific network or get all networks',
          enum: ['all', 'ethereum', 'polygon', 'avalanche', 'arbitrum']
        },
        limit: { 
          type: 'number', 
          required: false, 
          default: 50, 
          description: 'Maximum number of transfers to return (1-100)' 
        }
      },
      examples: {
        curl: `curl -X GET "https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/stablecoin-transfers?network=ethereum&limit=25" \\
  -H "X-API-Key: your_api_key"`,
        node: `const axios = require('axios');

const response = await axios.get(
  'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/stablecoin-transfers',
  {
    params: {
      network: 'ethereum',
      limit: 25
    },
    headers: {
      'X-API-Key': 'your_api_key'
    }
  }
);

console.log(response.data);`,
        python: `import requests

url = 'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/stablecoin-transfers'

headers = {
    'X-API-Key': 'your_api_key'
}

params = {
    'network': 'ethereum',
    'limit': 25
}

response = requests.get(url, headers=headers, params=params)
print(response.json())`
      },
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
    },
    {
      id: 'wallet-balances',
      name: 'Get Wallet Balances',
      method: 'POST',
      path: '/wallet-balances',
      description: 'Get current native and token balances for multiple wallet addresses simultaneously',
      parameters: {
        addresses: { 
          type: 'array', 
          required: true, 
          description: 'Array of wallet addresses to check balances for (max 10 addresses)' 
        },
        network: { 
          type: 'string', 
          required: false, 
          default: 'eth', 
          description: 'The blockchain network identifier',
          enum: ['eth', 'polygon', 'avalanche', 'arbitrum']
        }
      },
      examples: {
        curl: `curl -X POST https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/wallet-balances \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: your_api_key" \\
  -d '{
    "addresses": ["0x742d35Cc6634C0532925a3b8D81d92d2623C7245"],
    "network": "eth"
  }'`,
        node: `const axios = require('axios');

const response = await axios.post(
  'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/wallet-balances',
  {
    addresses: ['0x742d35Cc6634C0532925a3b8D81d92d2623C7245'],
    network: 'eth'
  },
  {
    headers: {
      'X-API-Key': 'your_api_key',
      'Content-Type': 'application/json'
    }
  }
);

console.log(response.data);`,
        python: `import requests

url = 'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway/wallet-balances'

headers = {
    'X-API-Key': 'your_api_key',
    'Content-Type': 'application/json'
}

data = {
    'addresses': ['0x742d35Cc6634C0532925a3b8D81d92d2623C7245'],
    'network': 'eth'
}

response = requests.post(url, headers=headers, json=data)
print(response.json())`
      },
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
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-4">
            <Book className="w-10 h-10 text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">API Documentation</h1>
              <p className="text-xl text-muted-foreground mt-2">
                Powerful blockchain analytics APIs for developers
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Navigation</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    {sections.map((section) => {
                      const IconComponent = section.icon;
                      return (
                        <button
                          key={section.id}
                          onClick={() => setActiveSection(section.id)}
                          className={`w-full text-left px-4 py-3 text-sm hover:bg-muted transition-colors flex items-center space-x-2 ${
                            activeSection === section.id ? 'bg-muted border-r-2 border-primary text-primary' : ''
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                          <span>{section.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Endpoints List */}
              {activeSection === 'endpoints' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Endpoints</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {endpoints.map((endpoint) => (
                        <a
                          key={endpoint.id}
                          href={`#${endpoint.id}`}
                          className="block px-4 py-2 text-sm hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span>{endpoint.name}</span>
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        </a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Quick Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="/dashboard">
                      <Zap className="w-4 h-4 mr-2" />
                      Get API Key
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <a href="mailto:support@example.com">
                      <Shield className="w-4 h-4 mr-2" />
                      Support
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'quickstart' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Getting Started</h2>
                  <p className="text-muted-foreground mb-6">
                    Welcome to the Blockchain Analytics API. Our REST API provides access to comprehensive 
                    blockchain data, wallet analysis, and real-time monitoring across multiple networks.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                      <CardHeader className="text-center">
                        <Shield className="w-12 h-12 text-primary mx-auto mb-2" />
                        <CardTitle className="text-lg">Secure & Reliable</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                          Enterprise-grade security with API key authentication and rate limiting
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="text-center">
                        <Zap className="w-12 h-12 text-primary mx-auto mb-2" />
                        <CardTitle className="text-lg">Real-time Data</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                          Live blockchain data with low latency and high availability
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="text-center">
                        <Globe className="w-12 h-12 text-primary mx-auto mb-2" />
                        <CardTitle className="text-lg">Multi-chain Support</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground text-center">
                          Ethereum, Polygon, Avalanche, Arbitrum, and XRP networks
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <QuickStartSection />
              </div>
            )}

            {activeSection === 'authentication' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Authentication</h2>
                <Card>
                  <CardHeader>
                    <CardTitle>API Key Authentication</CardTitle>
                    <CardDescription>
                      All API requests require authentication using your API key in the X-API-Key header.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Getting your API Key</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        You can create and manage your API keys in the <a href="/dashboard" className="text-primary hover:underline">developer dashboard</a>.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Using your API Key</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Include your API key in the request headers:
                      </p>
                      <div className="bg-muted p-4 rounded-lg">
                        <code className="text-sm">X-API-Key: your_api_key_here</code>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Rate Limits</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        API keys have rate limits based on your plan:
                      </p>
                      <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                        <li>• Free plan: 60 requests per minute</li>
                        <li>• Pro plan: 300 requests per minute</li>
                        <li>• Enterprise: Custom limits available</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'endpoints' && (
              <div>
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">API Reference</h2>
                  <p className="text-muted-foreground">
                    Complete reference for all available endpoints with detailed parameters and examples.
                  </p>
                </div>

                <div className="space-y-8">
                  {endpoints.map((endpoint) => (
                    <div key={endpoint.id} id={endpoint.id}>
                      <EndpointCard {...endpoint} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
