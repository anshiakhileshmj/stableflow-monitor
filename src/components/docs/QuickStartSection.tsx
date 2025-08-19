
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy, Zap } from 'lucide-react';
import { toast } from 'sonner';

const QuickStartSection = () => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-primary" />
            <span>Developer Quickstart</span>
          </CardTitle>
          <CardDescription>
            Learn how to make your first blockchain analytics API request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">1. Create an API Key</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Create an API key in the dashboard here, which you'll use to securely access the API.
            </p>
            <div className="bg-muted p-3 rounded-lg">
              <code className="text-sm">Store the key as a managed secret and pass it to the SDKs either as an environment variable via an .env file, or directly in your app's configuration depending on your preference.</code>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-3">2. Install the SDK</h4>
            <p className="text-sm text-muted-foreground mb-3">
              We'll also use the axios library for HTTP requests.
            </p>
            <Tabs defaultValue="node" className="w-full">
              <TabsList>
                <TabsTrigger value="node">Node.js</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="node">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Terminal</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('npm install axios')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <code className="text-sm">npm install axios</code>
                </div>
              </TabsContent>
              <TabsContent value="python">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Terminal</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('pip install requests')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <code className="text-sm">pip install requests</code>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h4 className="font-semibold mb-3">3. Make your first request</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Create a new file named <code>example.js</code> or <code>example.py</code>, depending on your language of choice and add the following code:
            </p>
            <Tabs defaultValue="node" className="w-full">
              <TabsList>
                <TabsTrigger value="node">Node.js</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="node">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">example.js</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway';

const analyzeWallet = async () => {
  try {
    const response = await axios.post(\`\${BASE_URL}/analyze-wallet\`, {
      walletAddress: '0x742d35Cc6634C0532925a3b8D81d92d2623C7245',
      network: 'ethereum'
    }, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

analyzeWallet();`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
{`const axios = require('axios');

const API_KEY = 'your_api_key_here';
const BASE_URL = 'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway';

const analyzeWallet = async () => {
  try {
    const response = await axios.post(\`\${BASE_URL}/analyze-wallet\`, {
      walletAddress: '0x742d35Cc6634C0532925a3b8D81d92d2623C7245',
      network: 'ethereum'
    }, {
      headers: {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

analyzeWallet();`}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="python">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">example.py</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(`import requests
import json

API_KEY = 'your_api_key_here'
BASE_URL = 'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway'

def analyze_wallet():
    url = f'{BASE_URL}/analyze-wallet'
    
    headers = {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }
    
    data = {
        'walletAddress': '0x742d35Cc6634C0532925a3b8D81d92d2623C7245',
        'network': 'ethereum'
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.RequestException as error:
        print(f'Error: {error}')

if __name__ == '__main__':
    analyze_wallet()`)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">
{`import requests
import json

API_KEY = 'your_api_key_here'
BASE_URL = 'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway'

def analyze_wallet():
    url = f'{BASE_URL}/analyze-wallet'
    
    headers = {
        'X-API-Key': API_KEY,
        'Content-Type': 'application/json'
    }
    
    data = {
        'walletAddress': '0x742d35Cc6634C0532925a3b8D81d92d2623C7245',
        'network': 'ethereum'
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        print(json.dumps(response.json(), indent=2))
    except requests.exceptions.RequestException as error:
        print(f'Error: {error}')

if __name__ == '__main__':
    analyze_wallet()`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <h4 className="font-semibold mb-3">4. Run the code</h4>
            <Tabs defaultValue="node" className="w-full">
              <TabsList>
                <TabsTrigger value="node">Node.js</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              <TabsContent value="node">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Terminal</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('node example.js')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <code className="text-sm">node example.js</code>
                </div>
              </TabsContent>
              <TabsContent value="python">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Terminal</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard('python example.py')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <code className="text-sm">python example.py</code>
                </div>
              </TabsContent>
            </Tabs>
            <p className="text-sm text-muted-foreground mt-3">
              You should see the wallet analysis data returned as JSON.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStartSection;
