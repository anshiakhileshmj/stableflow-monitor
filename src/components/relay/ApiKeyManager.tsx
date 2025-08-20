
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, RotateCcw, Trash2, Plus, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  partner_id: string;
  active: boolean;
  rate_limit_per_minute: number;
  created_at: string;
  last_used_at: string | null;
}

export function ApiKeyManager() {
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [newPartnerId, setNewPartnerId] = useState("");
  const [showKeys, setShowKeys] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
  }, [user]);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error("Error fetching API keys:", error);
      toast.error("Failed to fetch API keys");
    }
  };

  const generateApiKey = async () => {
    if (!newKeyName.trim() || !newPartnerId.trim()) {
      toast.error("Name and Partner ID are required");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("generate_api_key");
      if (error) throw error;

      const newKey = data;
      const keyHash = await hashApiKey(newKey);

      const { error: insertError } = await supabase
        .from("api_keys")
        .insert({
          user_id: user?.id,
          name: newKeyName,
          key: newKey,
          key_hash: keyHash,
          partner_id: newPartnerId,
          active: true,
          rate_limit_per_minute: 100
        });

      if (insertError) throw insertError;

      toast.success("API key generated successfully");
      setNewKeyName("");
      setNewPartnerId("");
      fetchApiKeys();
    } catch (error) {
      console.error("Error generating API key:", error);
      toast.error("Failed to generate API key");
    } finally {
      setLoading(false);
    }
  };

  const hashApiKey = async (apiKey: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const toggleKeyStatus = async (keyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .update({ active: !currentStatus })
        .eq("id", keyId);

      if (error) throw error;

      toast.success(`API key ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchApiKeys();
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error("Failed to update API key");
    }
  };

  const deleteApiKey = async (keyId: string) => {
    if (!confirm("Are you sure you want to delete this API key? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", keyId);

      if (error) throw error;

      toast.success("API key deleted successfully");
      fetchApiKeys();
    } catch (error) {
      console.error("Error deleting API key:", error);
      toast.error("Failed to delete API key");
    }
  };

  const maskKey = (key: string) => {
    if (key.length <= 8) return key;
    return key.substring(0, 8) + "..." + key.substring(key.length - 4);
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please sign in to manage API keys</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Generate New API Key
          </CardTitle>
          <CardDescription>
            Create a new API key for accessing the relay endpoints
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="key-name">Key Name</Label>
              <Input
                id="key-name"
                placeholder="Production API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner-id">Partner ID</Label>
              <Input
                id="partner-id"
                placeholder="your-company-id"
                value={newPartnerId}
                onChange={(e) => setNewPartnerId(e.target.value)}
              />
            </div>
          </div>
          <Button onClick={generateApiKey} disabled={loading} className="w-full">
            <Key className="mr-2 h-4 w-4" />
            Generate API Key
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Your API Keys ({apiKeys.length})
          </CardTitle>
          <CardDescription>
            Manage your relay API keys
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Key</TableHead>
                  <TableHead>Partner ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Rate Limit</TableHead>
                  <TableHead>Last Used</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell className="font-mono text-sm">
                      <div className="flex items-center gap-2">
                        <span>
                          {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>{apiKey.partner_id}</TableCell>
                    <TableCell>
                      <Badge variant={apiKey.active ? "default" : "secondary"}>
                        {apiKey.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{apiKey.rate_limit_per_minute}/min</TableCell>
                    <TableCell>
                      {apiKey.last_used_at 
                        ? new Date(apiKey.last_used_at).toLocaleDateString()
                        : "Never"
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyStatus(apiKey.id, apiKey.active)}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteApiKey(apiKey.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
