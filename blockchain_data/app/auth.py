from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.supabase_client import client

security = HTTPBearer(auto_error=True)


def require_api_key(creds: HTTPAuthorizationCredentials = Depends(security)) -> str:
	if creds is None or not creds.scheme.lower() == "bearer":
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth header")
	api_key = creds.credentials.strip()
	if not client:
		raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Auth not initialized")
	rows = client.select("api_keys", {"api_key": f"eq.{api_key}", "limit": 1})
	if not rows:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
	# Best-effort usage_count increment (ignore errors)
	try:
		client.upsert("api_keys", [{"id": rows[0].get("id"), "usage_count": (rows[0].get("usage_count") or 0) + 1}], on_conflict="id")
	except Exception:
		pass
	return api_key
