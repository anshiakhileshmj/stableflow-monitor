
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, Key, Activity, FileText, ExternalLink, BarChart3, Wallet } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">WalletMate</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive blockchain analytics and AML compliance platform for Web3 developers and businesses
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Relay API</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Live</div>
            <p className="text-xs text-muted-foreground">
              AML compliance service
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Supported Chains</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10+</div>
            <p className="text-xs text-muted-foreground">
              Major blockchain networks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Endpoints</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15+</div>
            <p className="text-xs text-muted-foreground">
              Analytics & compliance APIs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/7</div>
            <p className="text-xs text-muted-foreground">
              Monitoring & analytics
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Shield className="h-8 w-8 text-blue-600" />
              <Badge variant="default">Live</Badge>
            </div>
            <CardTitle>Relay Compliance</CardTitle>
            <CardDescription>
              AML-compliant transaction relay with real-time risk assessment and sanctions screening
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">✓ OFAC sanctions screening</p>
              <p className="text-sm text-muted-foreground">✓ Risk scoring engine</p>
              <p className="text-sm text-muted-foreground">✓ Multi-chain support</p>
              <p className="text-sm text-muted-foreground">✓ Real-time decisions</p>
            </div>
            <div className="flex gap-2">
              <Button asChild size="sm">
                <Link to="/relay-compliance">Dashboard</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href="https://resumeak.onrender.com/docs" target="_blank" rel="noopener noreferrer">
                  API Docs <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Wallet className="h-8 w-8 text-green-600" />
              <Badge variant="secondary">Available</Badge>
            </div>
            <CardTitle>Wallet Analytics</CardTitle>
            <CardDescription>
              Comprehensive wallet tracking, balance monitoring, and transaction history analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">✓ Real-time balance tracking</p>
              <p className="text-sm text-muted-foreground">✓ Transaction history</p>
              <p className="text-sm text-muted-foreground">✓ Multi-asset support</p>
              <p className="text-sm text-muted-foreground">✓ Portfolio analytics</p>
            </div>
            <Button asChild size="sm" className="w-full">
              <Link to="/">Analytics Dashboard</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Key className="h-8 w-8 text-purple-600" />
              <Badge variant="outline">Required</Badge>
            </div>
            <CardTitle>API Management</CardTitle>
            <CardDescription>
              Generate, manage, and monitor API keys for accessing all WalletMate services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">✓ Secure key generation</p>
              <p className="text-sm text-muted-foreground">✓ Rate limiting controls</p>
              <p className="text-sm text-muted-foreground">✓ Usage analytics</p>
              <p className="text-sm text-muted-foreground">✓ Key rotation</p>
            </div>
            <Button asChild size="sm" className="w-full">
              <Link to="/relay-compliance">Manage Keys</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-6 w-6" />
            API Endpoints Overview
          </CardTitle>
          <CardDescription>
            Quick reference for our main API endpoints
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Relay API (AML Compliance)</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <code className="text-sm font-mono">POST /v1/check</code>
                    <p className="text-xs text-muted-foreground">Preflight AML decision</p>
                  </div>
                  <Badge variant="outline">Live</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <code className="text-sm font-mono">POST /v1/relay</code>
                    <p className="text-xs text-muted-foreground">Enforced relay with broadcast</p>
                  </div>
                  <Badge variant="outline">Live</Badge>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">Analytics API</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <code className="text-sm font-mono">GET /balance/*</code>
                    <p className="text-xs text-muted-foreground">Real-time wallet balances</p>
                  </div>
                  <Badge variant="secondary">Available</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <code className="text-sm font-mono">GET /history/*</code>
                    <p className="text-xs text-muted-foreground">Transaction history</p>
                  </div>
                  <Badge variant="secondary">Available</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild size="lg">
          <Link to="/relay-compliance">
            <Shield className="mr-2 h-5 w-5" />
            Try Relay Compliance
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="https://resumeak.onrender.com/docs" target="_blank" rel="noopener noreferrer">
            <FileText className="mr-2 h-5 w-5" />
            View API Documentation
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
