import requests
from src.users.users_service import UserService
from src.users.users_repository import UsersRepository
from src.utils.firebase import Firebase
from datetime import datetime, timedelta
from src.schema.users_schema import Power, UserCreate


class AuthService:
    def __init__(self, session):
        self.service = UserService(session)
        self.repo = UsersRepository(session)
        self.firebase = Firebase()

    def login(self, id_token: str):
        # id_token
        decorded_token = self.firebase.verify_id_token(id_token)
        uid = decorded_token["uid"]

        # DB確認
        user = self.repo.find_user(uid)

        if user is None:
            # userIDが存在しない
            # DB作成
            user_data = UserCreate(
                id=uid,
                power=Power.GENERAL,
                last_login=datetime.now(),
            )
            self.service.create_user(user_data)

        # Firebase セッションCookie発行
        session_cookie, expires_in = self.firebase.session_firebase(id_token)

        return session_cookie, expires_in
