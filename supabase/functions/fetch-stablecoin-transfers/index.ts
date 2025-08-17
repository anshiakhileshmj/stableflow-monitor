import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bitqueryToken = Deno.env.get('BITQUERY_TOKEN');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!bitqueryToken || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Fetching stablecoin transfers from Bitquery...');

    const graphqlQuery = {
      query: `{
        EVM(dataset: realtime, network: eth) {
          Transfers(
            where: {
              Transfer: {
                Currency: {
                  SmartContract: {
                    in: [
                      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
                      "0xdac17f958d2ee523a2206206994597c13d831ec7"
                    ]
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
      console.error('Bitquery API error:', errorText);
      // Return empty transfers array instead of throwing error
      return new Response(JSON.stringify({ 
        transfers: [],
        error: `Bitquery API error: ${bitqueryResponse.status}`,
        message: 'Failed to fetch from Bitquery API'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const bitqueryData = await bitqueryResponse.json();
    console.log('Bitquery response:', JSON.stringify(bitqueryData, null, 2));

    if (!bitqueryData.data?.EVM?.Transfers) {
      console.error('Invalid response structure from Bitquery:', bitqueryData);
      // Return empty transfers array instead of throwing error
      return new Response(JSON.stringify({ 
        transfers: [],
        error: 'Invalid response structure from Bitquery',
        message: 'No transfer data available'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const transfers = bitqueryData.data.EVM.Transfers;

    // Store transfers in database
    const transfersToInsert = transfers.map((transfer: any) => ({
      block_time: new Date(transfer.Block.Time),
      token_symbol: transfer.Transfer.Currency.Symbol,
      token_name: transfer.Transfer.Currency.Name,
      amount: parseFloat(transfer.Transfer.Amount),
      sender_address: transfer.Transfer.Sender,
      receiver_address: transfer.Transfer.Receiver,
      network: 'ethereum'
    }));

    if (transfersToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('stablecoin_transfers')
        .insert(transfersToInsert);

      if (insertError) {
        console.error('Error inserting transfers:', insertError);
      } else {
        console.log(`Inserted ${transfersToInsert.length} transfers`);
      }
    }

    // Format response for frontend
    const formattedTransfers = transfers.map((transfer: any) => ({
      tokenSymbol: transfer.Transfer.Currency.Symbol,
      tokenName: transfer.Transfer.Currency.Name,
      amount: transfer.Transfer.Amount,
      senderAddress: transfer.Transfer.Sender,
      receiverAddress: transfer.Transfer.Receiver,
      timestamp: transfer.Block.Time
    }));

    return new Response(JSON.stringify({ transfers: formattedTransfers }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in fetch-stablecoin-transfers function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      transfers: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});