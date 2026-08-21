from fastapi import APIRouter, Request, Depends
from src.database import get_db
from sqlalchemy.orm import Session
from src.utils.firebase import Firebase
from src.schema.accounting_schema import AccountingRecodPost
from src.accounting.accounting_controller import AccountingController

router = APIRouter()


# カテゴリー
@router.get("/")
def categoryGet(request: Request, db: Session = Depends(get_db)):
    firebase = Firebase()
    controller = AccountingController(db)

    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)

    return controller.CategoryGet(uid)


# レコード
@router.post("/recod")
async def recodPost(
    request: Request, body: AccountingRecodPost, db: Session = Depends(get_db)
):
    firebase = Firebase()
    controller = AccountingController(db)
    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)
    return await controller.RecordPost(uid, body)
