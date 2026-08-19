from fastapi import Response
from src.accounting.accounting_service import AccountingService


class AccountingController:
    def __init__(self, session):
        self.service = AccountingService(session)

    def CategoryGet(self, user_id: str):
        return self.service.CategoryGet(user_id)
