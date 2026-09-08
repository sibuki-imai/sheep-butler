from fastapi import Response
from src.schema.accounting_schema import (
    AccountingRecordPost,
    AccountingRecordPatch,
    AccountingRecordDelete,
    RecordQuery,
)
from src.accounting.accounting_service import AccountingService


class AccountingController:
    def __init__(self, session):
        self.service = AccountingService(session)

    def CategoryGet(
        self,
        user_id: str,
        id: str | None = None,
    ):
        return self.service.CategoryGet(user_id, id)

    async def RecordGet(self, user_id: str, info: RecordQuery):
        return await self.service.RecordGet(user_id, info)

    async def RecordPost(self, user_id: str, body: AccountingRecordPost):
        return await self.service.RecordPost(user_id, body)

    async def RecordPatch(self, user_id: str, body: AccountingRecordPatch):
        return await self.service.RecordPatch(user_id, body)

    async def RecordDelete(self, user_id: str, id: str):
        return await self.service.RecordDelete(user_id, id)
