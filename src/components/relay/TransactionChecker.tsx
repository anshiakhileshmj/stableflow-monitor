
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Shield, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface CheckResult {
  allowed: boolean;
  risk_band: string;
  risk_score: number;
  reasons: string[];
}

export function TransactionChecker() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckResult | null>(null);
  const [formData, setFormData] = useState({
    chain: "ethereum",
    to: "",
    from: "",
    value: "",
    asset: "",
    features: ""
  });

  const handleCheck = async () => {
    if (!formData.to) {
      toast.error("Destination address is required");
      return;
    }

    setLoading(true);
    try {
      // Parse features if provided
      let features = null;
      if (formData.features.trim()) {
        try {
          features = JSON.parse(formData.features);
        } catch (e) {
          toast.error("Invalid JSON format in features");
          setLoading(false);
          return;
        }
      }

      const response = await fetch("https://resumeak.onrender.com/v1/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer your-api-key-here" // This will be dynamic once API keys are implemented
        },
        body: JSON.stringify({
          chain: formData.chain,
          to: formData.to,
          from: formData.from || undefined,
          value: formData.value || undefined,
          asset: formData.asset || undefined,
          features: features
        })
      });

      const data = await response.json();
      setResult(data);
      
      if (data.allowed) {
        toast.success("Transaction allowed");
      } else {
        toast.error("Transaction blocked");
      }
    } catch (error) {
      console.error("Check failed:", error);
      toast.error("Failed to check transaction");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (band: string) => {
    switch (band) {
      case "LOW": return "bg-green-100 text-green-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "CRITICAL": return "bg-red-100 text-red-800";
      case "PROHIBITED": return "bg-red-200 text-red-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Transaction Risk Check
          </CardTitle>
          <CardDescription>
            Check if a transaction would be allowed by the relay service
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="chain">Chain</Label>
              <Select value={formData.chain} onValueChange={(value) => setFormData({...formData, chain: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="polygon">Polygon</SelectItem>
                  <SelectItem value="arbitrum">Arbitrum</SelectItem>
                  <SelectItem value="optimism">Optimism</SelectItem>
                  <SelectItem value="base">Base</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="asset">Asset (Optional)</Label>
              <Input
                id="asset"
                placeholder="USDC, ETH, etc."
                value={formData.asset}
                onChange={(e) => setFormData({...formData, asset: e.target.value})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="to">To Address *</Label>
            <Input
              id="to"
              placeholder="0x..."
              value={formData.to}
              onChange={(e) => setFormData({...formData, to: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="from">From Address (Optional)</Label>
            <Input
              id="from"
              placeholder="0x..."
              value={formData.from}
              onChange={(e) => setFormData({...formData, from: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="value">Value (Optional)</Label>
            <Input
              id="value"
              placeholder="1000000000000000000"
              value={formData.value}
              onChange={(e) => setFormData({...formData, value: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Risk Features (Optional JSON)</Label>
            <Textarea
              id="features"
              placeholder='[{"key": "mixer_direct", "base": 40, "occurredAt": "2025-08-15T12:00:00Z", "critical": true}]'
              value={formData.features}
              onChange={(e) => setFormData({...formData, features: e.target.value})}
              rows={3}
            />
          </div>

          <Button onClick={handleCheck} disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              "Check Transaction"
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Check Result</CardTitle>
          <CardDescription>
            Risk assessment and decision from the relay service
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {result.allowed ? (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
                <span className={`font-medium ${result.allowed ? 'text-green-600' : 'text-red-600'}`}>
                  {result.allowed ? 'ALLOWED' : 'BLOCKED'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Risk Band:</span>
                <Badge className={getRiskColor(result.risk_band)}>
                  {result.risk_band}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Risk Score:</span>
                <span className="font-mono text-lg">{result.risk_score}</span>
              </div>

              {result.reasons && result.reasons.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Reasons:</span>
                  <ul className="list-disc list-inside space-y-1">
                    {result.reasons.map((reason, index) => (
                      <li key={index} className="text-sm text-muted-foreground">
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Run a transaction check to see results</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
