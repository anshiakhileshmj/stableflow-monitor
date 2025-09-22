from datetime import datetime, timezone, timedelta
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Query

from app.auth import require_api_key
from app.supabase_client import client

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
	params: Dict[str, Any] = {
		"order": "block_timestamp.desc",
		"limit": limit,
	}
	if token:
		params["token"] = f"eq.{token}"
	if network:
		params["network"] = f"eq.{network}"
	if live and not from_ and not to:
		from_dt = (datetime.now(timezone.utc) - timedelta(seconds=window_sec)).isoformat()
		params["block_timestamp"] = f"gte.{from_dt}"
	else:
		if from_:
			params["block_timestamp"] = f"gte.{datetime.fromisoformat(from_).isoformat()}"
		if to:
			params["block_timestamp"] = f"lte.{datetime.fromisoformat(to).isoformat()}"
	rows = client.select("stablecoin_transfers", params)
	return rows


@router.get("/analytics/global-flows")
async def global_flows() -> Dict[str, Any]:
	# Basic aggregates via RPC or views would be ideal; as a simple fallback, fetch limited rows and compute here
	rows = client.select("stablecoin_transfers", {"order": "block_timestamp.desc", "limit": 5000})
	tot_by_network: Dict[str, float] = {}
	tot_by_token: Dict[str, float] = {}
	sent: Dict[str, float] = {}
	recv: Dict[str, float] = {}
	gas_total = 0.0
	gas_count = 0
	for r in rows:
		net = r.get("network")
		tok = r.get("token")
		amt = float(r.get("amount") or 0)
		gas = float(r.get("gas_fee") or 0)
		src = r.get("from_address")
		dst = r.get("to_address")
		if net:
			tot_by_network[net] = tot_by_network.get(net, 0.0) + amt
		if tok:
			tot_by_token[tok] = tot_by_token.get(tok, 0.0) + amt
		if src:
			sent[src] = sent.get(src, 0.0) + amt
		if dst:
			recv[dst] = recv.get(dst, 0.0) + amt
		if gas > 0:
			gas_total += gas
			gas_count += 1
	def top_n(d: Dict[str, float], n: int) -> List[Dict[str, Any]]:
		return sorted(({"wallet": k, "total": v} for k, v in d.items()), key=lambda x: x["total"], reverse=True)[:n]
	return {
		"total_volume_by_network": [{"network": k, "volume": v} for k, v in tot_by_network.items()],
		"total_volume_by_token": [{"token": k, "volume": v} for k, v in tot_by_token.items()],
		"top_10_sending_wallets": top_n(sent, 10),
		"top_10_receiving_wallets": top_n(recv, 10),
		"average_gas_fees": (gas_total / gas_count) if gas_count else None,
	}


@router.get("/wallets/{wallet_address}/balances")
async def wallet_balances(wallet_address: str, network: Optional[str] = None, token: Optional[str] = None) -> List[Dict[str, Any]]:
	params: Dict[str, Any] = {
		"wallet_address": f"eq.{wallet_address}",
		"order": "fetched_at.desc",
		"limit": 200,
	}
	if network:
		params["network"] = f"eq.{network}"
	if token:
		params["token"] = f"eq.{token}"
	rows = client.select("wallet_balances", params)
	return rows


@router.get("/whales/live")
async def whales_live(network: Optional[str] = None, token: Optional[str] = None) -> List[Dict[str, Any]]:
	params: Dict[str, Any] = {"order": "block_timestamp.desc", "limit": 200}
	if network:
		params["network"] = f"eq.{network}"
	if token:
		params["token"] = f"eq.{token}"
	rows = client.select("whale_transfers", params)
	return rows


@router.get("/whales/top-wallets")
async def whales_top_wallets() -> List[Dict[str, Any]]:
	# If you create a materialized view in Supabase called whale_top_wallets, this will read it
	rows = client.select("whale_top_wallets", {"order": "last_updated.desc", "limit": 500})
	return rows
