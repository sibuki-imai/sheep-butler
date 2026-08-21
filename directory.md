```txt
project/
├─ frontend/
│ └─ src/
│ └─ user/
│   ├─ pages/ # ページそのもの
│   ├─ components/ # ページで使用するパーツ
│   ├─ hooks/ # 通信成型＋状態管理＋UI に渡す形に整形
│   └─ api/ # 通信
│
└─ backend/
   └─ src/
        ├─  user/
        │   ├─user_router.py
        │   ├─ user_controller.py
        │   ├─ user_service.py
        │   ├─ user_repository.py
        ├─ model/
        │   └─ user_model.py
        └─ schema/
            └─ user_schema.py
```
