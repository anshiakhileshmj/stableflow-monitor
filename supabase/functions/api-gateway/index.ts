
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const url = new URL(req.url);
  const path = url.pathname.replace('/api-gateway', '');
  const method = req.method;
  const clientIp = req.headers.get('x-forwarded-for') || 'unknown';

  try {
    // Extract API key from header
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'API key required', 
        message: 'Please provide your API key in the X-API-Key header' 
      }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Hash the API key for database lookup
    const encoder = new TextEncoder();
    const keyData = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
    const hashArray = new Uint8Array(hashBuffer);
    const hashHex = Array.from(hashArray).map(b => b.toString(16).padStart(2, '0')).join('');

    // Check rate limit
    const { data: rateLimitCheck } = await supabase.rpc('check_api_rate_limit', {
      api_key_hash: hashHex,
      endpoint: path
    });

    if (!rateLimitCheck) {
      await logUsage(supabase, hashHex, path, clientIp, 429, Date.now() - startTime);
      return new Response(JSON.stringify({
        error: 'Rate limit exceeded',
        message: 'You have exceeded your rate limit. Please try again later.'
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Route to appropriate handler based on path
    let response;
    switch (path) {
      case '/analyze-wallet':
        response = await handleAnalyzeWallet(req);
        break;
      case '/wallet-history':
        response = await handleWalletHistory(req);
        break;
      case '/stablecoin-transfers':
        response = await handleStablecoinTransfers(req);
        break;
      case '/wallet-balances':
        response = await handleWalletBalances(req);
        break;
      default:
        response = new Response(JSON.stringify({
          error: 'Endpoint not found',
          message: `The endpoint ${path} does not exist`
        }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    // Log successful usage
    await logUsage(supabase, hashHex, path, clientIp, response.status, Date.now() - startTime);
    
    // Add CORS headers to response
    const finalResponse = new Response(response.body, {
      status: response.status,
      headers: { ...corsHeaders, ...Object.fromEntries(response.headers) }
    });

    return finalResponse;

  } catch (error) {
    console.error('API Gateway error:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      message: 'An unexpected error occurred'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});

async function logUsage(supabase: any, keyHash: string, endpoint: string, ip: string, statusCode: number, responseTime: number) {
  try {
    await supabase.rpc('log_api_usage', {
      api_key_hash: keyHash,
      endpoint_path: endpoint,
      ip_addr: ip,
      status_code: statusCode,
      response_time_ms: responseTime
    });
  } catch (error) {
    console.error('Failed to log usage:', error);
  }
}

async function handleAnalyzeWallet(req: Request) {
  const body = await req.json();
  const { walletAddress, network = 'ethereum' } = body;

  if (!walletAddress) {
    return new Response(JSON.stringify({
      error: 'Missing required parameter',
      message: 'walletAddress is required'
    }), { status: 400 });
  }

  // Call the existing analyze-wallet function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/analyze-wallet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({ walletAddress, network })
  });

  return response;
}

async function handleWalletHistory(req: Request) {
  const body = await req.json();
  const { walletAddress, startDate, endDate, network = 'ethereum', limit = 100 } = body;

  if (!walletAddress || !startDate || !endDate) {
    return new Response(JSON.stringify({
      error: 'Missing required parameters',
      message: 'walletAddress, startDate, and endDate are required'
    }), { status: 400 });
  }

  // Call the existing wallet-history function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/wallet-history`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({ walletAddress, startDate, endDate, network, limit })
  });

  return response;
}

async function handleStablecoinTransfers(req: Request) {
  const url = new URL(req.url);
  const network = url.searchParams.get('network') || 'eth';

  // Call the existing fetch-stablecoin-transfers function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/fetch-stablecoin-transfers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({ network })
  });

  return response;
}

async function handleWalletBalances(req: Request) {
  const body = await req.json();
  const { addresses, network = 'eth' } = body;

  if (!addresses || !Array.isArray(addresses)) {
    return new Response(JSON.stringify({
      error: 'Missing required parameter',
      message: 'addresses array is required'
    }), { status: 400 });
  }

  // Call the existing bitquery-balance function
  const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/bitquery-balance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
    },
    body: JSON.stringify({ addresses, network })
  });

  return response;
}
