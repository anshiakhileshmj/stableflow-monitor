import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import router as api_router
from app.etl import start_background_workers
from app.supabase_client import init_supabase_client

app = FastAPI(title="Stablecoin Analytics API", version="1.0.0")

app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)


@app.on_event("startup")
async def on_startup() -> None:
	init_supabase_client()
	asyncio.create_task(start_background_workers())


@app.on_event("shutdown")
async def on_shutdown() -> None:
	pass


@app.get("/")
async def root_health():
	return {"status": "ok", "env": settings.ENV}


@app.head("/")
async def root_health_head():
	return {}


@app.get("/health")
async def service_health():
	return {"status": "ok"}


@app.head("/health")
async def service_health_head():
	return {}


app.include_router(api_router)
