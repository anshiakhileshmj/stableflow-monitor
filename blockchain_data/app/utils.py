from typing import Any, Dict, Optional
from web3 import Web3
from fastapi.responses import ORJSONResponse

# Minimal ERC20 ABI for balanceOf and Transfer event
ERC20_ABI = [
	{
		"constant": True,
		"inputs": [{"name": "account", "type": "address"}],
		"name": "balanceOf",
		"outputs": [{"name": "", "type": "uint256"}],
		"payable": False,
		"stateMutability": "view",
		"type": "function",
	},
	{
		"anonymous": False,
		"inputs": [
			{"indexed": True, "internalType": "address", "name": "from", "type": "address"},
			{"indexed": True, "internalType": "address", "name": "to", "type": "address"},
			{"indexed": False, "internalType": "uint256", "name": "value", "type": "uint256"},
		],
		"name": "Transfer",
		"type": "event",
	},
]

TRANSFER_TOPIC = Web3.keccak(text="Transfer(address,address,uint256)").hex()


def to_checksum(address: Optional[str]) -> Optional[str]:
	if not address:
		return None
	return Web3.to_checksum_address(address)


class JsonResponse(ORJSONResponse):
	media_type = "application/json"
