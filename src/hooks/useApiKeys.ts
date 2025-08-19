
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

export const useApiKeys = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);

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

  const createApiKey = async (name: string): Promise<string | null> => {
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

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Store the key in database
      const { error: insertError } = await supabase
        .from('api_keys')
        .insert({
          name: name.trim(),
          key_hash: keyHash,
          user_id: user.id
        });

      if (insertError) throw insertError;

      fetchApiKeys();
      toast.success('API key created successfully');
      return newKey;
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
      return null;
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

  const toggleApiKey = async (keyId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: isActive })
        .eq('id', keyId);

      if (error) throw error;
      
      fetchApiKeys();
      toast.success(`API key ${isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Error updating API key:', error);
      toast.error('Failed to update API key');
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  return {
    apiKeys,
    loading,
    createApiKey,
    deleteApiKey,
    toggleApiKey,
    refetch: fetchApiKeys
  };
};
