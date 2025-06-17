from fastapi import FastAPI
from prometheus_fastapi_instrumentator import PrometheusFastApiInstrumentator

from rei_s.utils import lifespan
from rei_s.routes import files, health


def create():
    app = FastAPI(lifespan=lifespan)
    app.include_router(files.router)
    app.include_router(health.router)
    PrometheusFastApiInstrumentator().instrument(app)

    return app
