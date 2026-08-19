import requests
from src.accounting.accounting_repository import AccountingRepository
from src.utils.firebase import Firebase
from datetime import datetime, timedelta
from src.schema.users_schema import Power, UserCreate


class AccountingService:
    def __init__(self, session):
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
