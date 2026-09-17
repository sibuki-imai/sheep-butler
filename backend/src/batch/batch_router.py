from fastapi import APIRouter, Request, Depends
from src.database import get_db
from sqlalchemy.orm import Session
from src.batch.batch_controller import BatchController

router = APIRouter()


# 家計簿<金額積み立て(毎月1回)>
@router.get("/add-monthly-budget")
def addMonthlyBudget(
    request: Request,
    db: Session = Depends(get_db),
):
    controller = BatchController(db)
    controller.AddMonthlyBudget()
    return {"status": "ok"}
