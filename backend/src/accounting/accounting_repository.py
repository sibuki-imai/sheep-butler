from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import date
from sqlalchemy import and_, or_
from sqlalchemy import func
from src.model.accounting_basic import AccountingBasic
from src.model.accounting_record import AccountingRecord
from src.schema.accounting_schema import AccountingBasicUpdate

# from src.schema.accounting_schema import AccountingBasicCreate


class AccountingRepository:
    def __init__(self, session: Session):
        self.session = session

    def Initial(self, user_id: str):

        basics = [
            AccountingBasic(
                user_id=user_id,
                name="食費",
                icon="icon",
                collar="#0877D7",
                sort=1,
                fixed_money=30000,
                remaining_balance=30000,
            ),
            AccountingBasic(
                user_id=user_id,
                name="日用品費",
                icon="icon",
                collar="#0877D7",
                sort=2,
                fixed_money=30000,
                remaining_balance=30000,
            ),
            AccountingBasic(
                user_id=user_id,
                name="家賃",
                icon="icon",
                collar="#0877D7",
                sort=3,
                fixed_money=30000,
                remaining_balance=30000,
            ),
            AccountingBasic(
                user_id=user_id,
                name="水道光熱費",
                icon="icon",
                collar="#0877D7",
                sort=4,
                fixed_money=15000,
                remaining_balance=15000,
            ),
            AccountingBasic(
                user_id=user_id,
                name="衣服費",
                icon="icon",
                collar="#0877D7",
                sort=5,
                fixed_money=30000,
                remaining_balance=30000,
            ),
            AccountingBasic(
                user_id=user_id,
                name="交際費",
                icon="icon",
                collar="#0877D7",
                sort=6,
                fixed_money=30000,
                remaining_balance=30000,
            ),
            AccountingBasic(
                user_id=user_id,
                name="交通費",
                icon="icon",
                collar="#0877D7",
                sort=7,
                fixed_money=30000,
                remaining_balance=30000,
            ),
            AccountingBasic(
                user_id=user_id,
                name="お小遣い",
                icon="icon",
                collar="#0877D7",
                sort=8,
                fixed_money=30000,
                remaining_balance=30000,
            ),
            AccountingBasic(
                user_id=user_id,
                name="雑費",
                icon="icon",
                collar="#0877D7",
                sort=9,
                fixed_money=30000,
                remaining_balance=30000,
            ),
        ]

        self.session.add_all(basics)
        self.session.commit()
        return basics

    def CategoryGet(self, user_id: str):
        stmt = (
            select(AccountingBasic)
            .where(AccountingBasic.user_id == user_id)
            .order_by(AccountingBasic.sort)
        )
        return self.session.execute(stmt).scalars().all()

    # カテゴリIDを指定して取得
    async def CategoryOneGet(self, accounting_basic_id: str):
        stmt = select(AccountingBasic).where(AccountingBasic.id == accounting_basic_id)
        return self.session.execute(stmt).scalar_one_or_none()

    # レコードの取得
    async def RecordInfoGet(
        self, user_id: str, start: date, end: date, category: str | None
    ):

        stmt = (
            select(AccountingRecord)
            .where(
                and_(
                    AccountingRecord.user_id == user_id,
                    AccountingRecord.purchase_date >= start,
                    AccountingRecord.purchase_date < end,
                )
            )
            .order_by(AccountingRecord.purchase_date)
        )
        # category が指定されていれば追加
        if category is not None:
            stmt = stmt.where(AccountingRecord.accounting_basic_id == category)

        return self.session.execute(stmt).scalars().all()

    # レコード金額の合計
    async def RecordGet(
        self, user_id: str, start: date, end: date, category: str | None
    ):

        stmt = (
            select(
                AccountingBasic.id,
                AccountingBasic.name,
                AccountingBasic.icon,
                AccountingBasic.collar,
                AccountingBasic.remaining_balance,
                func.coalesce(func.sum(AccountingRecord.amount), 0),
            )
            .outerjoin(
                AccountingRecord,
                AccountingBasic.id == AccountingRecord.accounting_basic_id,
            )
            .where(
                AccountingBasic.user_id == user_id,
                or_(
                    AccountingRecord.purchase_date == None,
                    and_(
                        AccountingRecord.purchase_date >= start,
                        AccountingRecord.purchase_date < end,
                    ),
                ),
            )
            .group_by(AccountingBasic.id, AccountingBasic.name)
            .order_by(AccountingBasic.sort)
        )
        # category が指定されていれば追加
        if category is not None:
            stmt = stmt.where(AccountingRecord.accounting_basic_id == category)

        return self.session.execute(stmt).all()

    # カテゴリIDを指定してアップデート
    async def CategoryUpdate(self, id: str, data: AccountingBasicUpdate):
        category = (
            self.session.query(AccountingBasic).filter(AccountingBasic.id == id).first()
        )

        if category is None:
            raise Exception("Category not found")

        update_data = data.model_dump(exclude_none=True)
        for key, value in update_data.items():
            setattr(category, key, value)

        self.session.flush()
        return

    # レコードの作成
    async def RecordPost(self, new_data: AccountingRecord):
        record = AccountingRecord(
            user_id=new_data.user_id,
            accounting_basic_id=new_data.accounting_basic_id,
            amount=new_data.amount,
            purchase_date=new_data.purchase_date,
            item_name=new_data.item_name,
            memo=new_data.memo,
        )

        self.session.add(record)
        self.session.flush()
        return record
