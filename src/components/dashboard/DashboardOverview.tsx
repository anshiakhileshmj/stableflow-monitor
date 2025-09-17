import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Shield, 
  Waves, 
  Wallet, 
  History,
  Activity,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to your Stablecoin AML Tracker dashboard. Monitor transfers, analyze risks, and track wallets in real-time.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-2xl font-bold">Online</span>
            </div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Networks Supported</CardTitle>
            <Waves className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6</div>
            <p className="text-xs text-muted-foreground">
              Blockchain networks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risk Analysis</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
            <p className="text-xs text-muted-foreground">
              AML compliance ready
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monitoring</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24/7</div>
            <p className="text-xs text-muted-foreground">
              Real-time tracking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Stablecoin Transfers</CardTitle>
                <CardDescription className="text-sm">
                  Real-time transfer tracking
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Monitor stablecoin transfers across all supported blockchains with live updates every 15 seconds.
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">USDT</Badge>
              <Badge variant="secondary">USDC</Badge>
              <Badge variant="secondary">DAI</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Wallet Analysis</CardTitle>
                <CardDescription className="text-sm">
                  Risk assessment tools
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Analyze wallets for AML compliance with comprehensive risk scoring and transaction history.
            </p>
            <div className="flex gap-2">
              <Badge variant="outline">Risk Scoring</Badge>
              <Badge variant="outline">Transaction Analysis</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <Waves className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Whale Monitor</CardTitle>
                <CardDescription className="text-sm">
                  Large transaction alerts
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Real-time monitoring of large cryptocurrency transfers with instant whale alerts and notifications.
            </p>
            <div className="flex gap-2">
              <Badge variant="destructive">🐋 Alerts</Badge>
              <Badge variant="outline">Push Notifications</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg">Balance Tracker</CardTitle>
                <CardDescription className="text-sm">
                  Real-time balance monitoring
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Track multiple wallet balances across different networks with automatic updates and alerts.
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary">Multi-Network</Badge>
              <Badge variant="outline">Auto-Update</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 flex items-center justify-center">
                <History className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <CardTitle className="text-lg">History Check</CardTitle>
                <CardDescription className="text-sm">
                  Historical analysis
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Comprehensive historical transaction analysis with detailed analytics and reporting capabilities.
            </p>
            <div className="flex gap-2">
              <Badge variant="outline">Analytics</Badge>
              <Badge variant="outline">Reporting</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg text-muted-foreground">Coming Soon</CardTitle>
            <CardDescription>
              More features in development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Advanced analytics, API integrations, and custom alerting systems.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts to get you started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">View Latest Transfers</div>
                <div className="text-sm text-muted-foreground">Check recent stablecoin movements</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <Shield className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Analyze a Wallet</div>
                <div className="text-sm text-muted-foreground">Perform risk assessment</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <Waves className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-medium">Start Whale Monitoring</div>
                <div className="text-sm text-muted-foreground">Enable real-time alerts</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
              <Wallet className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium">Add Wallet to Track</div>
                <div className="text-sm text-muted-foreground">Monitor balance changes</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;