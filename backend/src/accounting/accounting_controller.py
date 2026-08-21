from fastapi import Response
from src.schema.accounting_schema import AccountingRecodPost
from src.accounting.accounting_service import AccountingService


class AccountingController:
    def __init__(self, session):
        self.service = AccountingService(session)

    def CategoryGet(self, user_id: str):
        return self.service.CategoryGet(user_id)

    async def RecordPost(self, user_id: str, body: AccountingRecodPost):
        return await self.service.RecordPost(user_id, body)
