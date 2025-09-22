from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Optional


class Settings(BaseSettings):
	# Database
	SUPABASE_DB_URL: Optional[str] = Field(default=None, description="Postgres connection URL (Supabase)")
	DATABASE_URL: Optional[str] = Field(default=None, description="Generic Postgres connection URL")
	SUPABASE_URL: Optional[str] = None
	SUPABASE_ANON_KEY: Optional[str] = None
	SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None

	# RPC endpoints
	RPC_ETHEREUM: Optional[str] = None
	RPC_POLYGON: Optional[str] = None
	RPC_BSC: Optional[str] = None
	RPC_ARBITRUM: Optional[str] = None
	RPC_AVALANCHE: Optional[str] = None

	# ETL cadence
	ETL_POLL_SEC: int = 1
	BALANCE_POLL_SEC: int = 120
	TOP_WALLETS_REFRESH_SEC: int = 1

	# Whale thresholds (USD)
	WHALE_THRESHOLD_USDC: float = 1_000_000
	WHALE_THRESHOLD_USDT: float = 1_000_000
	WHALE_THRESHOLD_DAI: float = 1_000_000
	WHALE_THRESHOLD_BUSD: float = 1_000_000
	WHALE_THRESHOLD_USTC: float = 250_000

	# Operational
	TRACKED_WALLETS: List[str] = Field(default_factory=list)
	ENV: str = "development"

	model_config = {
		"env_file": ".env",
		"env_file_encoding": "utf-8",
		"case_sensitive": False,
	}


settings = Settings()
