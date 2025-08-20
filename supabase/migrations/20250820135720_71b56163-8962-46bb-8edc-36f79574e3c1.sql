
-- Create sanctioned_wallets table for OFAC and other sanctioned addresses
CREATE TABLE public.sanctioned_wallets (
  address TEXT PRIMARY KEY,
  source TEXT NOT NULL DEFAULT 'OFAC',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk_scores table for cached wallet risk assessments
CREATE TABLE public.risk_scores (
  wallet TEXT PRIMARY KEY,
  score INTEGER NOT NULL DEFAULT 0,
  band TEXT NOT NULL DEFAULT 'LOW',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create risk_events table for logging individual risk features
CREATE TABLE public.risk_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet TEXT NOT NULL,
  feature TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  weight_applied INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create relay_logs table for audit trail of all relay decisions
CREATE TABLE public.relay_logs (
  id SERIAL PRIMARY KEY,
  partner_id TEXT,
  chain TEXT NOT NULL,
  from_addr TEXT,
  to_addr TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('allowed', 'blocked')),
  risk_band TEXT NOT NULL,
  risk_score INTEGER NOT NULL DEFAULT 0,
  reasons TEXT[] DEFAULT '{}',
  tx_hash TEXT,
  idempotency_key TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add partner_id column to existing api_keys table to support relay-API requirements
ALTER TABLE public.api_keys ADD COLUMN IF NOT EXISTS partner_id TEXT;

-- Create indexes for better performance
CREATE INDEX idx_sanctioned_wallets_address ON public.sanctioned_wallets(address);
CREATE INDEX idx_risk_scores_wallet ON public.risk_scores(wallet);
CREATE INDEX idx_risk_events_wallet ON public.risk_events(wallet);
CREATE INDEX idx_risk_events_created_at ON public.risk_events(created_at);
CREATE INDEX idx_relay_logs_partner_id ON public.relay_logs(partner_id);
CREATE INDEX idx_relay_logs_to_addr ON public.relay_logs(to_addr);
CREATE INDEX idx_relay_logs_created_at ON public.relay_logs(created_at);

-- Enable Row Level Security
ALTER TABLE public.sanctioned_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relay_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for sanctioned_wallets (public read access for relay-API)
CREATE POLICY "Allow public read access to sanctioned wallets" 
  ON public.sanctioned_wallets 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow service role full access to sanctioned wallets" 
  ON public.sanctioned_wallets 
  FOR ALL 
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- RLS Policies for risk_scores (public read access for relay-API)
CREATE POLICY "Allow public read access to risk scores" 
  ON public.risk_scores 
  FOR SELECT 
  USING (true);

CREATE POLICY "Allow service role full access to risk scores" 
  ON public.risk_scores 
  FOR ALL 
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- RLS Policies for risk_events (service role access only)
CREATE POLICY "Allow service role full access to risk events" 
  ON public.risk_events 
  FOR ALL 
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);

-- RLS Policies for relay_logs (users can view logs for their API keys)
CREATE POLICY "Users can view their own relay logs" 
  ON public.relay_logs 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM api_keys 
      WHERE api_keys.partner_id = relay_logs.partner_id 
      AND api_keys.user_id = auth.uid()
    )
  );

CREATE POLICY "Allow service role full access to relay logs" 
  ON public.relay_logs 
  FOR ALL 
  USING ((auth.jwt() ->> 'role'::text) = 'service_role'::text);
