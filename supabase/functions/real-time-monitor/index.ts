
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Network-specific stablecoin contracts
const NETWORK_STALECOINS: Record<string, string[]> = {
  eth: [
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
    "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    "0x6c3ea9036406852006290770bedfcaba0e23a0e8", // PYUSD
    "0x4c9edd5852cd905f086c759e8383e09bff1e68b3", // USDe
  ],
  polygon: [
    "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // USDC
    "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // USDT
  ],
  avalanche: [
    "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e", // USDC
    "0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7", // USDT
  ],
  arbitrum: [
    "0xaf88d065e77c8cc2239327c5edb3a432268e5831", // USDC
    "0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", // USDT
  ],
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, network = 'eth' } = await req.json();

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const bitqueryToken = Deno.env.get('BITQUERY_TOKEN');

    if (!supabaseUrl || !supabaseServiceKey || !bitqueryToken) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    switch (action) {
      case 'start_monitoring':
        return await startMonitoring(network, supabase, bitqueryToken);
      case 'get_recent_transfers':
        return await getRecentTransfers(network, supabase);
      case 'get_whale_alerts':
        return await getWhaleAlerts(network, supabase);
      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in real-time-monitor:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function startMonitoring(network: string, supabase: any, bitqueryToken: string) {
  console.log(`🚀 Starting real-time monitoring for ${network}...`);

  const stablecoinContracts = NETWORK_STALECOINS[network] || NETWORK_STALECOINS.eth;

  // Create a monitoring task that fetches data periodically
  const fetchData = async () => {
    try {
      console.log(`📡 Fetching real-time transfers for ${network}...`);

      const graphqlQuery = {
        query: `{
          EVM(dataset: realtime, network: ${network}) {
            Transfers(
              where: {
                Transfer: {
                  Currency: {
                    SmartContract: {
                      in: [${stablecoinContracts.map(addr => `"${addr}"`).join(', ')}]
                    }
                  }
                }
              }
              limit: { count: 100 }
              orderBy: { descending: Block_Time }
            ) {
              Block {
                Time
                Number
              }
              Transaction {
                Hash
              }
              Transfer {
                Amount
                Currency {
                  Name
                  Symbol
                }
                Sender
                Receiver
              }
            }
          }
        }`
      };

      const response = await fetch('https://streaming.bitquery.io/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${bitqueryToken}`
        },
        body: JSON.stringify(graphqlQuery)
      });

      if (!response.ok) {
        console.error(`Bitquery API error for ${network}:`, await response.text());
        return;
      }

      const data = await response.json();
      const transfers = data?.data?.EVM?.Transfers || [];

      if (transfers.length === 0) {
        console.log(`No transfers found for ${network}`);
        return;
      }

      // Process and store transfers
      const processedTransfers = transfers.map((transfer: any) => {
        const usdValue = parseFloat(transfer.Transfer.Amount) || 0;
        const isWhale = usdValue >= 100000; // $100k threshold

        return {
          id: `${transfer.Transaction.Hash}-${Date.now()}`,
          hash: transfer.Transaction.Hash,
          timestamp: transfer.Block.Time,
          block_number: transfer.Block.Number,
          from_address: transfer.Transfer.Sender,
          to_address: transfer.Transfer.Receiver,
          amount: parseFloat(transfer.Transfer.Amount),
          currency: transfer.Transfer.Currency.Symbol,
          usd_value: usdValue,
          is_whale: isWhale,
          network: network
        };
      });

      // Insert into database
      const { error } = await supabase
        .from('real_time_transfers')
        .upsert(processedTransfers, { onConflict: 'hash' });

      if (error) {
        console.error(`Error inserting transfers for ${network}:`, error);
      } else {
        console.log(`✅ Processed ${processedTransfers.length} transfers for ${network}`);
      }

    } catch (error) {
      console.error(`Error fetching data for ${network}:`, error);
    }
  };

  // Initial fetch
  await fetchData();

  // Set up periodic fetching
  setInterval(fetchData, 10000); // Every 10 seconds

  return new Response(JSON.stringify({ 
    success: true, 
    message: `Monitoring started for ${network}` 
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function getRecentTransfers(network: string, supabase: any) {
  try {
    const { data, error } = await supabase
      .from('real_time_transfers')
      .select('*')
      .eq('network', network)
      .order('timestamp', { ascending: false })
      .limit(100);

    if (error) throw error;

    return new Response(JSON.stringify({ transfers: data || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`Error getting recent transfers for ${network}:`, error);
    return new Response(JSON.stringify({ 
      transfers: [], 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function getWhaleAlerts(network: string, supabase: any) {
  try {
    const { data, error } = await supabase
      .from('real_time_transfers')
      .select('*')
      .eq('network', network)
      .eq('is_whale', true)
      .order('timestamp', { ascending: false })
      .limit(50);

    if (error) throw error;

    return new Response(JSON.stringify({ whales: data || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`Error getting whale alerts for ${network}:`, error);
    return new Response(JSON.stringify({ 
      whales: [], 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}
