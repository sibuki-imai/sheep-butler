from pydantic import BaseModel
from enum import Enum
from datetime import datetime


class AccountingBasicCreate(BaseModel):
    user_id: str
    name: str
    icon: str
    collar: str
    rank: int
    fixed_money: int
    remaining_balance: int
