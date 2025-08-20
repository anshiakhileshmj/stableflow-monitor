
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { relayClient, type RelayResponse } from '@/lib/relay-client';

const RelayComplianceChecker = () => {
  const [address, setAddress] = useState('');
  const [chain, setChain] = useState('ethereum');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<RelayResponse | null>(null);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!address.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }

    if (!apiKey.trim()) {
      toast({
        title: "Error", 
        description: "Please enter your Relay API key",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    try {
      await relayClient.setApiKey(apiKey);
      const response = await relayClient.checkAddressRisk(address, chain);
      setResult(response);
      
      toast({
        title: "Compliance Check Complete",
        description: `Risk Level: ${response.risk_band} (${response.risk_score}%)`,
      });
    } catch (error) {
      console.error('Compliance check failed:', error);
      toast({
        title: "Check Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const getRiskColor = (riskBand: string) => {
    switch (riskBand) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'; 
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'PROHIBITED': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskIcon = (allowed: boolean, riskBand: string) => {
    if (riskBand === 'PROHIBITED') return <AlertTriangle className="w-4 h-4" />;
    if (!allowed) return <Shield className="w-4 h-4" />;
    return <CheckCircle className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            AML Compliance Checker
          </CardTitle>
          <CardDescription>
            Check wallet addresses for AML compliance using the Relay API
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">Relay API Key</Label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Relay API key"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="0x..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="chain">Blockchain</Label>
              <select
                id="chain"
                value={chain}
                onChange={(e) => setChain(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="ethereum">Ethereum</option>
                <option value="polygon">Polygon</option>
                <option value="arbitrum">Arbitrum</option>
                <option value="optimism">Optimism</option>
                <option value="bsc">BSC</option>
                <option value="avalanche">Avalanche</option>
              </select>
            </div>
          </div>

          <Button onClick={handleCheck} disabled={isChecking} className="w-full">
            {isChecking ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Checking Compliance...
              </>
            ) : (
              'Check AML Compliance'
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getRiskIcon(result.allowed, result.risk_band)}
              Compliance Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Badge className={getRiskColor(result.risk_band)}>
                {result.risk_band}
              </Badge>
              <span className="text-sm text-muted-foreground">
                Risk Score: {result.risk_score}%
              </span>
            </div>

            <Alert variant={result.allowed ? "default" : "destructive"}>
              <AlertDescription>
                <strong>Decision:</strong> {result.allowed ? 'ALLOWED' : 'BLOCKED'}
                {result.status && ` (${result.status})`}
              </AlertDescription>
            </Alert>

            {result.reasons && result.reasons.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Risk Factors:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {result.reasons.map((reason, index) => (
                    <li key={index} className="text-muted-foreground">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RelayComplianceChecker;
