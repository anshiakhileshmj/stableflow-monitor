from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query

from app.auth import require_api_key
from app.db import get_pool

router = APIRouter(prefix="/v1", dependencies=[Depends(require_api_key)])


@router.get("/transfers")
async def get_transfers(
	token: Optional[str] = Query(default=None),
	network: Optional[str] = Query(default=None),
	from_: Optional[str] = Query(default=None, alias="from"),
	to: Optional[str] = Query(default=None),
	live: bool = Query(default=True),
	window_sec: int = Query(default=5, ge=1, le=600),
	limit: int = Query(default=500, ge=1, le=2000),
) -> List[Dict[str, Any]]:
	pool = get_pool()
	clauses = []
	params = []

	# If live mode and no explicit from/to provided, default to recent window across all chains
	if live and not from_ and not to:
		from_dt = datetime.now(timezone.utc) - timedelta(seconds=window_sec)
		clauses.append("block_timestamp >= $%d" % (len(params) + 1))
		params.append(from_dt)
	elif from_:
		clauses.append("block_timestamp >= $%d" % (len(params) + 1))
		params.append(datetime.fromisoformat(from_))
	if to:
		clauses.append("block_timestamp <= $%d" % (len(params) + 1))
		params.append(datetime.fromisoformat(to))
	if token:
		clauses.append("token = $%d" % (len(params) + 1))
		params.append(token)
	if network:
		clauses.append("network = $%d" % (len(params) + 1))
		params.append(network)

	where = (" WHERE " + " AND ".join(clauses)) if clauses else ""
	rows = await pool.fetch(
		f"SELECT network, chain_id, token, token_address, amount, from_address, to_address, tx_hash, block_number, block_timestamp, gas_used, gas_price, gas_fee, status FROM stablecoin_transfers{where} ORDER BY block_timestamp DESC LIMIT {limit}",
		*params,
	)
	return [dict(r) for r in rows]


@router.get("/analytics/global-flows")
async def global_flows() -> Dict[str, Any]:
	pool = get_pool()
	vol_by_network = await pool.fetch("SELECT network, SUM(amount) AS volume FROM stablecoin_transfers GROUP BY network ORDER BY volume DESC")
	vol_by_token = await pool.fetch("SELECT token, SUM(amount) AS volume FROM stablecoin_transfers GROUP BY token ORDER BY volume DESC")
	top_senders = await pool.fetch(
		"SELECT from_address as wallet, SUM(amount) AS total FROM stablecoin_transfers GROUP BY from_address ORDER BY total DESC LIMIT 10"
	)
	top_receivers = await pool.fetch(
		"SELECT to_address as wallet, SUM(amount) AS total FROM stablecoin_transfers GROUP BY to_address ORDER BY total DESC LIMIT 10"
	)
	avg_gas = await pool.fetchrow("SELECT AVG(gas_fee) AS avg_gas_fee FROM stablecoin_transfers WHERE gas_fee IS NOT NULL AND gas_fee > 0")
	return {
		"total_volume_by_network": [dict(r) for r in vol_by_network],
		"total_volume_by_token": [dict(r) for r in vol_by_token],
		"top_10_sending_wallets": [dict(r) for r in top_senders],
		"top_10_receiving_wallets": [dict(r) for r in top_receivers],
		"average_gas_fees": avg_gas["avg_gas_fee"] if avg_gas else None,
	}


@router.get("/wallets/{wallet_address}/balances")
async def wallet_balances(wallet_address: str, network: Optional[str] = None, token: Optional[str] = None) -> List[Dict[str, Any]]:
	pool = get_pool()
	clauses = ["wallet_address = $1"]
	params = [wallet_address]
	if network:
		clauses.append("network = $%d" % (len(params) + 1))
		params.append(network)
	if token:
		clauses.append("token = $%d" % (len(params) + 1))
		params.append(token)
	where = " AND ".join(clauses)
	rows = await pool.fetch(
		f"SELECT wallet_address, network, token, token_address, balance, fetched_at FROM wallet_balances WHERE {where} ORDER BY fetched_at DESC LIMIT 200",
		*params,
	)
	return [dict(r) for r in rows]


@router.get("/whales/live")
async def whales_live(network: Optional[str] = None, token: Optional[str] = None) -> List[Dict[str, Any]]:
	pool = get_pool()
	clauses = []
	params = []
	if network:
		clauses.append("network = $%d" % (len(params) + 1))
		params.append(network)
	if token:
		clauses.append("token = $%d" % (len(params) + 1))
		params.append(token)
	where = (" WHERE " + " AND ".join(clauses)) if clauses else ""
	rows = await pool.fetch(
		f"SELECT network, token, token_address, amount, from_address, to_address, tx_hash, block_number, block_timestamp, gas_used, gas_price, gas_fee, status FROM whale_transfers{where} ORDER BY block_timestamp DESC LIMIT 200",
		*params,
	)
	return [dict(r) for r in rows]


@router.get("/whales/top-wallets")
async def whales_top_wallets() -> List[Dict[str, Any]]:
	pool = get_pool()
	rows = await pool.fetch(
		"SELECT network, wallet_address, token, total_sent, total_received, last_updated FROM whale_top_wallets ORDER BY GREATEST(COALESCE(total_sent,0), COALESCE(total_received,0)) DESC LIMIT 500"
	)
	return [dict(r) for r in rows]
