from fastapi import HTTPException
import firebase_admin
from firebase_admin import auth, credentials
from datetime import timedelta

cred = credentials.Certificate("src/utils/firebase-service-account.json")

firebase_admin.initialize_app(cred)


class Firebase:
    # id_token検証
    def verify_id_token(self, id_token: str):
        try:
            result = auth.verify_id_token(id_token)
            return result
        except Exception:
            raise HTTPException(
                status_code=401,
                detail="Invalid Firebase ID token",
            )

    # Firebase セッションCookie発行
    def session_firebase(self, id_token: str):
        expires_in = timedelta(days=5)
        session_cookie = auth.create_session_cookie(id_token, expires_in)

        return session_cookie, expires_in

    # Firebase セッションチェック
    def session_check(self, session_cookie: str | None):
        if session_cookie is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid Firebase ID token",
            )

        try:
            decorded = auth.verify_session_cookie(session_cookie, check_revoked=True)
            return decorded["uid"]
        except Exception:
            raise HTTPException(
                status_code=401,
                detail="Invalid Firebase ID token",
            )
