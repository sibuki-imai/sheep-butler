from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.auth.auth_router import router as AuthRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(AuthRouter, prefix="/auth")


@app.get("/")
def root():
    print("testAPI")
    return {"message": "Hello FastAPI"}
