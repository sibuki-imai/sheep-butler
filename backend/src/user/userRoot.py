from fastapi import APIRouter

router = APIRouter()


@router.get("/")
def get_user_root():
    return {"message": "user root"}


@router.post("/")
def create_user():
    return {"message": "user created"}


@router.get("/{user_id}")
def get_user(user_id: int):
    return {"user_id": user_id}
