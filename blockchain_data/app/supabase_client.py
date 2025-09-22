import os
from typing import Any, Dict, List, Optional
import requests

from app.config import settings


class SupabaseClient:
	def __init__(self, url: str, anon_key: Optional[str], service_key: Optional[str]) -> None:
		self.base_url = url.rstrip("/") + "/rest/v1"
		self.anon_key = anon_key
		self.service_key = service_key or anon_key
		self.session = requests.Session()

	def _headers(self, write: bool = False) -> Dict[str, str]:
		key = self.service_key if write else (self.anon_key or self.service_key)
		headers = {
			"apikey": key or "",
			"Authorization": f"Bearer {key}" if key else "",
			"Content-Type": "application/json",
		}
		return headers

	def select(self, table: str, params: Dict[str, Any]) -> List[Dict[str, Any]]:
		url = f"{self.base_url}/{table}"
		r = self.session.get(url, headers=self._headers(False), params=params, timeout=30)
		r.raise_for_status()
		return r.json()

	def insert(self, table: str, rows: List[Dict[str, Any]]) -> None:
		url = f"{self.base_url}/{table}"
		r = self.session.post(
			url,
			headers={**self._headers(True), "Prefer": "return=minimal"},
			json=rows,
			timeout=30,
		)
		r.raise_for_status()

	def upsert(self, table: str, rows: List[Dict[str, Any]], on_conflict: Optional[str] = None) -> None:
		url = f"{self.base_url}/{table}"
		params = {}
		if on_conflict:
			params["on_conflict"] = on_conflict
		r = self.session.post(
			url,
			params=params,
			headers={**self._headers(True), "Prefer": "resolution=merge-duplicates,return=minimal"},
			json=rows,
			timeout=30,
		)
		r.raise_for_status()


client: Optional[SupabaseClient] = None


def init_supabase_client() -> None:
	global client
	client = SupabaseClient(settings.SUPABASE_URL or "", settings.SUPABASE_ANON_KEY, settings.SUPABASE_SERVICE_ROLE_KEY)
	if not settings.SUPABASE_URL:
		raise RuntimeError("SUPABASE_URL must be set for REST mode")
