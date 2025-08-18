
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
    const { walletAddress, startDate, endDate, limit = 100 } = await req.json()
    
    if (!walletAddress || !startDate || !endDate) {
      return new Response(
        JSON.stringify({ error: 'walletAddress, startDate, and endDate are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const etherscanApiKey = Deno.env.get('ETHERSCAN_API_KEY')
    if (!etherscanApiKey) {
      return new Response(
        JSON.stringify({ error: 'Etherscan API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('🔍 Fetching wallet history for:', walletAddress, 'from', startDate, 'to', endDate)

    // Convert dates to timestamps
    const startTimestamp = Math.floor(new Date(startDate).getTime() / 1000)
    const endTimestamp = Math.floor(new Date(endDate).getTime() / 1000)

    // Fetch normal transactions
    const normalTxUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=${limit}&sort=desc&apikey=${etherscanApiKey}`
    
    console.log('📡 Calling Etherscan API for normal transactions')
    const normalTxResponse = await fetch(normalTxUrl)
    const normalTxData = await normalTxResponse.json()

    if (normalTxData.status !== '1') {
      console.error('Etherscan API error:', normalTxData.message)
      return new Response(
        JSON.stringify({ error: normalTxData.message || 'Failed to fetch transactions' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Filter transactions by timestamp
    const filteredTransactions = normalTxData.result.filter(tx => {
      const txTimestamp = parseInt(tx.timeStamp)
      return txTimestamp >= startTimestamp && txTimestamp <= endTimestamp
    })

    // Transform to match our expected format
    const transformedTransactions = filteredTransactions.map(tx => ({
      Transaction: {
        Hash: tx.hash,
        From: tx.from,
        To: tx.to,
        Value: tx.value, // This is in Wei
        Gas: tx.gas,
        GasPrice: tx.gasPrice,
        Cost: (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)).toString()
      },
      Block: {
        Number: parseInt(tx.blockNumber),
        Time: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        Date: new Date(parseInt(tx.timeStamp) * 1000).toISOString().split('T')[0]
      },
      Fee: {
        SenderFee: (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)).toString()
      },
      TransactionStatus: {
        Success: tx.txreceipt_status === '1'
      }
    }))

    const transactionCount = transformedTransactions.length
    console.log('✅ Fetched and filtered', transactionCount, 'transactions')

    const result = {
      data: {
        EVM: {
          Transactions: transformedTransactions
        }
      }
    }

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
