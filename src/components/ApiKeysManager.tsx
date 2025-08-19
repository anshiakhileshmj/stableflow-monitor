
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Plus, Eye, EyeOff, Trash2, Search, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';
import { useApiKeys } from '@/hooks/useApiKeys';

const ApiKeysManager = () => {
  const { apiKeys, loading, createApiKey, deleteApiKey, toggleApiKey } = useApiKeys();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyVisible, setNewKeyVisible] = useState('');
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const filteredApiKeys = apiKeys.filter(key => 
    key.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a key name');
      return;
    }

    const newKey = await createApiKey(newKeyName.trim());
    if (newKey) {
      setNewKeyVisible(newKey);
      setNewKeyName('');
    }
  };

  const handleDeleteApiKey = async (keyId: string) => {
    await deleteApiKey(keyId);
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

  const maskApiKey = (key: string) => {
    return `${key.substring(0, 8)}${'•'.repeat(20)}${key.substring(key.length - 4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">API Keys</h2>
          <p className="text-muted-foreground">
            An API key allows you to authenticate with our API and access its functionalities programmatically. 
            You can create multiple API keys with different permissions. For more information, please refer to the{' '}
            <a href="/docs" className="text-primary hover:underline">API documentation</a>.
          </p>
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
                <Button onClick={handleCreateApiKey} disabled={!newKeyName.trim()}>
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

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Search your API Keys..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* User API Keys Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">User API Keys</h3>
        
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : filteredApiKeys.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  <Copy className="w-6 h-6 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">
                    {searchQuery ? 'No matching API keys' : 'No API keys yet'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery 
                      ? 'Try adjusting your search terms'
                      : 'Create your first API key to get started'
                    }
                  </p>
                  {!searchQuery && (
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create API Key
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredApiKeys.map((key) => (
              <Card key={key.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Copy className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold">{key.name}</h4>
                            <Badge variant={key.is_active ? 'default' : 'secondary'}>
                              {key.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <code className="text-sm bg-muted px-2 py-1 rounded font-mono">
                              {visibleKeys.has(key.id) 
                                ? key.key_hash 
                                : maskApiKey(key.key_hash)
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
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(key.key_hash)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground ml-11">
                        <span>Created: {new Date(key.created_at).toLocaleDateString()}</span>
                        <span className="mx-2">•</span>
                        <span>
                          Last used: {key.last_used_at 
                            ? new Date(key.last_used_at).toLocaleDateString() 
                            : 'Never'
                          }
                        </span>
                        <span className="mx-2">•</span>
                        <span>Rate limit: {key.rate_limit_per_minute} requests/minute</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteApiKey(key.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiKeysManager;
