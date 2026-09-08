from fastapi import Response
from src.batch.batch_service import BatchService


class BatchController:
    def __init__(self, session):
        self.service = BatchService(session)

    def AddMonthlyBudget(self):
        return self.service.AddMonthlyBudget()
