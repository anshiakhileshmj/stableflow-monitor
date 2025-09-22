from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.db import get_pool

security = HTTPBearer(auto_error=True)


async def require_api_key(creds: HTTPAuthorizationCredentials = Depends(security)) -> str:
	if creds is None or not creds.scheme.lower() == "bearer":
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid auth header")
	api_key = creds.credentials.strip()
	pool = get_pool()
	row = await pool.fetchrow(
		"SELECT id, api_key FROM api_keys WHERE api_key=$1",
		api_key,
	)
	if not row:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Unauthorized")
	await pool.execute(
		"UPDATE api_keys SET usage_count = COALESCE(usage_count,0)+1 WHERE id=$1",
		row["id"],
	)
	return api_key
