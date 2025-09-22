import asyncio
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from web3 import Web3
from web3.middleware import geth_poa_middleware

from app.config import settings
from app.models import NETWORKS, STABLECOINS
from app.utils import ERC20_ABI, TRANSFER_TOPIC
from app.supabase_client import client


def build_web3_clients() -> Dict[str, Web3]:
	clients: Dict[str, Web3] = {}
	mapping = {
		"Ethereum": settings.RPC_ETHEREUM,
		"Polygon": settings.RPC_POLYGON,
		"BSC": settings.RPC_BSC,
		"Arbitrum": settings.RPC_ARBITRUM,
		"Avalanche": settings.RPC_AVALANCHE,
	}
	for network, rpc in mapping.items():
		if not rpc:
			continue
		w3 = Web3(Web3.HTTPProvider(rpc, request_kwargs={"timeout": 30}))
		w3.middleware_onion.inject(geth_poa_middleware, layer=0)
		clients[network] = w3
	return clients


async def ensure_schema() -> None:
	# Schema assumed to exist when using Supabase REST
	return None


def get_whale_threshold_usd(token: str) -> float:
	return {
		"USDC": settings.WHALE_THRESHOLD_USDC,
		"USDT": settings.WHALE_THRESHOLD_USDT,
		"DAI": settings.WHALE_THRESHOLD_DAI,
		"BUSD": settings.WHALE_THRESHOLD_BUSD,
		"USTC": settings.WHALE_THRESHOLD_USTC,
	}.get(token, 1_000_000.0)


async def poll_transfers(clients: Dict[str, Web3]) -> None:
	# for live polling, keep a small overlap window
	WINDOW = 200
	while True:
		for network, w3 in clients.items():
			try:
				latest = w3.eth.block_number
				from_block = max(0, latest - WINDOW)
				for token, per_network in STABLECOINS.items():
					if network not in per_network:
						continue
					address, decimals = per_network[network]
					logs = w3.eth.get_logs({
						"fromBlock": from_block,
						"toBlock": latest,
						"address": Web3.to_checksum_address(address),
						"topics": [TRANSFER_TOPIC],
					})
					rows_transfers: List[Dict[str, object]] = []
					rows_whales: List[Dict[str, object]] = []
					for log in logs:
						tx_hash = log["transactionHash"].hex()
						block_number = log["blockNumber"]
						log_index = log.get("logIndex")
						from_address = Web3.to_checksum_address("0x" + log["topics"][1].hex()[-40:])
						to_address = Web3.to_checksum_address("0x" + log["topics"][2].hex()[-40:])
						value = int(log["data"], 16)
						amount = value / (10 ** decimals)

						receipt = w3.eth.get_transaction_receipt(tx_hash)
						gas_used = receipt["gasUsed"]
						gas_price = receipt.get("effectiveGasPrice") or receipt.get("gasPrice") or 0
						gas_fee = (gas_used or 0) * (gas_price or 0)
						status = "success" if receipt.get("status") == 1 else "failed"
						block = w3.eth.get_block(block_number)
						block_ts = datetime.fromtimestamp(block["timestamp"], tz=timezone.utc)

						row = {
							"network": network,
							"chain_id": NETWORKS.get(network),
							"token": token,
							"token_address": address,
							"from_address": from_address,
							"to_address": to_address,
							"amount": amount,
							"tx_hash": tx_hash,
							"log_index": int(log_index) if log_index is not None else None,
							"block_number": block_number,
							"block_timestamp": block_ts.isoformat(),
							"gas_used": float(gas_used or 0),
							"gas_price": float(gas_price or 0),
							"gas_fee": float(gas_fee or 0),
							"status": status,
						}
						rows_transfers.append(row)

						if amount >= get_whale_threshold_usd(token):
							rows_whales.append({
								"network": network,
								"token": token,
								"token_address": address,
								"from_address": from_address,
								"to_address": to_address,
								"amount": amount,
								"tx_hash": tx_hash,
								"log_index": int(log_index) if log_index is not None else None,
								"block_number": block_number,
								"block_timestamp": block_ts.isoformat(),
								"gas_used": float(gas_used or 0),
								"gas_price": float(gas_price or 0),
								"gas_fee": float(gas_fee or 0),
								"status": status,
							})

					# bulk upsert to Supabase
					if rows_transfers:
						client.upsert("stablecoin_transfers", rows_transfers, on_conflict="tx_hash,log_index")
					if rows_whales:
						client.upsert("whale_transfers", rows_whales, on_conflict="tx_hash,log_index")
			except Exception:
				pass
		await asyncio.sleep(settings.ETL_POLL_SEC)


async def poll_balances(clients: Dict[str, Web3]) -> None:
	wallets = [w.strip() for w in settings.TRACKED_WALLETS if w]
	while True:
		for network, w3 in clients.items():
			for token, per_network in STABLECOINS.items():
				if network not in per_network:
					continue
				address, decimals = per_network[network]
				contract = w3.eth.contract(address=Web3.to_checksum_address(address), abi=ERC20_ABI)
				for wallet in wallets:
					try:
						bal = contract.functions.balanceOf(Web3.to_checksum_address(wallet)).call()
						balance = bal / (10 ** decimals)
						client.insert("wallet_balances", [{
							"wallet_address": wallet,
							"network": network,
							"token": token,
							"token_address": address,
							"balance": balance,
						}])
					except Exception:
						pass
		await asyncio.sleep(settings.BALANCE_POLL_SEC)


async def refresh_top_wallets() -> None:
	while True:
		try:
			# Recompute using REST: clear and reinsert from aggregated query
			# Note: PostgREST doesn't support multi-statement; rely on a view or do two steps.
			# For simplicity, skip heavy recompute here; clients can compute from whale_transfers.
			pass
		except Exception:
			pass
		await asyncio.sleep(settings.TOP_WALLETS_REFRESH_SEC)


async def start_background_workers() -> None:
	clients = build_web3_clients()
	await ensure_schema()
	asyncio.create_task(poll_transfers(clients))
	asyncio.create_task(poll_balances(clients))
	asyncio.create_task(refresh_top_wallets())
