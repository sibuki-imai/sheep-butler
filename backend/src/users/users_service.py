import requests
from src.users.users_repository import UsersRepository
from src.accounting.accounting_service import AccountingService
from src.schema.users_schema import UserCreate
from src.utils.firebase import Firebase


class UserService:
    def __init__(self, session):
        self.repo = UsersRepository(session)
        self.service = AccountingService(session)
        self.firebase = Firebase()

    def create_user(self, user_data: UserCreate):
        # ユーザの作成
        self.repo.create_user(user_data)

        # 関連情報の作成
        self.service.Initial(user_data.id)

        return
