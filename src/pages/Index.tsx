
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Book, Settings, TrendingUp, Radio, Wallet, History, FileText, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";

const Index = () => {
  const navigate = useNavigate();

  const navigationCards = [
    {
      title: "API Documentation",
      description: "Complete guide to using our AML compliance APIs",
      icon: Book,
      path: "/docs",
      color: "bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20"
    },
    {
      title: "Dashboard",
      description: "Overview of compliance activities and statistics",
      icon: BarChart3,
      path: "/dashboard",
      color: "bg-green-500/10 hover:bg-green-500/20 border-green-500/20"
    },
    {
      title: "Relay Compliance",
      description: "AML-aware transaction relay and broadcasting",
      icon: Shield,
      path: "/compliance",
      color: "bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20"
    }
  ];

  const featureCards = [
    {
      title: "Stablecoin Transfers",
      description: "Track and analyze stablecoin movements",
      icon: TrendingUp,
      badge: "Live"
    },
    {
      title: "Wallet Analysis",
      description: "Risk assessment and compliance checking",
      icon: Shield,
      badge: "AML"
    },
    {
      title: "Real-Time Monitor",
      description: "Live blockchain transaction monitoring",
      icon: Radio,
      badge: "Real-time"
    },
    {
      title: "Balance Tracker",
      description: "Multi-wallet balance monitoring",
      icon: Wallet,
      badge: "Multi-chain"
    },
    {
      title: "History Check",
      description: "Historical transaction analysis",
      icon: History,
      badge: "Analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AML Tracker Platform
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive AML compliance and blockchain analysis platform with real-time monitoring, 
              risk assessment, and regulatory compliance tools.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {navigationCards.map((card) => (
                <Card 
                  key={card.path}
                  className={`cursor-pointer transition-all duration-200 ${card.color}`}
                  onClick={() => navigate(card.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <card.icon className="w-6 h-6 text-primary" />
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {card.description}
                    </CardDescription>
                    <Button variant="ghost" size="sm" className="mt-3 p-0 h-auto font-medium">
                      Access →
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Platform Features */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featureCards.map((feature) => (
                <Card key={feature.title} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <feature.icon className="w-5 h-5 text-primary" />
                        <CardTitle className="text-base">{feature.title}</CardTitle>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {feature.badge}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Overview */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Platform Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Compliance Checks</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">2,350+</div>
                  <p className="text-xs text-muted-foreground">This month</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Transactions Analyzed</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">15.2M</div>
                  <p className="text-xs text-muted-foreground">All time</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Networks Supported</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">12</div>
                  <p className="text-xs text-muted-foreground">Blockchains</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">API Uptime</span>
                  </div>
                  <div className="text-2xl font-bold mt-2">99.9%</div>
                  <p className="text-xs text-muted-foreground">Last 30 days</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
