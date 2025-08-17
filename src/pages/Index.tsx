import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Shield, AlertTriangle, TrendingUp, Radio } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import RealTimeMonitor from "@/components/RealTimeMonitor";

interface Transfer {
  tokenSymbol: string;
  tokenName: string;
  amount: string;
  senderAddress: string;
  receiverAddress: string;
  timestamp: string;
}

interface Transaction {
  hash: string;
  timestamp: Date;
  value: string;
  from: string;
  to: string;
  isError: boolean;
}

interface TokenTransfer {
  hash: string;
  tokenName: string;
  tokenSymbol: string;
  value: string;
  from: string;
  to: string;
  timeStamp: string;
}

interface InternalTransaction {
  hash: string;
  value: string;
  from: string;
  to: string;
  timeStamp: string;
  isError: string;
}

interface RiskAnalysis {
  totalTransactions: number;
  failedTransactions: number;
  failedTransactionRatio: number;
  walletAgeDays: number;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

const Index = () => {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tokenTransfers, setTokenTransfers] = useState<TokenTransfer[]>([]);
  const [internalTransactions, setInternalTransactions] = useState<InternalTransaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<string>("");
  const [riskAnalysis, setRiskAnalysis] = useState<RiskAnalysis | null>(null);
  const [isLoadingTransfers, setIsLoadingTransfers] = useState(false);
  const [isAnalyzingWallet, setIsAnalyzingWallet] = useState(false);
  const { toast } = useToast();

