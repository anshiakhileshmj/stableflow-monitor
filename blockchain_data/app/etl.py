import asyncio
from datetime import datetime, timezone
from typing import Dict, List, Optional, Tuple

from web3 import Web3
from web3.middleware import geth_poa_middleware

from app.config import settings
from app.db import get_pool
from app.models import NETWORKS, STABLECOINS
from app.utils import ERC20_ABI, TRANSFER_TOPIC


def build_web3_clients() -> Dict[str, Web3]:
	clients: Dict[str, Web3] = {}
	mapping = {
		"Ethereum": settings.RPC_ETHEREUM,
		"Polygon": settings.RPC_POLYGON,
		"BSC": settings.RPC_BSC,
		"Arbitrum": settings.RPC_ARBITRUM,
		"Avalanche": settings.RPC_AVALANCHE,
		# Non-EVM placeholders (Tron/Sui) will require different SDKs
	}
	for network, rpc in mapping.items():
		if not rpc:
			continue
		w3 = Web3(Web3.HTTPProvider(rpc, request_kwargs={"timeout": 30}))
		# Polygon, BSC, Arbitrum, Avalanche often need POA middleware
		w3.middleware_onion.inject(geth_poa_middleware, layer=0)
		clients[network] = w3
	return clients


async def ensure_schema() -> None:
	pool = get_pool()
	from app.models import SCHEMA_SQL
	for name, sql in SCHEMA_SQL.items():
		await pool.execute(sql)


def get_whale_threshold_usd(token: str) -> float:
	return {
		"USDC": settings.WHALE_THRESHOLD_USDC,
		"USDT": settings.WHALE_THRESHOLD_USDT,
		"DAI": settings.WHALE_THRESHOLD_DAI,
		"BUSD": settings.WHALE_THRESHOLD_BUSD,
		"USTC": settings.WHALE_THRESHOLD_USTC,
	}.get(token, 1_000_000.0)


async def poll_transfers(clients: Dict[str, Web3]) -> None:
	pool = get_pool()
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
					for log in logs:
						tx_hash = log["transactionHash"].hex()
						block_number = log["blockNumber"]
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

						await pool.execute(
							"""
							INSERT INTO stablecoin_transfers (
								network, chain_id, token, token_address, from_address, to_address, amount,
								tx_hash, block_number, block_timestamp, gas_used, gas_price, gas_fee, status
							) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
							ON CONFLICT DO NOTHING
							""",
							network,
							NETWORKS.get(network),
							token,
							address,
							from_address,
							to_address,
							amount,
							tx_hash,
							block_number,
							block_ts,
							float(gas_used or 0),
							float(gas_price or 0),
							float(gas_fee or 0),
							status,
						)
					)

					if amount >= get_whale_threshold_usd(token):
						await pool.execute(
							"""
							INSERT INTO whale_transfers (
								network, token, token_address, from_address, to_address, amount, tx_hash,
								block_number, block_timestamp, gas_used, gas_price, gas_fee, status
							) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
							""",
							network,
							token,
							address,
							from_address,
							to_address,
							amount,
							tx_hash,
							block_number,
							block_ts,
							float(gas_used or 0),
							float(gas_price or 0),
							float(gas_fee or 0),
							status,
						)
						)
			except Exception:
				pass
		await asyncio.sleep(settings.ETL_POLL_SEC)


async def poll_balances(clients: Dict[str, Web3]) -> None:
	pool = get_pool()
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
						await pool.execute(
							"""
							INSERT INTO wallet_balances (wallet_address, network, token, token_address, balance)
							VALUES ($1,$2,$3,$4,$5)
							""",
							wallet,
							network,
							token,
							address,
							balance,
						)
					except Exception:
						pass
		await asyncio.sleep(settings.BALANCE_POLL_SEC)


async def refresh_top_wallets() -> None:
	pool = get_pool()
	while True:
		try:
			await pool.execute(
				"""
				DELETE FROM whale_top_wallets;
				INSERT INTO whale_top_wallets (network, wallet_address, token, total_sent, total_received, last_updated)
				SELECT network, from_address AS wallet_address, token,
					SUM(amount) AS total_sent,
					0::numeric AS total_received,
					now() AS last_updated
				FROM whale_transfers
				GROUP BY network, from_address, token
				UNION ALL
				SELECT network, to_address AS wallet_address, token,
					0::numeric AS total_sent,
					SUM(amount) AS total_received,
					now() AS last_updated
				FROM whale_transfers
				GROUP BY network, to_address, token;
				"""
			)
		except Exception:
			pass
		await asyncio.sleep(settings.TOP_WALLETS_REFRESH_SEC)


async def start_background_workers() -> None:
	clients = build_web3_clients()
	await ensure_schema()
	asyncio.create_task(poll_transfers(clients))
	asyncio.create_task(poll_balances(clients))
	asyncio.create_task(refresh_top_wallets())
