import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Coins,
  Search,
  Monitor,
  Wallet,
  TrendingUp,
  Activity,
  History,
} from "lucide-react";

const DashboardOverview = () => {
  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-muted rounded-lg">
                <Coins className="h-5 w-5 text-muted-foreground" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-muted-foreground mb-1">Total Transfers</h3>
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-muted rounded-lg">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-muted-foreground mb-1">Wallets Analyzed</h3>
            <p className="text-2xl font-bold">567</p>
            <p className="text-sm text-muted-foreground mt-1">+8% from last week</p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-muted rounded-lg">
                <Monitor className="h-5 w-5 text-muted-foreground" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-muted-foreground mb-1">Active Monitors</h3>
            <p className="text-2xl font-bold">89</p>
            <p className="text-sm text-muted-foreground mt-1">+3 new this week</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-muted rounded-lg">
                <Wallet className="h-5 w-5 text-muted-foreground" />
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <h3 className="font-medium text-muted-foreground mb-1">Tracked Balances</h3>
            <p className="text-2xl font-bold">$2.4M</p>
            <p className="text-sm text-muted-foreground mt-1">+15% portfolio growth</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                <button className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors">
                  View all
                </button>
              </div>
              <div className="space-y-4">
                {[
                  { icon: Coins, title: "Large USDC transfer detected", desc: "$50,000 from Binance to unknown wallet", time: "2 min ago" },
                  { icon: Search, title: "Wallet analysis completed", desc: "High-risk wallet flagged for review", time: "5 min ago" },
                  { icon: Monitor, title: "Real-time alert triggered", desc: "Suspicious activity on monitored address", time: "10 min ago" },
                  { icon: Wallet, title: "Balance update", desc: "Portfolio value increased by 5.2%", time: "1 hour ago" },
                  { icon: History, title: "Historical data sync", desc: "Transaction history updated", time: "2 hours ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="p-2 rounded-lg bg-muted">
                      <activity.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {activity.desc}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Network Distribution</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Ethereum</span>
                  <span className="text-sm font-medium">45%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '45%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Polygon</span>
                  <span className="text-sm font-medium">25%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Arbitrum</span>
                  <span className="text-sm font-medium">20%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Others</span>
                  <span className="text-sm font-medium">10%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Top Stablecoins</h3>
              <div className="space-y-3">
                {['USDC', 'USDT', 'DAI', 'BUSD'].map((token, i) => (
                  <div key={i} className="flex items-center justify-between py-2">
                    <span className="text-sm text-muted-foreground">{token}</span>
                    <span className="text-sm font-medium">
                      ${Math.floor(Math.random() * 1000000 + 500000).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;