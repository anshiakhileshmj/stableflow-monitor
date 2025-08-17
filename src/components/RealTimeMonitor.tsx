import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Radio, Waves, AlertTriangle, Bell, BellOff } from "lucide-react";

interface RealTimeTransfer {
  id: string;
  hash: string;
  timestamp: string;
  block_number: number;
  from_address: string;
  to_address: string;
  amount: number;
  currency: string;
  usd_value: number;
  is_whale: boolean;
  network: string;
}

const RealTimeMonitor = () => {
  const [transfers, setTransfers] = useState<RealTimeTransfer[]>([]);
  const [whaleAlerts, setWhaleAlerts] = useState<RealTimeTransfer[]>([]);
  // Use localStorage to persist monitoring state across tab switches
  const [isConnected, setIsConnected] = useState(() => {
    const saved = localStorage.getItem('rtm-monitoring-active');
    return saved === 'true';
  });
  const [isLoading, setIsLoading] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [stats, setStats] = useState({
    totalTransfers: 0,
    totalVolume: 0,
    whaleCount: 0,
    avgTransferSize: 0
  });
  const { toast } = useToast();

  const startMonitoring = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.functions.invoke('real-time-monitor', {
        body: { action: 'start_monitoring' }
      });
      
      if (error) throw error;
      
      setIsConnected(true);
      localStorage.setItem('rtm-monitoring-active', 'true');
      toast({
        title: "Monitoring Started",
        description: "Real-time transfer monitoring is now active",
      });
      
      // Start fetching data
      fetchRecentTransfers();
      fetchWhaleAlerts();
      
    } catch (error) {
      console.error('Error starting monitoring:', error);
      toast({
        title: "Error",
        description: "Failed to start real-time monitoring",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecentTransfers = async () => {
    try {
      const { data } = await supabase.functions.invoke('real-time-monitor', {
        body: { action: 'get_recent_transfers' }
      });
      
      if (data?.transfers && Array.isArray(data.transfers)) {
        setTransfers(data.transfers);
        updateStats(data.transfers);
      }
    } catch (error) {
      console.error('Error fetching transfers:', error);
      setTransfers([]); // Set empty array on error
    }
  };

  const fetchWhaleAlerts = async () => {
    try {
      const { data } = await supabase.functions.invoke('real-time-monitor', {
        body: { action: 'get_whale_alerts' }
      });
      
      if (data?.whales && Array.isArray(data.whales)) {
        setWhaleAlerts(data.whales);
      }
    } catch (error) {
      console.error('Error fetching whale alerts:', error);
      setWhaleAlerts([]); // Set empty array on error
    }
  };

  const updateStats = (transfers: RealTimeTransfer[]) => {
    if (!Array.isArray(transfers) || transfers.length === 0) {
      setStats({
        totalTransfers: 0,
        totalVolume: 0,
        whaleCount: 0,
        avgTransferSize: 0
      });
      return;
    }

    const totalVolume = transfers.reduce((sum, t) => sum + (t.usd_value || 0), 0);
    const whaleCount = transfers.filter(t => t.is_whale).length;
    
    setStats({
      totalTransfers: transfers.length,
      totalVolume,
      whaleCount,
      avgTransferSize: transfers.length > 0 ? totalVolume / transfers.length : 0
    });
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatUSD = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
      if (permission === 'granted') {
        toast({
          title: "Notifications Enabled",
          description: "You will receive whale alerts for large transfers",
        });
      }
    }
  };

  const toggleNotifications = () => {
    if (notificationsEnabled) {
      setNotificationsEnabled(false);
      toast({
        title: "Notifications Disabled",
        description: "Whale alerts are now disabled",
      });
    } else {
      requestNotificationPermission();
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!isConnected) return;

    const transferChannel = supabase
      .channel('real-time-transfers')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'real_time_transfers'
        },
        (payload) => {
          const newTransfer = payload.new as RealTimeTransfer;
          setTransfers(prev => [newTransfer, ...prev].slice(0, 100));
          
          if (newTransfer.is_whale) {
            setWhaleAlerts(prev => [newTransfer, ...prev].slice(0, 50));
            
            // Show notification for whale transfers
            if (notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('🐋 Whale Alert!', {
                body: `${formatUSD(newTransfer.usd_value)} ${newTransfer.currency} transfer detected`,
                icon: '/favicon.ico'
              });
            }
            
            // Show toast notification
            toast({
              title: "🐋 Whale Alert!",
              description: `${formatUSD(newTransfer.usd_value)} ${newTransfer.currency} transfer detected`,
            });
          }
        }
      )
      .subscribe();

    // Auto-refresh data every 30 seconds
    const interval = setInterval(() => {
      fetchRecentTransfers();
      fetchWhaleAlerts();
    }, 30000);

    return () => {
      supabase.removeChannel(transferChannel);
      clearInterval(interval);
    };
  }, [isConnected, notificationsEnabled]);

  // Check notification permission on mount and restore monitoring state
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }
    
    // If monitoring was active, restore data
    if (isConnected) {
      fetchRecentTransfers();
      fetchWhaleAlerts();
    }
  }, []);
  
  // Update localStorage when connection state changes
  useEffect(() => {
    localStorage.setItem('rtm-monitoring-active', String(isConnected));
  }, [isConnected]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Real-Time Transfer Monitor
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleNotifications}
                className="flex items-center gap-2"
              >
                {notificationsEnabled ? (
                  <>
                    <Bell className="w-4 h-4" />
                    Notifications On
                  </>
                ) : (
                  <>
                    <BellOff className="w-4 h-4" />
                    Enable Alerts
                  </>
                )}
              </Button>
              <Button 
                onClick={isConnected ? () => {
                  setIsConnected(false);
                  localStorage.setItem('rtm-monitoring-active', 'false');
                  toast({
                    title: "Monitoring Stopped",
                    description: "Real-time transfer monitoring has been stopped",
                  });
                } : startMonitoring}
                disabled={isLoading}
                size="sm"
                variant={isConnected ? "destructive" : "default"}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isConnected ? (
                  <>
                    <Waves className="w-4 h-4 mr-2" />
                    Stop Monitoring
                  </>
                ) : (
                  <>
                    <Waves className="w-4 h-4 mr-2" />
                    Start Monitoring
                  </>
                )}
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Live tracking of large cryptocurrency transfers with whale detection
          </CardDescription>
        </CardHeader>
      </Card>

      {isConnected && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Transfers</div>
                <div className="text-2xl font-bold">{stats.totalTransfers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Total Volume</div>
                <div className="text-2xl font-bold">{formatUSD(stats.totalVolume)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Whale Transfers</div>
                <div className="text-2xl font-bold text-orange-500">{stats.whaleCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-muted-foreground">Avg Transfer</div>
                <div className="text-2xl font-bold">{formatUSD(stats.avgTransferSize)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Whale Alerts */}
          {whaleAlerts.length > 0 && (
            <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                  <AlertTriangle className="w-5 h-5" />
                  🐋 Recent Whale Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="space-y-2">
                   {Array.isArray(whaleAlerts) && whaleAlerts.slice(0, 5).map((alert) => (
                     <div key={alert.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border">
                       <div className="flex items-center gap-3">
                         <Badge variant="outline" className="border-orange-300">
                           {alert.currency}
                         </Badge>
                         <span className="font-mono text-lg font-bold">
                           {formatUSD(alert.usd_value)}
                         </span>
                       </div>
                       <div className="text-right text-sm text-muted-foreground">
                         <div>{truncateAddress(alert.from_address)} → {truncateAddress(alert.to_address)}</div>
                         <div>{formatTimestamp(alert.timestamp)}</div>
                       </div>
                     </div>
                   ))}
                 </div>
              </CardContent>
            </Card>
          )}

          {/* Transfer Tables */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">All Transfers</TabsTrigger>
              <TabsTrigger value="whales">Whale Transfers Only</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Live Transfer Feed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="max-h-96 overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Token</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                       <TableBody>
                         {Array.isArray(transfers) && transfers.map((transfer) => (
                           <TableRow key={transfer.id}>
                             <TableCell>
                               <Badge variant="outline">{transfer.currency}</Badge>
                             </TableCell>
                             <TableCell className="font-mono">
                               {formatUSD(transfer.usd_value)}
                             </TableCell>
                             <TableCell className="font-mono">
                               {truncateAddress(transfer.from_address)}
                             </TableCell>
                             <TableCell className="font-mono">
                               {truncateAddress(transfer.to_address)}
                             </TableCell>
                             <TableCell>
                               {formatTimestamp(transfer.timestamp)}
                             </TableCell>
                             <TableCell>
                               {transfer.is_whale && (
                                 <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                                   🐋 Whale
                                 </Badge>
                               )}
                             </TableCell>
                           </TableRow>
                         ))}
                         {(!Array.isArray(transfers) || transfers.length === 0) && (
                           <TableRow>
                             <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                               No transfers found. Start monitoring to see live data.
                             </TableCell>
                           </TableRow>
                         )}
                       </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="whales">
              <Card>
                <CardHeader>
                  <CardTitle>Whale Transfers ($100k+)</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>From</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead>Timestamp</TableHead>
                      </TableRow>
                    </TableHeader>
                     <TableBody>
                       {Array.isArray(whaleAlerts) && whaleAlerts.map((whale) => (
                         <TableRow key={whale.id}>
                           <TableCell>
                             <Badge variant="outline">{whale.currency}</Badge>
                           </TableCell>
                           <TableCell className="font-mono font-bold text-orange-600">
                             {formatUSD(whale.usd_value)}
                           </TableCell>
                           <TableCell className="font-mono">
                             {truncateAddress(whale.from_address)}
                           </TableCell>
                           <TableCell className="font-mono">
                             {truncateAddress(whale.to_address)}
                           </TableCell>
                           <TableCell>
                             {formatTimestamp(whale.timestamp)}
                           </TableCell>
                         </TableRow>
                       ))}
                       {(!Array.isArray(whaleAlerts) || whaleAlerts.length === 0) && (
                         <TableRow>
                           <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                             No whale transfers detected yet.
                           </TableCell>
                         </TableRow>
                       )}
                     </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default RealTimeMonitor;