起動コマンド
uvicorn src.main:app --reload

# TBL変更の手順

1.Modlの変更
2.docker compose exec backend alembic revision --autogenerate -m "コメントs"　の実行
3.docker compose exec backend cat alembic/versions/\*.py のコマンドで新規TBLOの確認
4.docker compose exec backend alembic upgrade head のコマンドでDB反映
