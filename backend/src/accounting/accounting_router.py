from fastapi import APIRouter, Request, Depends
import json
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
from fastapi import APIRouter, UploadFile, File
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


# 画像読み取り
@router.post("/record/photo")
async def photo(
    request: Request,
    photo: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    firebase = Firebase()
    controller = AccountingController(db)
    session_cookie = request.cookies.get("session")
    uid = firebase.session_check(session_cookie)
    image_data = await photo.read()
    print("========== PHOTO ==========")
    print("filename:", photo.filename)
    print("content_type:", photo.content_type)
    print("size:", len(image_data), "bytes")
    print("============================")

    arrangeList = await controller.PhotoOcr(image_data)

    print("========== OCR JSON ==========")
    # 詳細ver
    # print(json.dumps(ocr_results, ensure_ascii=False, indent=2))
    # ざっくりver
    for item in arrangeList:
        print(item)

    return arrangeList
    # "items": arrangeList,
