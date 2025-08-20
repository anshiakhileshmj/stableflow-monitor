
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionChecker } from "@/components/relay/TransactionChecker";
import { SanctionsManager } from "@/components/relay/SanctionsManager";
import { ApiKeyManager } from "@/components/relay/ApiKeyManager";
import { RelayLogs } from "@/components/relay/RelayLogs";
import { Shield, Database, Key, Activity } from "lucide-react";

export default function RelayCompliance() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Relay Compliance Dashboard</h1>
          <p className="text-muted-foreground">
            AML compliance and transaction relay management
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">API Endpoint</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">https://resumeak.onrender.com</div>
            <p className="text-xs text-muted-foreground">
              Live relay-API service
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Endpoints</CardTitle>
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
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <a 
                href="https://resumeak.onrender.com/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                API Docs
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Interactive FastAPI documentation
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checker" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checker">Transaction Checker</TabsTrigger>
          <TabsTrigger value="sanctions">Sanctions Manager</TabsTrigger>
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="logs">Relay Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="checker">
          <TransactionChecker />
        </TabsContent>

        <TabsContent value="sanctions">
          <SanctionsManager />
        </TabsContent>

        <TabsContent value="api-keys">
          <ApiKeyManager />
        </TabsContent>

        <TabsContent value="logs">
          <RelayLogs />
        </TabsContent>
      </Tabs>
    </div>
  );
}
