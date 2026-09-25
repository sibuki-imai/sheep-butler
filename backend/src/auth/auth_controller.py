from fastapi import Response
from src.auth.auth_service import AuthService


class AuthController:
    def __init__(self, session):
        self.service = AuthService(session)

    def login(self, id_token: str):
        print("ログイン")
        session_cookie, expires_in = self.service.login(id_token)

        response = Response(content="ok")
        response.set_cookie(
            key="session",
            value=session_cookie,
            httponly=True,
            secure=True,
            # secure=False,  # 開発中のみ
            # samesite="strict",
            samesite="lax",
            max_age=int(expires_in.total_seconds()),
        )
        return response
