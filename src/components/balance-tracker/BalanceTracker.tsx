
import React, { useState, useEffect } from 'react';
import { useRealTimeBalance } from '@/hooks/useRealTimeBalance';
import { useWalletStorage } from '@/hooks/useWalletStorage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Wallet, TrendingUp, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WalletBalanceCard from './WalletBalanceCard';

interface WalletData {
  id: string;
  address: string;
  name?: string;
  network: string;
}

const BalanceTracker = () => {
  const [formData, setFormData] = useState({
    address: '',
    name: ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const { toast } = useToast();
  
  const { 
    wallets, 
    addWallet, 
    removeWallet, 
    loading: storageLoading 
  } = useWalletStorage();
  
  const { 
    balances, 
    isConnected, 
    lastUpdate,
    startTracking,
    stopTracking 
  } = useRealTimeBalance(wallets, 'ethereum');

  // Start tracking when wallets are loaded
  useEffect(() => {
    if (wallets.length > 0) {
      startTracking();
    }
    return () => stopTracking();
  }, [wallets, startTracking, stopTracking]);

  const validateAddress = (address: string) => {
    // Support multiple blockchain address formats
    const ethereumPattern = /^0x[a-fA-F0-9]{40}$/;
    const xrpPattern = /^r[0-9A-Za-z]{24,34}$/;
    const bitcoinPattern = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    
    return ethereumPattern.test(address) || xrpPattern.test(address) || bitcoinPattern.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAddress(formData.address)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid wallet address (supports Ethereum, XRP, Bitcoin formats)",
        variant: "destructive",
      });
      return;
    }

    setIsValidating(true);

    try {
      await addWallet({
        address: formData.address.toLowerCase(),
        name: formData.name || undefined,
        network: 'auto' // Auto-detect network based on address format
      });

      // Reset form
      setFormData({ address: '', name: '' });
      
      toast({
        title: "Wallet Added",
        description: "Wallet has been added to tracking list across all supported blockchains",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to add wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="w-5 h-5" />
                Real-Time Balance Tracker
              </CardTitle>
              <CardDescription>
                Monitor wallet balances across all known blockchains in real-time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              {lastUpdate && (
                <span className="text-xs text-muted-foreground">
                  Last update: {new Date(lastUpdate).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg bg-muted/30">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Wallet Address *</Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter wallet address (0x... XRP, BTC addresses supported)"
                  value={formData.address}
                  onChange={(e) => setFormData({
                    ...formData, 
                    address: e.target.value
                  })}
                  required
                  className="font-mono"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Wallet Name (Optional)</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="My Wallet"
                  value={formData.name}
                  onChange={(e) => setFormData({
                    ...formData, 
                    name: e.target.value
                  })}
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              disabled={isValidating}
              className="w-full flex items-center gap-2"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding Wallet...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Wallet to Track
                </>
              )}
            </Button>
          </form>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {storageLoading ? (
              <div className="col-span-full flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading wallets...</span>
              </div>
            ) : wallets.length === 0 ? (
              <div className="col-span-full text-center py-8">
                <Wallet className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-2">No wallets being tracked</p>
                <p className="text-sm text-muted-foreground">
                  Add a wallet address to start monitoring balances
                </p>
              </div>
            ) : (
              wallets.map(wallet => (
                <WalletBalanceCard
                  key={`${wallet.address}-${wallet.network}`}
                  wallet={wallet}
                  balance={balances[wallet.address]}
                  onRemove={() => removeWallet(wallet.id)}
                />
              ))
            )}
          </div>

          <div className="flex items-center gap-6 pt-4 border-t">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Tracked Wallets:</span>
              <Badge variant="secondary">{wallets.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Multi-Blockchain Support:</span>
              <Badge variant="outline">All Networks</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active Balances:</span>
              <Badge variant="secondary">{Object.keys(balances).length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BalanceTracker;
