import requests
from src.accounting.accounting_repository import AccountingRepository
from src.utils.firebase import Firebase
from src.schema.accounting_schema import AccountingRecordPost, RecordQuery
from src.model.accounting_record import AccountingRecord
from src.model.accounting_basic import AccountingBasic
from datetime import datetime, date
from src.schema.accounting_schema import AccountingBasicUpdate
from dateutil.relativedelta import relativedelta


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

    # レコード取得
    async def RecordGet(self, user_id: str, info: RecordQuery):
        # info.dateの成型
        print("date", info.date)
        if info.date:
            dt = datetime.fromisoformat(info.date).date()
        else:
            dt = date.today()

        # 月初
        start = dt.replace(day=1)

        # 翌月の月初（標準ライブラリだけ）
        if start.month == 12:
            end = start.replace(year=start.year + 1, month=1)
        else:
            end = start.replace(month=start.month + 1)

        # カテゴリの設定
        category = info.category
        #  info.detailがtrueのみ各レコードの詳細も取得
        if info.detail is True:
            print("レコードインフォ")
            result = await self.repo.RecordInfoGet(user_id, start, end, category)
        else:
            print("合計表示")
            rows = await self.repo.RecordGet(user_id, start, end, category)
            result = [
                {
                    "id": r[0],
                    "name": r[1],
                    "icon": r[2],
                    "collar": r[3],
                    "remaining_balance": r[4],
                    "sum_amount": r[5],
                }
                for r in rows
            ]
        return result

    # レコードポスト
    async def RecordPost(self, user_id: str, body: AccountingRecordPost):
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
