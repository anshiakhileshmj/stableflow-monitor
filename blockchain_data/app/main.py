import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.db import init_db_pool, close_db_pool
from app.routers import router as api_router
from app.etl import start_background_workers

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
	await init_db_pool()
	# Start ETL workers in background
	asyncio.create_task(start_background_workers())


@app.on_event("shutdown")
async def on_shutdown() -> None:
	await close_db_pool()


@app.get("/")
async def health():
	return {"status": "ok", "env": settings.ENV}


app.include_router(api_router)
