from pydantic import BaseModel
from typing import Optional
from datetime import date


class AccountingBasicCreate(BaseModel):
    user_id: str
    name: str
    icon: str
    collar: str
    rank: int
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