  const fetchStablecoinTransfers = async () => {
    setIsLoadingTransfers(true);
    try {
      const { data, error } = await supabase.functions.invoke('fetch-stablecoin-transfers');
      
      if (error) throw error;
      
      // Ensure transfers is always an array
      const transfersData = Array.isArray(data?.transfers) ? data.transfers : [];
      setTransfers(transfersData);
      
      toast({
        title: "Success",
        description: `Fetched ${transfersData.length} recent stablecoin transfers`,
      });
    } catch (error) {
      console.error('Error fetching transfers:', error);
      setTransfers([]); // Always set empty array on error
      toast({
        title: "Error",
        description: "Failed to fetch stablecoin transfers. Please check the Bitquery API configuration.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingTransfers(false);
    }
  };

  const analyzeWallet = async () => {
    if (!walletAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a wallet address",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzingWallet(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-wallet', {
        body: { walletAddress: walletAddress.trim() }
      });
      
      if (error) throw error;
      
      setTransactions(data.transactions || []);
      setTokenTransfers(data.tokenTransfers || []);
      setInternalTransactions(data.internalTransactions || []);
      setWalletBalance(data.balance || "0");
      setRiskAnalysis(data.riskAnalysis);
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${data.transactions?.length || 0} transactions, ${data.tokenTransfers?.length || 0} token transfers`,
      });
    } catch (error) {
      console.error('Error analyzing wallet:', error);
      toast({
        title: "Error",
        description: "Failed to analyze wallet",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzingWallet(false);
    }
  };

  const getRiskBadgeVariant = (level: string) => {
    switch (level) {
      case 'LOW': return 'default';
      case 'MEDIUM': return 'secondary';
      case 'HIGH': return 'destructive';
      default: return 'outline';
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  useEffect(() => {
    fetchStablecoinTransfers();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <header className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Stablecoin AML Tracker
            </h1>
            <p className="text-muted-foreground text-lg">
              Track stablecoin transfers and analyze wallet risk in real-time
            </p>
          </header>

          <Tabs defaultValue="transfers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="transfers" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Stablecoin Transfers
              </TabsTrigger>
              <TabsTrigger value="wallet" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Wallet Analysis
              </TabsTrigger>
              <TabsTrigger value="monitor" className="flex items-center gap-2">
                <Radio className="w-4 h-4" />
                Real-Time Monitor
              </TabsTrigger>
            </TabsList>

          <TabsContent value="transfers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Stablecoin Transfers
                  <Button 
                    onClick={fetchStablecoinTransfers}
                    disabled={isLoadingTransfers}
                    size="sm"
                  >
                    {isLoadingTransfers ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Refresh"
                    )}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Live tracking of USDC and USDT transfers on Ethereum
                </CardDescription>
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
                    {Array.isArray(transfers) && transfers.map((transfer, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Badge variant="outline">{transfer.tokenSymbol}</Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {parseFloat(transfer.amount).toLocaleString()}
                        </TableCell>
                        <TableCell className="font-mono">
                          {truncateAddress(transfer.senderAddress)}
                        </TableCell>
                        <TableCell className="font-mono">
                          {truncateAddress(transfer.receiverAddress)}
                        </TableCell>
                        <TableCell>
                          {formatTimestamp(transfer.timestamp)}
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!Array.isArray(transfers) || transfers.length === 0) && !isLoadingTransfers && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No transfers found. Click refresh to fetch latest data.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="wallet" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Risk Analysis</CardTitle>
                <CardDescription>
                  Analyze Ethereum wallets for AML compliance and risk factors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter Ethereum wallet address (0x...)"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="font-mono"
                  />
                  <Button 
                    onClick={analyzeWallet}
                    disabled={isAnalyzingWallet}
                  >
                    {isAnalyzingWallet ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                </div>

                {riskAnalysis && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Risk Level</span>
                        </div>
                        <Badge 
                          variant={getRiskBadgeVariant(riskAnalysis.riskLevel)}
                          className="mt-2"
                        >
                          {riskAnalysis.riskLevel} ({riskAnalysis.riskScore}/10)
                        </Badge>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">ETH Balance</div>
                        <div className="text-2xl font-bold">
                          {parseFloat(walletBalance).toFixed(4)} ETH
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Wallet Age</div>
                        <div className="text-2xl font-bold">
                          {riskAnalysis.walletAgeDays} days
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Total Transactions</div>
                        <div className="text-2xl font-bold">
                          {riskAnalysis.totalTransactions.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="text-sm text-muted-foreground">Failed TX Ratio</div>
                        <div className="text-2xl font-bold">
                          {(riskAnalysis.failedTransactionRatio * 100).toFixed(1)}%
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                <div className="space-y-6">
                  {transactions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Recent Transactions (Last 100)</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="max-h-96 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Hash</TableHead>
                                <TableHead>Value (ETH)</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Timestamp</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {transactions.map((tx) => (
                                <TableRow key={tx.hash}>
                                  <TableCell className="font-mono">
                                    {truncateAddress(tx.hash)}
                                  </TableCell>
                                  <TableCell className="font-mono">
                                    {parseFloat(tx.value).toFixed(6)}
                                  </TableCell>
                                  <TableCell className="font-mono">
                                    {truncateAddress(tx.from)}
                                  </TableCell>
                                  <TableCell className="font-mono">
                                    {truncateAddress(tx.to)}
                                  </TableCell>
                                  <TableCell>
                                    {tx.isError ? (
                                      <Badge variant="destructive">
                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                        Failed
                                      </Badge>
                                    ) : (
                                      <Badge variant="default">Success</Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    {formatTimestamp(tx.timestamp)}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {tokenTransfers.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Token Transfers</CardTitle>
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
                            {tokenTransfers.map((transfer, index) => (
                              <TableRow key={`${transfer.hash}-${index}`}>
                                <TableCell>
                                  <Badge variant="outline">
                                    {transfer.tokenSymbol || 'Unknown'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="font-mono">
                                  {parseFloat(transfer.value).toLocaleString()}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {truncateAddress(transfer.from)}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {truncateAddress(transfer.to)}
                                </TableCell>
                                <TableCell>
                                  {formatTimestamp(transfer.timeStamp)}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}

                  {internalTransactions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Internal Transactions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Hash</TableHead>
                              <TableHead>Value (ETH)</TableHead>
                              <TableHead>From</TableHead>
                              <TableHead>To</TableHead>
                              <TableHead>Status</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {internalTransactions.map((tx, index) => (
                              <TableRow key={`${tx.hash}-${index}`}>
                                <TableCell className="font-mono">
                                  {truncateAddress(tx.hash)}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {(parseFloat(tx.value) / 1e18).toFixed(6)}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {truncateAddress(tx.from)}
                                </TableCell>
                                <TableCell className="font-mono">
                                  {truncateAddress(tx.to)}
                                </TableCell>
                                <TableCell>
                                  {tx.isError === '1' ? (
                                    <Badge variant="destructive">
                                      <AlertTriangle className="w-3 h-3 mr-1" />
                                      Failed
                                    </Badge>
                                  ) : (
                                    <Badge variant="default">Success</Badge>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
            </TabsContent>

            <TabsContent value="monitor" className="space-y-6">
              <RealTimeMonitor />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
