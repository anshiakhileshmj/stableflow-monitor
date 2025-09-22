# Stablecoin Analytics API (FastAPI)

Python 3.11 FastAPI backend indexing stablecoin transfers across Ethereum, Polygon, BSC, Arbitrum, and Avalanche. Enriches transfers, tracks wallet balances, detects whale transfers, and maintains live whale tracking with top wallets. Stores data in Postgres (Supabase) and exposes REST endpoints.

> Note: Deployment targets must use Python 3.11 (pinned via runtime.txt). Some deps (e.g., asyncpg) don't build on Python 3.13 on Render yet.

## Quickstart

1. Create and populate `.env`:

```
SUPABASE_DB_URL=postgresql://USER:PASSWORD@HOST:PORT/DB
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=... # not used for server-side
SUPABASE_SERVICE_ROLE_KEY=...

RPC_ETHEREUM=https://endpoints.omniatech.io/v1/eth/mainnet/public
RPC_POLYGON=https://polygon-rpc.com
RPC_BSC=https://bsc-dataseed.binance.org
RPC_ARBITRUM=https://arb1.arbitrum.io/rpc
RPC_AVALANCHE=https://api.avax.network/ext/bc/C/rpc

# Comma-separated wallets to track balances (optional)
TRACKED_WALLETS=0x...,0x...

# Whale thresholds in USD (defaults used if omitted)
WHALE_THRESHOLD_USDC=1000000
WHALE_THRESHOLD_USDT=1000000
WHALE_THRESHOLD_DAI=1000000
WHALE_THRESHOLD_BUSD=1000000
WHALE_THRESHOLD_USTC=250000

# ETL cadence (seconds)
ETL_POLL_SEC=1
BALANCE_POLL_SEC=120
TOP_WALLETS_REFRESH_SEC=1

# Deployment
PORT=8000
ENV=development
```

2. Install deps:

```
pip install -r requirements.txt
```

3. Run server:

```
uvicorn app.main:app --reload --host 0.0.0.0 --port %PORT%
```

## Endpoints
- `GET /v1/transfers`
- `GET /v1/analytics/global-flows`
- `GET /v1/wallets/{wallet}/balances`
- `GET /v1/whales/live`
- `GET /v1/whales/top-wallets`

All endpoints require `Authorization: Bearer <API_KEY>`; keys are validated against `api_keys`.

## Deploy on Render
- Ensure runtime.txt specifies `3.11.9` (Python 3.11)
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

## Notes
- Uses `asyncpg` connection pool
- Background tasks for ETL
- Top 5 stablecoins: USDC, USDT, DAI, BUSD, USTC (+ others added)
- EVM networks supported: Ethereum, Polygon, BSC, Arbitrum, Avalanche
- Live whale tracking every 1s; small block overlap window to avoid misses
