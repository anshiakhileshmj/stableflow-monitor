
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Plus, Eye, EyeOff, Trash2, Key, BarChart3, Settings, Code } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface ApiKey {
  id: string;
  name: string;
  key_hash: string;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  is_active: boolean;
  rate_limit_per_minute: number;
}

interface ApiUsage {
  endpoint: string;
  status_code: number;
  response_time_ms: number;
  timestamp: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usage, setUsage] = useState<ApiUsage[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyVisible, setNewKeyVisible] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchApiKeys();
      fetchUsage();
    }
  }, [user]);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

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

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    try {
      // Generate new API key
      const { data: keyData, error: keyError } = await supabase.rpc('generate_api_key');
      if (keyError) throw keyError;

      const newKey = keyData as string;
      
      // Hash the key for storage
      const encoder = new TextEncoder();
      const keyBytes = encoder.encode(newKey);
      const hashBuffer = await crypto.subtle.digest('SHA-256', keyBytes);
      const hashArray = new Uint8Array(hashBuffer);
      const keyHash = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');

      // Store the key in database
      const { error: insertError } = await supabase
        .from('api_keys')
        .insert({
          name: newKeyName.trim(),
          key_hash: keyHash,
          user_id: user?.id
        });

      if (insertError) throw insertError;

      setNewKeyVisible(newKey);
      setNewKeyName('');
      fetchApiKeys();
      toast.success('API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
      
      fetchApiKeys();
      toast.success('API key deleted');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
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
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">API Keys</h2>
                <p className="text-muted-foreground">Create and manage your API keys</p>
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create API Key</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New API Key</DialogTitle>
                    <DialogDescription>
                      Give your API key a descriptive name to help you identify it later.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="keyName">Key Name</Label>
                      <Input
                        id="keyName"
                        placeholder="e.g., Production App, Development"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                      />
                    </div>
                    {newKeyVisible && (
                      <div className="space-y-2">
                        <Label>Your New API Key (Save this now!)</Label>
                        <div className="flex items-center space-x-2">
                          <Input value={newKeyVisible} readOnly className="font-mono text-sm" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(newKeyVisible)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-destructive">
                          This key will only be shown once. Make sure to copy it now!
                        </p>
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <Button onClick={createApiKey} disabled={!newKeyName.trim()}>
                        Create Key
                      </Button>
                      {newKeyVisible && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setIsCreateDialogOpen(false);
                            setNewKeyVisible('');
                            setNewKeyName('');
                          }}
                        >
                          Done
                        </Button>
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {loading ? (
                <div className="text-center py-8">Loading...</div>
              ) : apiKeys.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center">
                    <Key className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">No API keys yet</h3>
                    <p className="text-muted-foreground mb-4">Create your first API key to get started</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create API Key
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                apiKeys.map((key) => (
                  <Card key={key.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold">{key.name}</h3>
                            <Badge variant={key.is_active ? 'default' : 'secondary'}>
                              {key.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                              {visibleKeys.has(key.id) 
                                ? `${key.key_hash.substring(0, 8)}...` 
                                : '••••••••••••••••'
                              }
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(key.id)}
                            >
                              {visibleKeys.has(key.id) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <div>Created: {new Date(key.created_at).toLocaleDateString()}</div>
                            <div>
                              Last used: {key.last_used_at 
                                ? new Date(key.last_used_at).toLocaleDateString() 
                                : 'Never'
                              }
                            </div>
                            <div>Rate limit: {key.rate_limit_per_minute} requests/minute</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteApiKey(key.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
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
