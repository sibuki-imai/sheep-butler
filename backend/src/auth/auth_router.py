from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.schema.auth_schema import LoginRequest
from src.auth.auth_controller import AuthController
from src.database import get_db

router = APIRouter()


@router.post("/")
def login(request: LoginRequest, db: Session = Depends(get_db)):
    controller = AuthController(db)
    return controller.login(request.id_token)
