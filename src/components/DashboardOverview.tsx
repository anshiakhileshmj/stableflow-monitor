import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Shield, 
  Radio, 
  Wallet, 
  Activity,
  AlertTriangle,
  DollarSign,
  Users
} from 'lucide-react';

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Real-time AML monitoring and blockchain analysis dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Monitors</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Radio className="w-8 h-8 text-green-500" />
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="text-xs">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Live
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tracked Wallets</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <Wallet className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <Badge variant="outline" className="text-xs">
                Multi-chain
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Risk Alerts</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-4">
              <Badge variant="destructive" className="text-xs">
                High Priority
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Volume Today</p>
                <p className="text-2xl font-bold">$2.4M</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="text-xs">
                +12.5%
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Stablecoin Transfers
            </CardTitle>
            <CardDescription>
              Monitor live stablecoin movements across multiple blockchains
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Networks:</span>
                <span className="font-medium">4</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Update:</span>
                <span className="font-medium">2 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              Wallet Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive risk assessment and compliance checking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Analyzed Today:</span>
                <span className="font-medium">47</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>High Risk:</span>
                <span className="font-medium text-red-500">3</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-500" />
              Real-Time Monitor
            </CardTitle>
            <CardDescription>
              Live whale transfer detection and alerting system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Whale Alerts:</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Status:</span>
                <Badge variant="secondary" className="text-xs">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts for efficient monitoring
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Activity className="w-6 h-6 mb-2 text-blue-500" />
              <h4 className="font-medium">Analyze Wallet</h4>
              <p className="text-sm text-muted-foreground">Quick risk assessment</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Users className="w-6 h-6 mb-2 text-green-500" />
              <h4 className="font-medium">Add Tracker</h4>
              <p className="text-sm text-muted-foreground">Monitor new wallet</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <TrendingUp className="w-6 h-6 mb-2 text-purple-500" />
              <h4 className="font-medium">View Transfers</h4>
              <p className="text-sm text-muted-foreground">Latest movements</p>
            </div>
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <AlertTriangle className="w-6 h-6 mb-2 text-orange-500" />
              <h4 className="font-medium">Risk Alerts</h4>
              <p className="text-sm text-muted-foreground">Review flagged items</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;