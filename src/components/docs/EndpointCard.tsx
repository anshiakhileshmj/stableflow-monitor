
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface Parameter {
  type: string;
  required: boolean;
  description: string;
  default?: string | number;
  enum?: string[];
}

interface EndpointCardProps {
  id: string;
  name: string;
  method: string;
  path: string;
  description: string;
  parameters: Record<string, Parameter>;
  examples: {
    curl: string;
    node: string;
    python: string;
  };
  response: string;
}

const EndpointCard: React.FC<EndpointCardProps> = ({
  name,
  method,
  path,
  description,
  parameters,
  examples,
  response
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const baseUrl = 'https://tnwgnaneejkknokwpkwa.supabase.co/functions/v1/api-gateway';

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge variant={method === 'GET' ? 'secondary' : 'default'} className="font-mono">
              {method}
            </Badge>
            <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{baseUrl}{path}</code>
          </div>
        </div>
        <CardTitle className="mt-4">{name}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="parameters" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="parameters">Parameters</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="response">Response</TabsTrigger>
            <TabsTrigger value="try">Try it</TabsTrigger>
          </TabsList>

          <TabsContent value="parameters" className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">Headers</h4>
              <div className="border rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <code className="text-sm bg-muted px-2 py-1 rounded font-mono">X-API-Key</code>
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                  <span className="text-xs text-muted-foreground">string</span>
                </div>
                <p className="text-sm text-muted-foreground">Your API key for authentication</p>
              </div>
            </div>

            {method !== 'GET' && (
              <div>
                <h4 className="font-semibold mb-3">Body parameters</h4>
                <div className="space-y-4">
                  {Object.entries(parameters).map(([key, param]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{key}</code>
                        <Badge variant={param.required ? 'destructive' : 'secondary'} className="text-xs">
                          {param.required ? 'Required' : 'Optional'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{param.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{param.description}</p>
                      {param.default !== undefined && (
                        <p className="text-xs text-muted-foreground">Default: <code>{param.default}</code></p>
                      )}
                      {param.enum && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Supported values:</p>
                          <div className="flex flex-wrap gap-1">
                            {param.enum.map((value) => (
                              <code key={value} className="text-xs bg-muted px-2 py-1 rounded">{value}</code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {method === 'GET' && (
              <div>
                <h4 className="font-semibold mb-3">Query parameters</h4>
                <div className="space-y-4">
                  {Object.entries(parameters).map(([key, param]) => (
                    <div key={key} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{key}</code>
                        <Badge variant={param.required ? 'destructive' : 'secondary'} className="text-xs">
                          {param.required ? 'Required' : 'Optional'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{param.type}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{param.description}</p>
                      {param.default !== undefined && (
                        <p className="text-xs text-muted-foreground">Default: <code>{param.default}</code></p>
                      )}
                      {param.enum && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1">Supported values:</p>
                          <div className="flex flex-wrap gap-1">
                            {param.enum.map((value) => (
                              <code key={value} className="text-xs bg-muted px-2 py-1 rounded">{value}</code>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="examples">
            <Tabs defaultValue="curl" className="w-full">
              <TabsList>
                <TabsTrigger value="curl">cURL</TabsTrigger>
                <TabsTrigger value="node">Node.js</TabsTrigger>
                <TabsTrigger value="python">Python</TabsTrigger>
              </TabsList>
              
              <TabsContent value="curl">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">cURL</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(examples.curl)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto whitespace-pre-wrap">{examples.curl}</pre>
                </div>
              </TabsContent>

              <TabsContent value="node">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Node.js</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(examples.node)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">{examples.node}</pre>
                </div>
              </TabsContent>

              <TabsContent value="python">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Python</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(examples.python)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <pre className="text-sm overflow-x-auto">{examples.python}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="response">
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Response</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(response)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <pre className="text-sm overflow-x-auto">{response}</pre>
            </div>
          </TabsContent>

          <TabsContent value="try">
            <div className="bg-muted/50 border border-dashed rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">Interactive API testing coming soon</p>
              <Button variant="outline" disabled>Try it</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EndpointCard;
