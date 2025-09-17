import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Shield, Radio, Wallet, Activity, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">
          Welcome to your Stablecoin AML Tracker dashboard. Monitor transactions, analyze wallets, and track compliance across multiple blockchains.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Live Transfers</p>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Networks</p>
                <p className="text-2xl font-bold text-gray-900">5+</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Radio className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Whale Alerts</p>
                <p className="text-2xl font-bold text-gray-900">Real-time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Analysis</p>
                <p className="text-2xl font-bold text-gray-900">Advanced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Stablecoin Transfer Monitoring
            </CardTitle>
            <CardDescription>
              Track live stablecoin transfers across multiple blockchains in real-time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Supported Networks</span>
                <div className="flex gap-1">
                  <Badge variant="secondary">Ethereum</Badge>
                  <Badge variant="secondary">BSC</Badge>
                  <Badge variant="secondary">Polygon</Badge>
                  <Badge variant="secondary">+2</Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Update Frequency</span>
                <Badge variant="outline">15 seconds</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Wallet Risk Analysis
            </CardTitle>
            <CardDescription>
              Comprehensive AML compliance analysis for any wallet address
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Risk Assessment</span>
                <Badge variant="outline">AI-Powered</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Transaction History</span>
                <Badge variant="outline">Complete</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-600" />
              Whale Movement Tracker
            </CardTitle>
            <CardDescription>
              Monitor large cryptocurrency transfers and whale activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Alert Threshold</span>
                <Badge variant="outline">$100K+ USD</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Notifications</span>
                <Badge variant="outline">Browser & Toast</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-orange-600" />
              Balance Tracking
            </CardTitle>
            <CardDescription>
              Real-time balance monitoring for multiple wallet addresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Multi-Wallet</span>
                <Badge variant="outline">Unlimited</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Real-time Updates</span>
                <Badge variant="outline">Live Feed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Getting Started */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <AlertTriangle className="w-5 h-5" />
            Getting Started
          </CardTitle>
          <CardDescription className="text-blue-700">
            Quick guide to using your AML tracking dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800">1. Monitor Transfers</h4>
                <p className="text-sm text-blue-700">
                  Click "Stablecoin Transfers" to view live transfer data across all supported networks.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800">2. Analyze Wallets</h4>
                <p className="text-sm text-blue-700">
                  Use "Wallet Analysis" to perform comprehensive risk assessments on any address.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800">3. Track Whales</h4>
                <p className="text-sm text-blue-700">
                  Enable "Whale Monitor" to receive alerts for large cryptocurrency movements.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-blue-800">4. Monitor Balances</h4>
                <p className="text-sm text-blue-700">
                  Add wallet addresses to "Balance Tracker" for real-time balance monitoring.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardOverview;