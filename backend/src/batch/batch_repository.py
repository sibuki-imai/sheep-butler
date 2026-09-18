from sqlalchemy.orm import Session
from sqlalchemy import select
from datetime import date
from sqlalchemy import and_, or_
from sqlalchemy import func
from src.model.accounting_basic import AccountingBasic


class BatchRepository:
    def __init__(self, session: Session):
        self.session = session

    # AccountingBasic.fixed_moneyをAccountingBasic.remaining_balanceに加算
    # 予算を残金に追加する
    def AddMonthlyBudget(self):
        (
            self.session.query(AccountingBasic)
            .filter(AccountingBasic.deleted_at.is_(None))
            .update(
                {
                    AccountingBasic.remaining_balance: AccountingBasic.remaining_balance
                    + AccountingBasic.fixed_money
                }
            )
        )
        self.session.commit()
