from pydantic import BaseModel
from typing import Optional
from datetime import date


class BulkArr(BaseModel):
    amount: int
    item_name: Optional[str] = None
    memo: Optional[str] = None


class AccountingBasicCreate(BaseModel):
    user_id: str
    name: str
    icon: str
    collar: str
    rank: int
    fixed_money: int
    remaining_balance: int


class AccountingBasicPatch(BaseModel):
    id: str
    user_id: Optional[str] = None
    name: Optional[str] = None
    icon: Optional[str] = None
    collar: Optional[str] = None
    fixed_money: int
    remaining_balance: int


class AccountingBasicUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None
    collar: Optional[str] = None
    rank: Optional[int] = None
    fixed_money: Optional[int] = None
    remaining_balance: Optional[int] = None


class AccountingRecordPost(BaseModel):
    accounting_basic_id: str
    amount: int
    purchase_date: date
    item_name: Optional[str] = None
    memo: Optional[str] = None


class AccountingRecordBulkPost(BaseModel):
    accounting_basic_id: str
    purchase_date: date
    data: list[BulkArr]


class AccountingRecordPatch(BaseModel):
    id: str
    accounting_basic_id: str
    amount: int
    purchase_date: date
    item_name: Optional[str] = None
    memo: Optional[str] = None


class AccountingRecordUpdate(BaseModel):
    accounting_basic_id: Optional[str] = None
    amount: int
    purchase_date: date
    item_name: Optional[str] = None
    memo: Optional[str] = None


class AccountingRecordDelete(BaseModel):
    id: str


class RecordQuery(BaseModel):
    date: str | None
    category: str | None
    detail: bool | None
