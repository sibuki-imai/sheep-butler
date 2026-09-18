from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi import Request
import logging
from src.auth.auth_router import router as AuthRouter
from src.accounting.accounting_router import router as AccountingRouter
from src.batch.batch_router import router as BatchRouter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
logger = logging.getLogger("uvicorn.error")

app.include_router(AuthRouter, prefix="/auth")
app.include_router(AccountingRouter, prefix="/accounting")
app.include_router(BatchRouter, prefix="/batch")


@app.get("/")
def root():
    print("testAPI")
    return {"message": "Hello FastAPI"}


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"422 Validation Error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )
