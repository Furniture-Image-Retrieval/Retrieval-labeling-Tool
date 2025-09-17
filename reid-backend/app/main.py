import os
from fastapi import FastAPI

from dotenv import load_dotenv
load_dotenv()

from app.routes import user
from app.routes import project
from app.core.db import session
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.mount("/statics", StaticFiles(directory=os.environ['STATIC_ROOT']), name="statics")

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=user.router, prefix="/user")
app.include_router(router=project.router, prefix="/project")


@app.on_event("shutdown")
async def shutdown_db_client():
    await session.close()
