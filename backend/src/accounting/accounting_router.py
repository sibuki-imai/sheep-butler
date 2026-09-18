from fastapi import APIRouter, Request, Depends
from src.database import get_db
from sqlalchemy.orm import Session
from src.utils.firebase import Firebase
from src.schema.accounting_schema import (
    AccountingRecordPost,
    AccountingRecordPatch,
    AccountingBasicPatch,
    RecordQuery,
    AccountingRecordBulkPost,
)
from src.accounting.accounting_controller import AccountingController

router = APIRouter()


# カテゴリー
# 取得
@router.get("/")
def categoryGet(
    request: Request,
    db: Session = Depends(get_db),
    id: str | None = None,
):
    firebase = Firebase()
    controller = AccountingController(db)

    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)

    return controller.CategoryGet(uid, id)


# 編集
@router.patch("/")
async def categoryPatch(
    request: Request, body: AccountingBasicPatch, db: Session = Depends(get_db)
):
    firebase = Firebase()
    controller = AccountingController(db)
    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)
    return await controller.CategoryPatch(uid, body)


# 削除(論理)
@router.delete("/{id}")
async def categoryDelete(
    id: str,
    request: Request,
    db: Session = Depends(get_db),
):
    firebase = Firebase()
    controller = AccountingController(db)
    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)
    return await controller.CategoryDelete(uid, id)


# レコード
# 取得
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
    return await controller.RecordGet(uid, info)


# 作成
@router.post("/record")
async def recordPost(
    request: Request, body: AccountingRecordPost, db: Session = Depends(get_db)
):
    firebase = Firebase()
    controller = AccountingController(db)
    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)
    return await controller.RecordPost(uid, body)


# 作成(一括)
@router.post("/record/bulk")
async def recordBulkPost(
    request: Request, body: AccountingRecordBulkPost, db: Session = Depends(get_db)
):
    firebase = Firebase()
    controller = AccountingController(db)
    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)
    return await controller.recordBulkPost(uid, body)


# 編集
@router.patch("/record")
async def recordPatch(
    request: Request, body: AccountingRecordPatch, db: Session = Depends(get_db)
):
    firebase = Firebase()
    controller = AccountingController(db)
    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)
    return await controller.RecordPatch(uid, body)


# 削除(物理)
@router.delete("/record/{id}")
async def recordDelete(
    id: str,
    request: Request,
    db: Session = Depends(get_db),
):
    firebase = Firebase()
    controller = AccountingController(db)
    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)
    return await controller.RecordDelete(uid, id)
