
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Key, Activity, ExternalLink, Server } from "lucide-react";
import { ApiKeyManager } from "@/components/relay/ApiKeyManager";
import { RelayLogs } from "@/components/relay/RelayLogs";

export default function ApiManagement() {
  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">API Management</h1>
            <p className="text-muted-foreground">
              Manage your AML compliance API keys and monitor relay activity
            </p>
          </div>
        </div>
      </div>

      {/* API Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-2xl font-bold">Live</span>
            </div>
            <p className="text-xs text-muted-foreground">
              https://resumeak.onrender.com
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Endpoints</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Documentation</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Badge variant="outline">Postman</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Coming soon
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Endpoints Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Your B2B AML Compliance API
          </CardTitle>
          <CardDescription>
            Production endpoints deployed on Render for developer integration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <code className="font-mono text-sm bg-muted px-2 py-1 rounded">POST /v1/check</code>
                  <Badge variant="default">Live</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Pre-flight risk assessment for wallet addresses
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Returns risk score and decision (allow/block)</p>
                  <p>• No blockchain broadcast - just assessment</p>
                  <p>• Perfect for payment form validation</p>
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <code className="font-mono text-sm bg-muted px-2 py-1 rounded">POST /v1/relay</code>
                  <Badge variant="default">Live</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Enforced transaction relay with AML compliance
                </p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Enforces AML rules before broadcast</p>
                  <p>• Blocks high-risk transactions automatically</p>
                  <p>• Logs all decisions for audit trail</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">Integration Workflow</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span>Developer integrates your API into their app</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span>End user enters wallet address for payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span>Your API checks OFAC sanctions & risk scoring</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                    <span>Payment processed if risk = 0, blocked if risky</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href="https://resumeak.onrender.com/docs" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    API Docs
                  </a>
                </Button>
                <Button variant="outline" size="sm" disabled>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Postman Collection (Coming Soon)
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList>
          <TabsTrigger value="api-keys" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            API Keys
          </TabsTrigger>
          <TabsTrigger value="relay-logs" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Relay Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="api-keys">
          <ApiKeyManager />
        </TabsContent>

        <TabsContent value="relay-logs">
          <RelayLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
