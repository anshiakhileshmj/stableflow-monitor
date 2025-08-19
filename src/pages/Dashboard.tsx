import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, BarChart3, Settings, Code } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import ApiKeysManager from '@/components/ApiKeysManager';

interface ApiUsage {
  endpoint: string;
  status_code: number;
  response_time_ms: number;
  timestamp: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [usage, setUsage] = useState<ApiUsage[]>([]);

  useEffect(() => {
    if (user) {
      fetchUsage();
    }
  }, [user]);

  const fetchUsage = async () => {
    try {
      const { data, error } = await supabase
        .from('api_usage')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) throw error;
      setUsage(data || []);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access the developer dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/auth">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold text-foreground">Developer Dashboard</h1>
                <p className="text-muted-foreground">Manage your API keys and monitor usage</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <a href="/docs">View Documentation</a>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="keys" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="usage">Usage Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* API Keys Tab */}
          <TabsContent value="keys" className="space-y-6">
            <ApiKeysManager />
          </TabsContent>

          {/* Usage Analytics Tab */}
          <TabsContent value="usage" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Usage Analytics</h2>
              <p className="text-muted-foreground">Monitor your API usage and performance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usage.length}</div>
                  <p className="text-sm text-muted-foreground">Last 100 requests</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {usage.length > 0 
                      ? Math.round(usage.reduce((acc, u) => acc + (u.response_time_ms || 0), 0) / usage.length)
                      : 0
                    }ms
                  </div>
                  <p className="text-sm text-muted-foreground">Across all endpoints</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {usage.length > 0 
                      ? Math.round((usage.filter(u => u.status_code >= 200 && u.status_code < 300).length / usage.length) * 100)
                      : 0
                    }%
                  </div>
                  <p className="text-sm text-muted-foreground">2xx status codes</p>
                </CardContent>
              </Card>
            </div>

            {usage.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {usage.slice(0, 10).map((req, idx) => (
                      <div key={idx} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-2">
                          <Badge variant={req.status_code >= 200 && req.status_code < 300 ? 'default' : 'destructive'}>
                            {req.status_code}
                          </Badge>
                          <code className="text-sm">{req.endpoint}</code>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(req.timestamp).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold">Developer Profile</h2>
              <p className="text-muted-foreground">Manage your account settings</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={user?.email || ''} disabled />
                </div>
                <div>
                  <Label>User ID</Label>
                  <div className="flex items-center space-x-2">
                    <Input value={user?.id || ''} disabled className="font-mono text-sm" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(user?.id || '')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plan Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Current Plan</span>
                    <Badge>Free</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Monthly Limit</span>
                    <span className="text-muted-foreground">1,000 requests</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Rate Limit</span>
                    <span className="text-muted-foreground">60 requests/minute</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
