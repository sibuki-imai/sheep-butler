import requests
from src.accounting.accounting_repository import AccountingRepository
from src.utils.firebase import Firebase
from src.schema.accounting_schema import (
    AccountingRecordPost,
    AccountingRecordPatch,
    AccountingRecordDelete,
    AccountingBasicPatch,
    RecordQuery,
    AccountingRecordBulkPost,
)
from src.model.accounting_record import AccountingRecord
from src.model.accounting_basic import AccountingBasic
from datetime import datetime, date
from src.schema.accounting_schema import AccountingBasicUpdate
from src.schema.accounting_schema import AccountingRecordUpdate
from fastapi import APIRouter, UploadFile, File
from dateutil.relativedelta import relativedelta
import re

import cv2
import numpy as np
import pytesseract

from pytesseract import Output


class AccountingService:
    def __init__(self, session):
        self.session = session
        self.repo = AccountingRepository(session)
        self.firebase = Firebase()

    # 項目関係

    # 初期セット
    def Initial(self, user_id: str):
        self.repo.Initial(user_id)
        return

    # 取得
    def CategoryGet(
        self,
        user_id: str,
        id: str | None = None,
    ):
        return self.repo.CategoryGet(user_id, id)

    # カテゴリ編集
    async def CategoryPatch(self, user_id: str, body: AccountingBasicPatch):
        category = await self.repo.CategoryOneGet(body.id)
        if category is None:
            raise Exception("Record not found")

        update = AccountingBasicUpdate(
            icon=body.icon,
            collar=body.collar,
            name=body.name,
            fixed_money=body.fixed_money,
            remaining_balance=body.remaining_balance,
        )
        try:
            with self.session.begin_nested():
                await self.repo.CategoryUpdate(str(category.id), update)
            return {"status": "ok"}
        except Exception as e:
            #  rollback（失敗時）
            print("ロールバック")
            raise e

    # カテゴリ削除
    async def CategoryDelete(self, user_id: str, id: str):
        category = await self.repo.CategoryOneGet(id)
        if category is None:
            raise Exception("Record not found")

        try:
            with self.session.begin_nested():
                # カテゴリの削除(論理)
                await self.repo.CategoryDelete(user_id, id)
            return {"status": "ok"}
        except Exception as e:
            #  rollback（失敗時）
            print("ロールバック")
            raise e

    # レコード取得
    async def RecordGet(self, user_id: str, info: RecordQuery):
        # info.dateの成型
        if info.date:
            dt = datetime.fromisoformat(info.date).date()
        else:
            dt = date.today()

        # 月初
        start = dt.replace(day=1)

        # 翌月の月初
        if start.month == 12:
            end = start.replace(year=start.year + 1, month=1)
        else:
            end = start.replace(month=start.month + 1)

        # カテゴリの設定
        category = info.category
        #  info.detailがtrueのみ各レコードの詳細も取得
        if info.detail is True:
            result = await self.repo.RecordInfoGet(user_id, start, end, category)
        else:
            rows = await self.repo.RecordGet(user_id, start, end, category)
            result = [
                {
                    "id": r[0],
                    "name": r[1],
                    "icon": r[2],
                    "collar": r[3],
                    "remaining_balance": r[4],
                    "sum_amount": r[5],
                    "fixed_money": r[6],
                }
                for r in rows
            ]
        return result

    # レコードポスト
    async def RecordPost(self, user_id: str, body: AccountingRecordPost):

        # 登録するレコードのカテゴリを取得
        categoryInfo = await self.repo.CategoryOneGet(body.accounting_basic_id)
        if categoryInfo is None:
            raise Exception("Category not found")

        # レコードの追加
        newdate = AccountingRecord(
            user_id=user_id,
            accounting_basic_id=body.accounting_basic_id,
            amount=body.amount,
            purchase_date=body.purchase_date,
            item_name=body.item_name,
            memo=body.memo,
        )

        updateMoney = categoryInfo.remaining_balance - body.amount

        date = AccountingBasicUpdate(remaining_balance=updateMoney)
        try:
            with self.session.begin_nested():
                # レコードの作成
                await self.repo.RecordPost(newdate)

                # カテゴリ残金更新
                await self.repo.CategoryUpdate(body.accounting_basic_id, date)

            return {"status": "ok"}
        except Exception as e:
            #  rollback（失敗時）
            print("ロールバック")
            raise e
        return

    # レコードポスト(一括)
    async def recordBulkPost(self, user_id: str, body: AccountingRecordBulkPost):

        # 登録するレコードのカテゴリを取得
        categoryInfo = await self.repo.CategoryOneGet(body.accounting_basic_id)
        if categoryInfo is None:
            raise Exception("Category not found")

        # 合計の値段
        update_money = sum(item.amount for item in body.data)

        # 各レコードの登録値
        new_records = [
            AccountingRecord(
                user_id=user_id,
                accounting_basic_id=body.accounting_basic_id,
                purchase_date=body.purchase_date,
                amount=item.amount,
                item_name=item.item_name,
                memo=item.memo,
            )
            for item in body.data
        ]

        updateMoney = categoryInfo.remaining_balance - update_money

        date = AccountingBasicUpdate(remaining_balance=updateMoney)
        try:
            with self.session.begin_nested():
                # レコードの作成
                await self.repo.recordBulkPost(new_records)

                # カテゴリ残金更新
                await self.repo.CategoryUpdate(body.accounting_basic_id, date)

            return {"status": "ok"}
        except Exception as e:
            #  rollback（失敗時）
            print("ロールバック")
            raise e
        return

    # レコード編集
    async def RecordPatch(self, user_id: str, body: AccountingRecordPatch):

        # 元レコードの取得
        oldRecord = await self.repo.RecordOneGet(body.id)
        if oldRecord is None:
            raise Exception("Record not found")

        # 紐づくレコードのカテゴリを取得
        categoryInfo = await self.repo.CategoryOneGet(
            str(oldRecord.accounting_basic_id)
        )
        if categoryInfo is None:
            raise Exception("Category not found")

        # カテゴリ変更
        if str(body.accounting_basic_id) != str(oldRecord.accounting_basic_id):
            # カテゴリ変更がある場合
            oldCategoryId = str(oldRecord.accounting_basic_id)
            # 新たに紐ずくカテゴリ情報の取得
            newCategoryInfo = await self.repo.CategoryOneGet(body.accounting_basic_id)
            if newCategoryInfo is None:
                raise Exception("Category not found")

            # 更新後レコード情報
            update = AccountingRecordUpdate(
                accounting_basic_id=body.accounting_basic_id,
                amount=body.amount,
                purchase_date=body.purchase_date,
                item_name=body.item_name,
                memo=body.memo,
            )

            # 現状紐づくカテゴリ[現状のカテゴリ合計金額＋現状のレコード金額](返金状態)
            backDate = categoryInfo.remaining_balance + oldRecord.amount

            oldBasicDate = AccountingBasicUpdate(remaining_balance=backDate)

            # 今後紐づくカテゴリ[新規カテゴリ合計金額＋新規レコード金額](通常登録状態)
            updateMoney = newCategoryInfo.remaining_balance - body.amount
            newBasicDate = AccountingBasicUpdate(remaining_balance=updateMoney)
            try:
                with self.session.begin_nested():
                    # レコードの更新
                    await self.repo.RecordUpdate(body.id, user_id, update)

                    # カテゴリ残金更新
                    # 現状の巻き戻し
                    await self.repo.CategoryUpdate(oldCategoryId, oldBasicDate)
                    # 新規情報の入力
                    await self.repo.CategoryUpdate(
                        body.accounting_basic_id, newBasicDate
                    )

                return {"status": "ok"}
            except Exception as e:
                #  rollback（失敗時）
                print("ロールバック")
                raise e
        else:
            # カテゴリ変更なし

            # 更新後レコード情報
            update = AccountingRecordUpdate(
                amount=body.amount,
                purchase_date=body.purchase_date,
                item_name=body.item_name,
                memo=body.memo,
            )

            # 差分の計算[現カテゴリ金額+(変更前のレコード金額-変更後レコード金額)]
            difference = categoryInfo.remaining_balance + (
                oldRecord.amount - body.amount
            )

            # カテゴリ情報
            basicDate = AccountingBasicUpdate(remaining_balance=difference)
            try:
                with self.session.begin_nested():
                    # レコードの更新
                    await self.repo.RecordUpdate(body.id, user_id, update)

                    # カテゴリ残金更新
                    await self.repo.CategoryUpdate(body.accounting_basic_id, basicDate)

                return {"status": "ok"}
            except Exception as e:
                #  rollback（失敗時）
                print("ロールバック")
                raise e

    # レコード削除
    async def RecordDelete(self, user_id: str, id: str):
        # 削除予定のレコード取得
        deleteRecord = await self.repo.RecordOneGet(id)
        if deleteRecord is None:
            raise Exception("Record not found")

        # 紐づくレコードのカテゴリを取得
        categoryInfo = await self.repo.CategoryOneGet(
            str(deleteRecord.accounting_basic_id)
        )
        if categoryInfo is None:
            raise Exception("Category not found")
        # カテゴリ修正のデータ組み立て
        oldBasicDate = AccountingBasicUpdate(
            remaining_balance=categoryInfo.remaining_balance + deleteRecord.amount
        )

        try:
            with self.session.begin_nested():
                # レコード削除(物理)
                await self.repo.RecordDelete(user_id, id)
                # カテゴリの修正
                await self.repo.CategoryUpdate(
                    str(deleteRecord.accounting_basic_id), oldBasicDate
                )
            return {"status": "ok"}
        except Exception as e:
            #  rollback（失敗時）
            print("ロールバック")
            raise e

    # OCR
    async def PhotoOcr(self, image_data: bytes):
        try:
            # bytes → OpenCV画像
            image = cv2.imdecode(
                np.frombuffer(image_data, np.uint8),
                cv2.IMREAD_COLOR,
            )

            if image is None:
                raise ValueError("画像を読み込めませんでした")

            print("image size:", image.shape)

            # グレースケール化
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # 二値化
            _, binary = cv2.threshold(
                gray,
                0,
                255,
                cv2.THRESH_BINARY + cv2.THRESH_OTSU,
            )

            # OCR
            data = pytesseract.image_to_data(
                binary,
                lang="jpn",
                config="--psm 6",
                output_type=Output.DICT,
            )

            ocr_results = []

            for i, text in enumerate(data["text"]):
                text = text.strip()

                if not text:
                    continue

                try:
                    confidence = float(data["conf"][i])
                except (ValueError, TypeError):
                    continue

                if confidence < 30:
                    continue

                ocr_results.append(
                    {
                        "text": text,
                        "x": int(data["left"][i]),
                        "y": int(data["top"][i]),
                        "width": int(data["width"][i]),
                        "height": int(data["height"][i]),
                        "confidence": confidence,
                    }
                )

            # リスト化処理
            lines = []

            for item in sorted(ocr_results, key=lambda x: x["y"]):
                item_center_y = item["y"] + item["height"] / 2

                found_line = None

                for line in lines:
                    line_center_y = line["center_y"]

                    if abs(item_center_y - line_center_y) < 20:
                        found_line = line
                        break

                if found_line:
                    found_line["items"].append(item)

                    # 行の中心Yを更新
                    centers = [x["y"] + x["height"] / 2 for x in found_line["items"]]
                    found_line["center_y"] = sum(centers) / len(centers)

                else:
                    lines.append(
                        {
                            "center_y": item_center_y,
                            "items": [item],
                        }
                    )

            # 左 → 右に並べる
            for line in lines:
                line["items"].sort(key=lambda x: x["x"])

                # OCR結果を左から右へ結合
                line["text"] = "".join(item["text"] for item in line["items"])

            return lines

        except Exception as e:
            raise e

    # フォーマット整形
    async def PhotoArrange(self, list: list):
        try:
            arrangeList = []

            for line in list:
                text = line["text"].strip()

                # 値引き項目の削除
                if "-" in text:
                    continue

                # 行末の数字を探す
                match = re.search(r"(\d{1,5})\s*[※A]*$", text)

                if not match:
                    continue

                amount = int(match.group(1))

                # 金額より前を商品名にする
                name = text[: match.start()].strip()

                if not name:
                    continue

                arrangeList.append(
                    {
                        "name": name,
                        "amount": amount,
                    }
                )

            return arrangeList

        except Exception as e:
            raise e
