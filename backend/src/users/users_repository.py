from sqlalchemy.orm import Session

from src.model.users import User
from src.schema.users_schema import UserCreate


class UsersRepository:
    def __init__(self, session: Session):
        self.session = session

    def find_user(self, uid: str):
        return self.session.get(User, uid)

    def create_user(self, user_data: UserCreate):
        user = User(
            id=user_data.id,
            power=user_data.power,
            last_login=user_data.last_login,
        )

        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)

        return user
