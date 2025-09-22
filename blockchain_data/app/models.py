from typing import Dict, Tuple

SCHEMA_SQL = {
	"stablecoin_transfers": """
	CREATE TABLE IF NOT EXISTS stablecoin_transfers (
		id SERIAL PRIMARY KEY,
		network TEXT,
		chain_id BIGINT,
		token TEXT,
		token_address TEXT,
		from_address TEXT,
		to_address TEXT,
		amount NUMERIC,
		tx_hash TEXT,
		log_index BIGINT,
		block_number BIGINT,
		block_timestamp TIMESTAMP,
		gas_used NUMERIC,
		gas_price NUMERIC,
		gas_fee NUMERIC,
		status TEXT,
		inserted_at TIMESTAMP DEFAULT now(),
		UNIQUE (tx_hash, log_index)
	);
	CREATE INDEX IF NOT EXISTS idx_transfers_block_ts ON stablecoin_transfers(block_timestamp DESC);
	CREATE INDEX IF NOT EXISTS idx_transfers_token ON stablecoin_transfers(token);
	CREATE INDEX IF NOT EXISTS idx_transfers_network ON stablecoin_transfers(network);
	""",
	"wallet_balances": """
	CREATE TABLE IF NOT EXISTS wallet_balances (
		id SERIAL PRIMARY KEY,
		wallet_address TEXT NOT NULL,
		network TEXT NOT NULL,
		token TEXT NOT NULL,
		token_address TEXT NOT NULL,
		balance NUMERIC NOT NULL,
		fetched_at TIMESTAMP NOT NULL DEFAULT now()
	);
	CREATE INDEX IF NOT EXISTS idx_balances_wallet_time ON wallet_balances(wallet_address, fetched_at DESC);
	""",
	"whale_transfers": """
	CREATE TABLE IF NOT EXISTS whale_transfers (
		id SERIAL PRIMARY KEY,
		network TEXT NOT NULL,
		token TEXT NOT NULL,
		token_address TEXT NOT NULL,
		from_address TEXT NOT NULL,
		to_address TEXT NOT NULL,
		amount NUMERIC NOT NULL,
		tx_hash TEXT NOT NULL,
		log_index BIGINT,
		block_number BIGINT NOT NULL,
		block_timestamp TIMESTAMP NOT NULL,
		gas_used NUMERIC,
		gas_price NUMERIC,
		gas_fee NUMERIC,
		status TEXT,
		inserted_at TIMESTAMP DEFAULT now(),
		UNIQUE (tx_hash, log_index)
	);
	CREATE INDEX IF NOT EXISTS idx_whales_block_ts ON whale_transfers(block_timestamp DESC);
	""",
	"whale_top_wallets": """
	CREATE TABLE IF NOT EXISTS whale_top_wallets (
		id SERIAL PRIMARY KEY,
		network TEXT,
		wallet_address TEXT,
		token TEXT,
		total_sent NUMERIC,
		total_received NUMERIC,
		last_updated TIMESTAMP DEFAULT now()
	);
	CREATE INDEX IF NOT EXISTS idx_whale_top_token ON whale_top_wallets(token);
	""",
	"api_keys": """
	CREATE TABLE IF NOT EXISTS api_keys (
		id SERIAL PRIMARY KEY,
		user_id UUID,
		api_key TEXT UNIQUE,
		created_at TIMESTAMP,
		usage_count INT
	);
	""",
}

# Minimal metadata for networks and tokens
NETWORKS: Dict[str, int] = {
	"Ethereum": 1,
	"Polygon": 137,
	"BSC": 56,
	"Arbitrum": 42161,
	"Avalanche": 43114,
}

# Token: per-network address and decimals
STABLECOINS: Dict[str, Dict[str, Tuple[str, int]]] = {
	"USDC": {
		"Ethereum": ("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", 6),
		"Polygon": ("0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", 6),
		"BSC": ("0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d", 18),
		"Arbitrum": ("0xff970a61a04b1ca14834a43f5de4533ebddb5cc8", 6),
		"Avalanche": ("0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E", 6),
	},
	"USDT": {
		"Ethereum": ("0xdAC17F958D2ee523a2206206994597C13D831ec7", 6),
		"Polygon": ("0xc2132D05D31c914a87C6611C10748AEb04B58e8F", 6),
		"BSC": ("0x55d398326f99059ff775485246999027b3197955", 18),
		"Arbitrum": ("0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9", 6),
		"Avalanche": ("0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7", 6),
	},
	"DAI": {
		"Ethereum": ("0x6B175474E89094C44Da98b954EedeAC495271d0F", 18),
		"Polygon": ("0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", 18),
		"BSC": ("0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", 18),
		"Arbitrum": ("0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1", 18),
		"Avalanche": ("0xd586e7f844cea2f87f50152665bcbc2c279d8d70", 18),
	},
	"BUSD": {
		"Ethereum": ("0x4fabb145d64652a948d72533023f6e7a623c7c53", 18),
		"BSC": ("0xe9e7cea3dedca5984780bafc599bd69add087d56", 18),
	},
	"USTC": {
		"Ethereum": ("0xa47c8bf37f92abed4a126bda807a7b7498661acd", 18),
		"Polygon": ("0x692597b009d13c4049a947cab2239b7d6517875f", 6),
	},
	"USDE": {
		"Ethereum": ("0x4c9edd5852cd905f086c759e8383e09bff1e68b3", 18),
		"Arbitrum": ("0x5d3a1ff2b6bab83b63cd9ad0787074081a52ef34", 18),
	},
	"XAUT": {
		"Ethereum": ("0x68749665FF8D2d112Fa859AA293F07A622782F38", 6),
	},
	"FDUSD": {
		"Ethereum": ("0x5e8422345238f34275888049021821e8e08caa1f", 18),
	},
	"EURT": {
		"Ethereum": ("0xC581b735A1688071A1746c968e0798D642EDE491", 6),
	},
	"PYUSD": {
		"Ethereum": ("0x6c3ea9036406852006290770BEdFcAbA0e23A0e8", 6),
	},
}
