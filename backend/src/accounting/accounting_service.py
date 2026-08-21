import requests
from src.accounting.accounting_repository import AccountingRepository
from src.utils.firebase import Firebase
from src.schema.accounting_schema import AccountingRecodPost
from src.model.accounting_record import AccountingRecord
from src.model.accounting_basic import AccountingBasic
from datetime import datetime, timedelta
from src.schema.accounting_schema import AccountingBasicUpdate


class AccountingService:
    def __init__(self, session):
        self.session = session
        self.repo = AccountingRepository(session)
        self.firebase = Firebase()

    # 項目関係

    # 初期セット
    def Initial(self, user_id: str):
        self.repo.Initial(user_id)
        return

    # 取得
    def CategoryGet(self, user_id: str):
        return self.repo.CategoryGet(user_id)

    # レコードポスト
    async def RecordPost(self, user_id: str, body: AccountingRecodPost):
        print("body", body)
        # 登録するレコードのカテゴリを取得
        categoryInfo = await self.repo.CategoryOneGet(body.accounting_basic_id)
        if categoryInfo is None:
            raise Exception("Category not found")

        # レコードの追加
        newdata = AccountingRecord(
            user_id=user_id,
            accounting_basic_id=body.accounting_basic_id,
            amount=body.amount,
            purchase_date=body.purchase_date,
            item_name=body.item_name,
            memo=body.memo,
        )

        updataMoney = categoryInfo.remaining_balance - body.amount

        data = AccountingBasicUpdate(remaining_balance=updataMoney)
        try:
            with self.session.begin_nested():
                # レコードの作成
                await self.repo.RecordPost(newdata)

                # カテゴリ残金更新
                await self.repo.CategoryUpdate(body.accounting_basic_id, data)

            return {"status": "ok"}
        except Exception as e:
            #  rollback（失敗時）
            print("ロールバック")
            raise e
        return
