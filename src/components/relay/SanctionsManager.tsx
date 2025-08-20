
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Upload, Plus, Trash2, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SanctionedWallet {
  address: string;
  source: string;
  created_at: string;
}

export function SanctionsManager() {
  const [sanctionedWallets, setSanctionedWallets] = useState<SanctionedWallet[]>([]);
  const [loading, setLoading] = useState(false);
  const [newAddress, setNewAddress] = useState("");
  const [newSource, setNewSource] = useState("OFAC");
  const [bulkData, setBulkData] = useState("");

  useEffect(() => {
    fetchSanctionedWallets();
  }, []);

  const fetchSanctionedWallets = async () => {
    try {
      const { data, error } = await supabase
        .from("sanctioned_wallets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      setSanctionedWallets(data || []);
    } catch (error) {
      console.error("Error fetching sanctioned wallets:", error);
      toast.error("Failed to fetch sanctioned wallets");
    }
  };

  const addSingleAddress = async () => {
    if (!newAddress.trim()) {
      toast.error("Address is required");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("sanctioned_wallets")
        .upsert({
          address: newAddress.toLowerCase().trim(),
          source: newSource
        });

      if (error) throw error;

      toast.success("Address added successfully");
      setNewAddress("");
      fetchSanctionedWallets();
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Failed to add address");
    } finally {
      setLoading(false);
    }
  };

  const bulkImport = async () => {
    if (!bulkData.trim()) {
      toast.error("Please provide data to import");
      return;
    }

    setLoading(true);
    try {
      let addresses: string[] = [];

      // Try to parse as JSON first
      try {
        const jsonData = JSON.parse(bulkData);
        if (Array.isArray(jsonData)) {
          addresses = jsonData.map(addr => String(addr).toLowerCase().trim());
        } else {
          throw new Error("JSON must be an array");
        }
      } catch {
        // If JSON parsing fails, treat as text (one address per line)
        addresses = bulkData
          .split('\n')
          .map(line => line.trim().toLowerCase())
          .filter(line => line.length > 0);
      }

      if (addresses.length === 0) {
        toast.error("No valid addresses found");
        return;
      }

      // Batch insert in chunks of 1000
      const batchSize = 1000;
      let totalImported = 0;

      for (let i = 0; i < addresses.length; i += batchSize) {
        const batch = addresses.slice(i, i + batchSize);
        const rows = batch.map(address => ({
          address,
          source: newSource
        }));

        const { error } = await supabase
          .from("sanctioned_wallets")
          .upsert(rows, { onConflict: "address" });

        if (error) throw error;
        totalImported += batch.length;
      }

      toast.success(`Successfully imported ${totalImported} addresses`);
      setBulkData("");
      fetchSanctionedWallets();
    } catch (error) {
      console.error("Error importing addresses:", error);
      toast.error("Failed to import addresses");
    } finally {
      setLoading(false);
    }
  };

  const deleteAddress = async (address: string) => {
    try {
      const { error } = await supabase
        .from("sanctioned_wallets")
        .delete()
        .eq("address", address);

      if (error) throw error;

      toast.success("Address removed successfully");
      fetchSanctionedWallets();
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to remove address");
    }
  };

  const exportData = () => {
    const jsonData = JSON.stringify(sanctionedWallets.map(w => w.address), null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sanctioned_wallets_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Single Address
            </CardTitle>
            <CardDescription>
              Add a single sanctioned wallet address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Wallet Address</Label>
              <Input
                id="address"
                placeholder="0x..."
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="OFAC, EU, etc."
                value={newSource}
                onChange={(e) => setNewSource(e.target.value)}
              />
            </div>
            <Button onClick={addSingleAddress} disabled={loading} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Address
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Bulk Import
            </CardTitle>
            <CardDescription>
              Import multiple addresses from JSON array or text (one per line)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bulk-data">Addresses Data</Label>
              <Textarea
                id="bulk-data"
                placeholder='["0x123...", "0x456..."] or one address per line'
                value={bulkData}
                onChange={(e) => setBulkData(e.target.value)}
                rows={6}
              />
            </div>
            <Button onClick={bulkImport} disabled={loading} className="w-full">
              <Upload className="mr-2 h-4 w-4" />
              Import Addresses
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Sanctioned Wallets ({sanctionedWallets.length})
            </CardTitle>
            <CardDescription>
              Manage the list of sanctioned wallet addresses
            </CardDescription>
          </div>
          <Button onClick={exportData} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export JSON
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Address</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sanctionedWallets.map((wallet) => (
                  <TableRow key={wallet.address}>
                    <TableCell className="font-mono text-sm">
                      {wallet.address}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{wallet.source}</Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(wallet.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteAddress(wallet.address)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
