from fastapi import APIRouter, Request, Depends
from src.database import get_db
from sqlalchemy.orm import Session
from src.utils.firebase import Firebase
from src.schema.accounting_schema import AccountingRecordPost, RecordQuery
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
# 使用パターン
# 1.全カテゴリーごとの使用金額
# 2.特定カテゴリのひと月(フィルタ系(複数指定可能にする))
@router.get("/record")
async def recordGet(
    request: Request,
    db: Session = Depends(get_db),
    date: str | None = None,
    category: str | None = None,
    detail: bool | None = None,
):
    firebase = Firebase()
    controller = AccountingController(db)

    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)

    info = RecordQuery(date=date, category=category, detail=detail)
    print("info")
    return await controller.RecordGet(uid, info)


@router.post("/record")
async def recordPost(
    request: Request, body: AccountingRecordPost, db: Session = Depends(get_db)
):
    firebase = Firebase()
    controller = AccountingController(db)
    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)
    return await controller.RecordPost(uid, body)
