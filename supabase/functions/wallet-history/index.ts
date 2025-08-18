
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { walletAddress, network = 'eth', startDate, endDate, limit = 100 } = await req.json()
    
    if (!walletAddress || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: 'walletAddress, startDate, and endDate are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const bitqueryToken = Deno.env.get('BITQUERY_TOKEN')
    if (!bitqueryToken) {
      return new Response(
        JSON.stringify({ error: 'Bitquery token not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔍 Fetching wallet history for:', walletAddress, 'from', startDate, 'to', endDate)

    const query = `
      query WalletHistory($address: String!, $startDate: String, $endDate: String, $limit: Int) {
        EVM(dataset: combined, network: ${network}) {
          Transactions(
            where: {
              any: [
                {Transaction: {From: {is: $address}}},
                {Transaction: {To: {is: $address}}}
              ],
              Block: {Date: {since: $startDate, till: $endDate}}
            }
            orderBy: {descending: Block_Time}
            limit: {count: $limit}
          ) {
            Transaction {
              Hash
              From
              To
              Value
              Gas
              GasPrice
              Cost
            }
            Block {
              Number
              Time
              Date
            }
            Fee {
              SenderFee
            }
            TransactionStatus {
              Success
            }
          }
        }
      }
    `

    const response = await fetch('https://streaming.bitquery.io/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': bitqueryToken,
        'Authorization': `Bearer ${bitqueryToken}`
      },
      body: JSON.stringify({
        query,
        variables: { 
          address: walletAddress.toLowerCase(), 
          startDate: startDate.split('T')[0], // Convert to YYYY-MM-DD format
          endDate: endDate.split('T')[0],     // Convert to YYYY-MM-DD format
          limit 
        }
      })
    })

    const result = await response.json()
    
    if (result.errors) {
      console.error('Bitquery errors:', result.errors)
      return new Response(
        JSON.stringify({ error: result.errors[0].message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const transactionCount = result.data?.EVM?.Transactions?.length || 0
    console.log('✅ Fetched', transactionCount, 'transactions')

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
