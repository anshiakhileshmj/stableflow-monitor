
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Network-specific stablecoin contracts
const NETWORK_STABLECOINS: Record<string, string[]> = {
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
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { network = 'eth' } = await req.json();
    
    const bitqueryToken = Deno.env.get('BITQUERY_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Environment check:', {
      hasBitqueryToken: !!bitqueryToken,
      hasSupabaseUrl: !!supabaseUrl,
      hasServiceKey: !!supabaseServiceKey,
      bitqueryTokenLength: bitqueryToken ? bitqueryToken.length : 0
    });

    if (!bitqueryToken) {
      console.error('BITQUERY_TOKEN is missing from environment variables');
      return new Response(JSON.stringify({ 
        transfers: [],
        error: 'BitQuery API token not configured',
        message: 'API token is required for fetching transfer data'
      }), {
        status: 200, // Return 200 to avoid breaking the frontend
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return new Response(JSON.stringify({ 
        transfers: [],
        error: 'Database configuration missing',
        message: 'Database connection not available'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Fetching stablecoin transfers from BitQuery for ${network}...`);

    const stablecoinContracts = NETWORK_STABLECOINS[network] || NETWORK_STABLECOINS.eth;

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
            limit: { count: 50 }
            orderBy: { descending: Block_Time }
          ) {
            Block {
              Time
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

    console.log('Making request to BitQuery API...');
    const bitqueryResponse = await fetch('https://streaming.bitquery.io/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${bitqueryToken}`
      },
      body: JSON.stringify(graphqlQuery)
    });

    if (!bitqueryResponse.ok) {
      const errorText = await bitqueryResponse.text();
      console.error('BitQuery API error:', {
        status: bitqueryResponse.status,
        statusText: bitqueryResponse.statusText,
        error: errorText
      });
      
      return new Response(JSON.stringify({ 
        transfers: [],
        error: `BitQuery API error: ${bitqueryResponse.status}`,
        message: bitqueryResponse.status === 401 ? 'Invalid or expired BitQuery token' : 'Failed to fetch from BitQuery API'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const bitqueryData = await bitqueryResponse.json();
    console.log('BitQuery response received:', {
      hasData: !!bitqueryData.data,
      hasTransfers: !!bitqueryData.data?.EVM?.Transfers,
      transferCount: bitqueryData.data?.EVM?.Transfers?.length || 0
    });

    if (!bitqueryData.data?.EVM?.Transfers) {
      console.log('No transfer data in BitQuery response');
      return new Response(JSON.stringify({ 
        transfers: [],
        error: null,
        message: `No recent transfers found for ${network}`
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const transfers = bitqueryData.data.EVM.Transfers;

    // Store transfers in database with network info
    const transfersToInsert = transfers.map((transfer: any) => ({
      block_time: new Date(transfer.Block.Time),
      token_symbol: transfer.Transfer.Currency.Symbol,
      token_name: transfer.Transfer.Currency.Name,
      amount: parseFloat(transfer.Transfer.Amount),
      sender_address: transfer.Transfer.Sender,
      receiver_address: transfer.Transfer.Receiver,
      network: network
    }));

    if (transfersToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('stablecoin_transfers')
        .insert(transfersToInsert);

      if (insertError) {
        console.error('Error inserting transfers:', insertError);
      } else {
        console.log(`Inserted ${transfersToInsert.length} transfers for ${network}`);
      }
    }

    // Format response for frontend
    const formattedTransfers = transfers.map((transfer: any) => ({
      tokenSymbol: transfer.Transfer.Currency.Symbol,
      tokenName: transfer.Transfer.Currency.Name,
      amount: transfer.Transfer.Amount,
      senderAddress: transfer.Transfer.Sender,
      receiverAddress: transfer.Transfer.Receiver,
      timestamp: transfer.Block.Time,
      network: network
    }));

    return new Response(JSON.stringify({ transfers: formattedTransfers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-stablecoin-transfers function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      transfers: [],
      message: 'Internal server error occurred'
    }), {
      status: 200, // Return 200 to avoid breaking the frontend
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
