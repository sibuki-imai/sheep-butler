from fastapi import FastAPI
from src.user.userRoot import router as user_router

app = FastAPI()

# ルーティング
app.include_router(user_router, prefix="/user")
