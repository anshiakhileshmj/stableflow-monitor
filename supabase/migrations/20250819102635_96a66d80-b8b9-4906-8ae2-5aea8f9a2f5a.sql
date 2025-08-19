
-- Add network column to wallet_risk_ratings table if it doesn't exist
ALTER TABLE wallet_risk_ratings ADD COLUMN IF NOT EXISTS network text DEFAULT 'ethereum';

-- Create API endpoints documentation table
CREATE TABLE IF NOT EXISTS api_endpoints (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  method text NOT NULL,
  path text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  parameters jsonb DEFAULT '{}',
  response_schema jsonb DEFAULT '{}',
  example_request text,
  example_response text,
  rate_limit integer DEFAULT 60,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on api_endpoints (public read access for documentation)
ALTER TABLE api_endpoints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to api endpoints" ON api_endpoints
  FOR SELECT USING (true);

CREATE POLICY "Allow service role full access to api endpoints" ON api_endpoints
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Insert API endpoint documentation
INSERT INTO api_endpoints (name, method, path, description, category, parameters, response_schema, example_request, example_response) VALUES
('Analyze Wallet', 'POST', '/analyze-wallet', 'Analyze a wallet address for risk assessment and transaction history', 'Wallet Analysis', 
  '{"walletAddress": {"type": "string", "required": true, "description": "The wallet address to analyze"}, "network": {"type": "string", "required": false, "default": "ethereum", "description": "The blockchain network (ethereum, polygon, avalanche, arbitrum, xrp)"}}',
  '{"walletAddress": "string", "network": "string", "transactions": "array", "balance": "string", "riskAnalysis": {"totalTransactions": "number", "failedTransactions": "number", "riskScore": "number", "riskLevel": "string"}}',
  '{"walletAddress": "0x742d35Cc6634C0532925a3b8D81d92d2623C7245", "network": "ethereum"}',
  '{"walletAddress": "0x742d35Cc6634C0532925a3b8D81d92d2623C7245", "network": "ethereum", "balance": "1.234567", "riskAnalysis": {"totalTransactions": 150, "failedTransactions": 2, "riskScore": 3, "riskLevel": "LOW"}}'
),
('Get Wallet History', 'POST', '/wallet-history', 'Retrieve transaction history for a wallet address within a date range', 'Transaction History',
  '{"walletAddress": {"type": "string", "required": true}, "startDate": {"type": "string", "required": true, "description": "ISO date string"}, "endDate": {"type": "string", "required": true, "description": "ISO date string"}, "network": {"type": "string", "required": false, "default": "ethereum"}, "limit": {"type": "number", "required": false, "default": 100}}',
  '{"data": {"EVM": {"Transactions": "array"}}}',
  '{"walletAddress": "0x742d35Cc6634C0532925a3b8D81d92d2623C7245", "startDate": "2024-01-01", "endDate": "2024-01-31", "network": "ethereum"}',
  '{"data": {"EVM": {"Transactions": [{"Transaction": {"Hash": "0x...", "From": "0x...", "To": "0x...", "Value": "1000000000000000000"}}]}}}'
),
('Get Stablecoin Transfers', 'GET', '/stablecoin-transfers', 'Fetch recent stablecoin transfers across networks', 'Market Data',
  '{"network": {"type": "string", "required": false, "default": "all", "description": "Filter by specific network or get all"}, "limit": {"type": "number", "required": false, "default": 50}}',
  '{"transfers": "array", "total": "number"}',
  'GET /api/stablecoin-transfers?network=ethereum&limit=25',
  '{"transfers": [{"tokenSymbol": "USDC", "amount": "10000", "senderAddress": "0x...", "receiverAddress": "0x...", "timestamp": "2024-01-01T00:00:00Z"}]}'
),
('Get Wallet Balances', 'POST', '/wallet-balances', 'Get current balances for multiple wallet addresses', 'Balance Tracking',
  '{"addresses": {"type": "array", "required": true, "description": "Array of wallet addresses"}, "network": {"type": "string", "required": false, "default": "eth"}}',
  '{"balances": "object"}',
  '{"addresses": ["0x742d35Cc6634C0532925a3b8D81d92d2623C7245"], "network": "eth"}',
  '{"0x742d35cc6634c0532925a3b8d81d92d2623c7245": {"address": "0x742d35cc6634c0532925a3b8d81d92d2623c7245", "native": {"amount": "1234567890000000000"}}}'
);

-- Create developer profiles table for additional user info
CREATE TABLE IF NOT EXISTS developer_profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  company_name text,
  website text,
  api_usage_plan text DEFAULT 'free',
  monthly_request_limit integer DEFAULT 1000,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on developer_profiles
ALTER TABLE developer_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own developer profile" ON developer_profiles
  FOR ALL USING (auth.uid() = user_id);

-- Add function to check API rate limits
CREATE OR REPLACE FUNCTION check_api_rate_limit(api_key_hash text, endpoint text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_record RECORD;
  usage_count INTEGER;
  rate_limit INTEGER;
BEGIN
  -- Get API key details
  SELECT * INTO key_record 
  FROM api_keys 
  WHERE key_hash = api_key_hash AND is_active = true 
    AND (expires_at IS NULL OR expires_at > now());
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Get rate limit for this key
  rate_limit := key_record.rate_limit_per_minute;
  
  -- Count usage in the last minute
  SELECT COUNT(*) INTO usage_count
  FROM api_usage
  WHERE api_key_id = key_record.id 
    AND endpoint = check_api_rate_limit.endpoint
    AND timestamp > now() - interval '1 minute';
  
  -- Update last_used_at
  UPDATE api_keys 
  SET last_used_at = now() 
  WHERE id = key_record.id;
  
  RETURN usage_count < rate_limit;
END;
$$;

-- Add function to log API usage
CREATE OR REPLACE FUNCTION log_api_usage(
  api_key_hash text,
  endpoint_path text,
  ip_addr text,
  status_code integer,
  response_time_ms integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  key_id uuid;
BEGIN
  -- Get API key ID
  SELECT id INTO key_id 
  FROM api_keys 
  WHERE key_hash = api_key_hash;
  
  IF FOUND THEN
    INSERT INTO api_usage (api_key_id, endpoint, ip_address, status_code, response_time_ms)
    VALUES (key_id, endpoint_path, ip_addr, status_code, response_time_ms);
  END IF;
END;
$$;
