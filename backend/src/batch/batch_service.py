import requests
from src.utils.firebase import Firebase
from src.batch.batch_repository import BatchRepository
from fastapi import HTTPException


class BatchService:
    def __init__(self, session):
        self.session = session
        self.repo = BatchRepository(session)
        self.firebase = Firebase()

    # 家計簿<金額積み立て(毎月1回)>
    def AddMonthlyBudget(self):
        try:

            return self.repo.AddMonthlyBudget()
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
