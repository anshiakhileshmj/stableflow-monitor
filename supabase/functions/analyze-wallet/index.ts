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
    const { walletAddress } = await req.json();
    
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    const etherscanApiKey = Deno.env.get('ETHERSCAN_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!etherscanApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Analyzing wallet: ${walletAddress}`);

    console.log(`Fetching detailed wallet info for: ${walletAddress}`);

    // Fetch transactions from Etherscan (limit to 100)
    const etherscanUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc&apikey=${etherscanApiKey}`;
    
    // Fetch account balance
    const balanceUrl = `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherscanApiKey}`;
    
    // Fetch internal transactions
    const internalTxUrl = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${etherscanApiKey}`;
    
    // Fetch ERC20 token transfers
    const tokenTransfersUrl = `https://api.etherscan.io/api?module=account&action=tokentx&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=50&sort=desc&apikey=${etherscanApiKey}`;

    const [etherscanResponse, balanceResponse, internalTxResponse, tokenTransfersResponse] = await Promise.all([
      fetch(etherscanUrl),
      fetch(balanceUrl),
      fetch(internalTxUrl),
      fetch(tokenTransfersUrl)
    ]);

    const [etherscanData, balanceData, internalTxData, tokenTransfersData] = await Promise.all([
      etherscanResponse.json(),
      balanceResponse.json(),
      internalTxResponse.json(),
      tokenTransfersResponse.json()
    ]);

    if (etherscanData.status !== '1') {
      throw new Error(`Etherscan API error: ${etherscanData.message}`);
    }

    const transactions = etherscanData.result;
    const balance = balanceData.status === '1' ? (parseFloat(balanceData.result) / 1e18).toFixed(6) : '0';
    const internalTransactions = internalTxData.status === '1' ? internalTxData.result : [];
    const tokenTransfers = tokenTransfersData.status === '1' ? tokenTransfersData.result : [];

    console.log(`Found ${transactions.length} transactions, ${internalTransactions.length} internal txs, ${tokenTransfers.length} token transfers`);

    // Process and format transactions
    const processedTransactions = transactions.map((tx: any) => ({
      hash: tx.hash,
      timestamp: new Date(parseInt(tx.timeStamp) * 1000),
      value: (parseFloat(tx.value) / 1e18).toFixed(6), // Convert wei to ETH
      from: tx.from,
      to: tx.to,
      isError: tx.isError === '1'
    }));

    // Calculate wallet risk metrics
    const totalTxs = transactions.length;
    const failedTxs = transactions.filter((tx: any) => tx.isError === '1').length;
    const failedRatio = totalTxs > 0 ? (failedTxs / totalTxs) : 0;
    
    // Get oldest transaction for wallet age
    const oldestTx = transactions.length > 0 ? transactions[transactions.length - 1] : null;
    const firstTxDate = oldestTx ? new Date(parseInt(oldestTx.timeStamp) * 1000) : null;
    const walletAgeDays = firstTxDate ? Math.floor((Date.now() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    // Calculate risk score (1-10, where 10 is highest risk)
    let riskScore = 1;
    
    // Age factor (newer wallets are riskier)
    if (walletAgeDays < 30) riskScore += 3;
    else if (walletAgeDays < 90) riskScore += 2;
    else if (walletAgeDays < 365) riskScore += 1;
    
    // Transaction volume factor
    if (totalTxs < 10) riskScore += 2;
    else if (totalTxs < 50) riskScore += 1;
    
    // Failed transaction factor
    if (failedRatio > 0.1) riskScore += 2;
    else if (failedRatio > 0.05) riskScore += 1;
    
    // Cap at 10
    riskScore = Math.min(riskScore, 10);
    
    const riskLevel = riskScore <= 3 ? 'LOW' : riskScore <= 6 ? 'MEDIUM' : 'HIGH';

    // Store transactions in database
    if (processedTransactions.length > 0) {
      const transactionsToInsert = processedTransactions.map((tx: any) => ({
        wallet_address: walletAddress.toLowerCase(),
        tx_hash: tx.hash,
        timestamp: tx.timestamp,
        value_eth: parseFloat(tx.value),
        from_address: tx.from,
        to_address: tx.to,
        is_error: tx.isError
      }));

      // Insert transactions (ignore conflicts)
      const { error: txError } = await supabase
        .from('wallet_transactions')
        .upsert(transactionsToInsert, { onConflict: 'tx_hash' });

      if (txError) {
        console.error('Error inserting transactions:', txError);
      }
    }

    // Store or update risk rating
    const riskData = {
      wallet_address: walletAddress.toLowerCase(),
      first_tx_date: firstTxDate,
      total_transactions: totalTxs,
      failed_transactions: failedTxs,
      wallet_age_days: walletAgeDays,
      failed_tx_ratio: failedRatio,
      risk_score: riskScore,
      risk_level: riskLevel,
      last_updated: new Date()
    };

    const { error: riskError } = await supabase
      .from('wallet_risk_ratings')
      .upsert(riskData, { onConflict: 'wallet_address' });

    if (riskError) {
      console.error('Error inserting risk rating:', riskError);
    }

    return new Response(JSON.stringify({
      walletAddress,
      transactions: processedTransactions, // Return all 100 transactions
      balance: balance,
      internalTransactions: internalTransactions.slice(0, 20),
      tokenTransfers: tokenTransfers.slice(0, 20),
      riskAnalysis: {
        totalTransactions: totalTxs,
        failedTransactions: failedTxs,
        failedTransactionRatio: failedRatio,
        walletAgeDays,
        riskScore,
        riskLevel
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-wallet function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});