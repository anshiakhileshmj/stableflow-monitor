
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Activity, Search, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface RelayLog {
  id: number;
  partner_id: string;
  chain: string;
  from_addr: string | null;
  to_addr: string;
  decision: string;
  risk_band: string;
  risk_score: number;
  reasons: string[];
  tx_hash: string | null;
  created_at: string;
}

export function RelayLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<RelayLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDecision, setFilterDecision] = useState<string>("all");
  const [filterChain, setFilterChain] = useState<string>("all");

  useEffect(() => {
    if (user) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("relay_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching relay logs:", error);
      toast.error("Failed to fetch relay logs");
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchTerm || 
      log.to_addr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.from_addr && log.from_addr.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.tx_hash && log.tx_hash.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDecision = filterDecision === "all" || log.decision === filterDecision;
    const matchesChain = filterChain === "all" || log.chain === filterChain;
    
    return matchesSearch && matchesDecision && matchesChain;
  });

  const getRiskColor = (band: string) => {
    switch (band) {
      case "LOW": return "bg-green-100 text-green-800";
      case "MEDIUM": return "bg-yellow-100 text-yellow-800";
      case "HIGH": return "bg-orange-100 text-orange-800";
      case "CRITICAL": return "bg-red-100 text-red-800";
      case "PROHIBITED": return "bg-red-200 text-red-900";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDecisionColor = (decision: string) => {
    return decision === "allowed" 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  if (!user) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Please sign in to view relay logs</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Relay Transaction Logs ({filteredLogs.length})
          </CardTitle>
          <CardDescription>
            Monitor all relay decisions and transaction activity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by address or tx hash..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDecision} onValueChange={setFilterDecision}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by decision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="allowed">Allowed</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterChain} onValueChange={setFilterChain}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by chain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Chains</SelectItem>
                <SelectItem value="ethereum">Ethereum</SelectItem>
                <SelectItem value="polygon">Polygon</SelectItem>
                <SelectItem value="arbitrum">Arbitrum</SelectItem>
                <SelectItem value="optimism">Optimism</SelectItem>
                <SelectItem value="base">Base</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Chain</TableHead>
                  <TableHead>To Address</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Tx Hash</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(log.created_at).toLocaleDateString()}
                        <br />
                        <span className="text-muted-foreground">
                          {new Date(log.created_at).toLocaleTimeString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {log.chain.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {log.to_addr.substring(0, 10)}...{log.to_addr.substring(log.to_addr.length - 8)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getDecisionColor(log.decision)}>
                        {log.decision.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRiskColor(log.risk_band)}>
                        {log.risk_band}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono">
                      {log.risk_score}
                    </TableCell>
                    <TableCell>
                      {log.tx_hash ? (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {log.tx_hash.substring(0, 10)}...
                          </span>
                          <a
                            href={`https://etherscan.io/tx/${log.tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
