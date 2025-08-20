
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Shield, Database, Key, Activity, FileText, ExternalLink, BarChart3, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import RealTimeMonitor from "@/components/RealTimeMonitor";
import BalanceTracker from "@/components/balance-tracker/BalanceTracker";
import StablecoinTransfersTab from "@/components/StablecoinTransfersTab";
import HistoryCheck from "@/components/HistoryCheck";
import AddressDisplay from "@/components/AddressDisplay";

export default function Index() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-4xl font-bold tracking-tight">WalletMate</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive blockchain analytics and AML compliance platform for Web3 developers and businesses
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">
              /v1/check & /v1/relay
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

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="real-time">Real-time Monitor</TabsTrigger>
          <TabsTrigger value="balance">Balance Tracker</TabsTrigger>
          <TabsTrigger value="stablecoin">Stablecoin Transfers</TabsTrigger>
          <TabsTrigger value="history">History Check</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Platform Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Shield className="h-8 w-8 text-blue-600" />
                  <Badge variant="default">Live</Badge>
                </div>
                <CardTitle>Relay Compliance API</CardTitle>
                <CardDescription>
                  B2B AML compliance service for developers to integrate real-time sanctions screening into their apps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">✓ /v1/check - Pre-flight risk assessment</p>
                  <p className="text-sm text-muted-foreground">✓ /v1/relay - Transaction relay with enforcement</p>
                  <p className="text-sm text-muted-foreground">✓ OFAC sanctions screening</p>
                  <p className="text-sm text-muted-foreground">✓ Multi-chain support</p>
                </div>
                <div className="flex gap-2">
                  <Button asChild size="sm">
                    <Link to="/api-management">API Management</Link>
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
                <Button size="sm" className="w-full" onClick={() => setActiveTab("balance")}>
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Activity className="h-8 w-8 text-purple-600" />
                  <Badge variant="outline">Live</Badge>
                </div>
                <CardTitle>Real-time Monitoring</CardTitle>
                <CardDescription>
                  Live transaction monitoring with whale alerts and large transfer detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">✓ Live transaction feed</p>
                  <p className="text-sm text-muted-foreground">✓ Whale movement alerts</p>
                  <p className="text-sm text-muted-foreground">✓ Large transfer detection</p>
                  <p className="text-sm text-muted-foreground">✓ Multi-chain coverage</p>
                </div>
                <Button size="sm" className="w-full" onClick={() => setActiveTab("real-time")}>
                  View Monitor
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* API Endpoints Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-6 w-6" />
                Relay API Endpoints
              </CardTitle>
              <CardDescription>
                Your B2B AML compliance API endpoints deployed on Render
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Production Endpoints</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <code className="text-sm font-mono">POST /v1/check</code>
                        <p className="text-xs text-muted-foreground">Pre-flight risk assessment</p>
                      </div>
                      <Badge variant="outline">Live</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <code className="text-sm font-mono">POST /v1/relay</code>
                        <p className="text-xs text-muted-foreground">Transaction relay with enforcement</p>
                      </div>
                      <Badge variant="outline">Live</Badge>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg">Integration Flow</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>1. Developers integrate your API into their apps</p>
                    <p>2. End users input wallet addresses for payments</p>
                    <p>3. Your API checks sanctions & risk in real-time</p>
                    <p>4. Payment processed if risk = 0, blocked if risky</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="real-time">
          <RealTimeMonitor />
        </TabsContent>

        <TabsContent value="balance">
          <BalanceTracker />
        </TabsContent>

        <TabsContent value="stablecoin">
          <StablecoinTransfersTab />
        </TabsContent>

        <TabsContent value="history">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <HistoryCheck />
            <AddressDisplay />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
