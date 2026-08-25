from fastapi import Response
from src.schema.accounting_schema import AccountingRecordPost, RecordQuery
from src.accounting.accounting_service import AccountingService


class AccountingController:
    def __init__(self, session):
        self.service = AccountingService(session)

    def CategoryGet(self, user_id: str):
        return self.service.CategoryGet(user_id)

    async def RecordGet(self, user_id: str, info: RecordQuery):
        return await self.service.RecordGet(user_id, info)

    async def RecordPost(self, user_id: str, body: AccountingRecordPost):
        return await self.service.RecordPost(user_id, body)
