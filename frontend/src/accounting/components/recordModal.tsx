import React, { useState, useEffect } from "react";
import axios from "axios";
import { ResultPopup } from "../../shared/resultPopup/resultPopup";
import { IconMap } from "./iconIndex";
import TextBox from "../../shared/textBox/textBox";
import Drawing from "../../shared/calendar/drawing";
import Cross from "../../icons/cross.svg?react";
import WriteSepo from "../../icons/writeSepo.svg?react";
import FormatDate from "./formatDate";
import Trash from "../../icons/trash.svg?react";

type CategoryInfo = {
  categorieId: string;
  iconName: string;
  categoryName: string;
  collar: string;
};
type Category = {
  id: string;
  name: string;
  icon: string;
  collar: string;
  remaining_balance: number;
  sum_amount: number;
};

type Record = {
  id: string;
  accounting_basic_id: string;
  amount: number;
  item_name: string;
  memo: string;
  purchase_date: string;
};

type Props = {
  categoryInfo: CategoryInfo;
  record: Record | null;
  onClose: () => void;
  onSave: (updated: Record) => void;
  onDelete: (id: string) => void;
};
const isMobile = window.innerWidth < 768;

function CategoryModal({
  onSelect,
}: {
  onSelect: (category: Category) => void;
}) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/accounting/record/`, {
        withCredentials: true,
      });
      setCategories(res.data);
    };
    fetchData();
  }, []);

  const columns = isMobile ? 2 : 6;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "16px",
        padding: "10px",
      }}
    >
      {categories.map((category) => {
        const IconComponent = IconMap[category.icon];

        return (
          <div
            key={category.id}
            onClick={() => onSelect(category)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "12px",
              borderRadius: "10px",
              background: "#fff",
              cursor: "pointer",
            }}
          >
            <IconComponent
              width={40}
              height={40}
              style={{ color: category.collar }}
            />
            <span style={{ marginTop: "8px" }}>{category.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function RecordModal({
  categoryInfo,
  record,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [popupStatus, setPopupStatus] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  // 編集モード管理
  const [isEditing, setIsEditing] = React.useState(false);

  // 編集用 state
  const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
    if (!record) return null;
    return new Date(record.purchase_date);
  });
  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryInfo);
  const [itemName, setItemName] = React.useState(record?.item_name ?? "");
  const [amount, setAmount] = React.useState(record?.amount ?? 0);
  const [memo, setMemo] = React.useState(record?.memo ?? "");

  const init = () => {
    if (record) {
      const [y, m, d] = record.purchase_date.split("-");
      setSelectedDate(new Date(Number(y), Number(m) - 1, Number(d)));

      // カテゴリーも初期化
      setSelectedCategory(categoryInfo);

      // テキスト類も初期化
      setItemName(record.item_name);
      setAmount(record.amount);
      setMemo(record.memo);
    }
  };

  if (!record) return null;

  const IconComponent = IconMap[selectedCategory.iconName];
  const moneyComma = (raw: number) => {
    return raw.toLocaleString();
  };

  // 保存処理
  const handleSave = () => {
    try {
      if (Number(amount) == 0 || selectedDate == null) {
        if (Number(amount) == 0 && selectedDate == null) {
          throw new Error("金額と日付が入力されていません");
        } else if (Number(amount) == 0) {
          throw new Error("金額が入力されていません");
        } else {
          throw new Error("日付が入力されていません");
        }
      }

      onSave({
        ...record,
        accounting_basic_id: selectedCategory.categorieId,
        purchase_date: FormatDate(selectedDate),
        // `${selectedDate.getFullYear()}-` +
        // `${String(selectedDate.getMonth() + 1).padStart(2, "0")}-` +
        // `${String(selectedDate.getDate()).padStart(2, "0")}`,
        item_name: itemName,
        amount,
        memo,
      });
      setIsEditing(false);
      setIsEditingCategory(false);
    } catch (e) {
      if (e instanceof Error) {
        setPopupStatus(400);
        setPopupMessage(e.message);
        return;
      }
      setPopupStatus(500);
      setPopupMessage("不明なエラーです");
    }
  };

  const handleDelete = (id: string) => {
    try {
      onDelete(id);
      setIsEditing(false);
      setIsEditingCategory(false);
    } catch (e) {
      if (e instanceof Error) {
        setPopupStatus(400);
        setPopupMessage(e.message);
        return;
      }
      setPopupStatus(500);
      setPopupMessage("不明なエラーです");
    }
  };

  // ボタンの共通スタイル（高さが変わらない）
  const headerButtonStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 14px",
    borderRadius: "16px",
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "1",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      {popupStatus !== null && (
        <ResultPopup
          status={popupStatus}
          message={popupMessage ?? undefined}
          onClose={() => setPopupStatus(null)}
        />
      )}
      <div
        style={{
          backgroundColor: "#e8eff5",
          padding: "5px",
          borderRadius: "10px",
          width: "90%",
          height: "90%",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        {/* ヘッダー */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 12px",
            borderBottom: "1px solid #d0d7de",
            minHeight: "60px",
          }}
        >
          {/* 左：閉じる */}
          <button
            onClick={onClose}
            style={{
              ...headerButtonStyle,
              background: "#f0f4f8",
              border: "2px solid #b0c4d9",
              color: "#3a6ea5",
            }}
          >
            <Cross width={24} height={24} style={{ color: "#3a6ea5" }} />
            閉じる
          </button>

          {/* 右：編集 or キャンセル */}
          {!isEditing ? (
            <button
              onClick={() => {
                setIsEditing(true);
                setIsEditingCategory(false); // ← 編集開始時に必ず閉じる
              }}
              style={{
                ...headerButtonStyle,
                background: "#e6f0ff",
                border: "2px solid #4a90e2",
                color: "#4a90e2",
              }}
            >
              編集
              <WriteSepo width={24} height={24} style={{ color: "#4a90e2" }} />
            </button>
          ) : (
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  handleDelete(record.id);
                }}
                style={{
                  ...headerButtonStyle,
                  background: "#f5f5f5",
                  border: "2px solid #ff0000",
                  color: "#ff0000",
                }}
              >
                <Trash width={25} height={25} />
                削除
              </button>

              <button
                onClick={() => {
                  init();
                  setIsEditing(false);
                  setIsEditingCategory(false);
                  setIsEditingDate(false);
                }}
                style={{
                  ...headerButtonStyle,
                  background: "#f5f5f5",
                  border: "2px solid #ccc",
                  color: "#666",
                }}
              >
                キャンセル
              </button>
            </div>
          )}
        </div>

        {/* メイン箇所 */}
        <div
          style={{
            marginLeft: "15px",
            marginRight: "15px",
            marginTop: "10px",
            flex: 1,
          }}
        >
          {/* カテゴリー */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            カテゴリー：
            <div>
              {isEditing ? (
                // 編集モードのときだけカテゴリー変更できる
                <>
                  {isEditingCategory ? (
                    <CategoryModal
                      onSelect={(cat) => {
                        setSelectedCategory({
                          categorieId: cat.id,
                          iconName: cat.icon,
                          categoryName: cat.name,
                          collar: cat.collar,
                        });
                        setIsEditingCategory(false); // ← 選んだら閉じる
                      }}
                    />
                  ) : (
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => setIsEditingCategory(true)}
                    >
                      <IconComponent
                        width={40}
                        height={40}
                        style={{
                          color: selectedCategory.collar,
                          marginLeft: "10px",
                        }}
                      />
                      <div style={{ marginLeft: "10px" }}>
                        {selectedCategory.categoryName}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <IconComponent
                    width={40}
                    height={40}
                    style={{
                      color: selectedCategory.collar,
                      marginLeft: "10px",
                    }}
                  />
                  <div style={{ marginLeft: "10px" }}>
                    {selectedCategory.categoryName}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 日付 */}
          <div style={{ marginBottom: "20px" }}>
            {isEditing ? (
              <div>
                {!isEditingDate ? (
                  <div
                    onClick={() => isEditing}
                    style={{ cursor: isEditing ? "pointer" : "default" }}
                  >
                    <Drawing
                      onSelectDate={setSelectedDate}
                      selectedDate={new Date(record.purchase_date)}
                      openSituation={false}
                    />
                  </div>
                ) : (
                  <div onClick={() => isEditing}>
                    <Drawing
                      onSelectDate={setSelectedDate}
                      selectedDate={new Date(record.purchase_date)}
                      openSituation={true}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ cursor: isEditing ? "pointer" : "default" }}>
                日付：{record.purchase_date.slice(0, 10).replace(/-/g, "/")}
              </div>
            )}
          </div>

          {/* 金額 */}
          <div style={{ marginBottom: "20px" }}>
            {isEditing ? (
              <TextBox
                label="金額"
                type="number"
                value={String(amount)}
                bgColor="#e8eff5"
                onChange={(v) => setAmount(Number(v))}
              />
            ) : (
              <span> 金額：{moneyComma(record.amount)}円</span>
            )}
          </div>

          {/* 商品名 */}
          <div style={{ marginBottom: "20px" }}>
            {isEditing ? (
              <TextBox
                label="商品名"
                type="text"
                value={itemName}
                bgColor="#e8eff5"
                onChange={(v) => setItemName(v)}
              />
            ) : (
              <span>商品名：{record.item_name}</span>
            )}
          </div>

          {/* メモ */}
          <div style={{ marginBottom: "20px" }}>
            {isEditing ? (
              <TextBox
                label="メモ"
                type="text"
                value={memo}
                bgColor="#e8eff5"
                onChange={(v) => setMemo(v)}
              />
            ) : (
              <span>メモ：{record.memo}</span>
            )}
          </div>
        </div>

        {/* 保存ボタン（編集モード時のみ） */}
        {isEditing && (
          <button
            onClick={handleSave}
            style={{
              margin: "10px",
              padding: "12px",
              background: "#4a90e2",
              color: "#fff",
              borderRadius: "10px",
              fontWeight: "bold",
              fontSize: "16px",
            }}
          >
            保存
          </button>
        )}
      </div>
    </div>
  );
}

export default RecordModal;
