import React, { useState } from "react";
import { ResultPopup } from "../../shared/resultPopup/resultPopup";
import { IconMap } from "./iconIndex";
import TextBox from "../../shared/textBox/textBox";
import ColorPalette from "../../shared/colors/pallet";
import Cross from "../../icons/cross.svg?react";
import WriteSepo from "../../icons/writeSepo.svg?react";
import Trash from "../../icons/trash.svg?react";

type Category = {
  id: string;
  name: string;
  icon: string;
  collar: string;
  remaining_balance: number;
  fixed_money: number;
};

type Props = {
  categoryInfo: Category | null;
  onClose: () => void;
  onSave: (updated: Category) => void;
  onDelete: (id: string) => void;
};
const isMobile = window.innerWidth < 768;
const view = isMobile ? 3 : 13;

function CategoryEditPage({ categoryInfo, onClose, onSave, onDelete }: Props) {
  if (!categoryInfo) {
    throw Error;
  }
  const data = categoryInfo;
  const [popupStatus, setPopupStatus] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  // 編集モード管理
  const [isEditing, setIsEditing] = React.useState(false);

  const [isEditingCategory, setIsEditingCategory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(data);
  const [icon, setIcon] = React.useState(data.icon ?? "");
  const [collar, setCollar] = React.useState(data.collar ?? "");
  const [itemName, setItemName] = React.useState(data.name ?? "");
  const [fixedMoney, setFixedMoney] = React.useState(data.fixed_money ?? 0);
  const [remaining, setRemaining] = React.useState(data.remaining_balance ?? 0);

  const init = () => {
    if (selectedCategory) {
      // カテゴリーも初期化
      setSelectedCategory(categoryInfo);

      // テキスト類も初期化
      setIcon(selectedCategory.icon);
      setCollar(selectedCategory.collar);
      setItemName(selectedCategory.name);
      setFixedMoney(selectedCategory.fixed_money);
      setRemaining(selectedCategory.remaining_balance);
    }
  };

  if (!data) return null;

  const IconComponent = IconMap[icon];
  const moneyComma = (raw: number) => {
    return raw.toLocaleString();
  };

  // 保存処理
  const handleSave = () => {
    try {
      if (Number(fixedMoney) == 0 || itemName == null) {
        if (Number(fixedMoney) == 0 && itemName == null) {
          throw new Error("積み立て金額と項目名が入力されていません");
        } else if (Number(fixedMoney) == 0) {
          throw new Error("積み立て金額が入力されていません");
        } else {
          throw new Error("項目名が入力されていません");
        }
      }

      onSave({
        ...data,
        icon: icon,
        collar: collar,
        name: itemName,
        fixed_money: fixedMoney,
        remaining_balance: remaining,
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
                  handleDelete(data.id);
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
            アイコン：
            <div>
              {isEditing ? (
                // 編集モードのときだけカテゴリー変更できる
                <div>
                  {isEditingCategory ? (
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: `repeat(${view}, 1fr)`,
                        justifyContent: "center",
                      }}
                    >
                      {Object.entries(IconMap).map(([key, IconComponent]) => (
                        <div
                          style={{
                            padding: "0.2em 0.2em",
                            margin: "0.3em 0.3em",
                            fontWeight: "bold",
                            background: " #FFF",
                            border: " solid 2px #494848",
                            borderRadius: " 10px",
                          }}
                        >
                          <div
                            key={key}
                            onClick={() => {
                              setIsEditingCategory(false);
                              setIcon(key);
                            }}
                          >
                            <IconComponent
                              width={40}
                              height={40}
                              style={{
                                color: collar,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div
                      style={{ display: "flex", alignItems: "center" }}
                      onClick={() => setIsEditingCategory(true)}
                    >
                      <IconComponent
                        width={40}
                        height={40}
                        style={{
                          color: collar,
                          marginLeft: "10px",
                        }}
                      />
                    </div>
                  )}
                </div>
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
                </div>
              )}
            </div>
          </div>

          {/* カラー */}
          <div>
            {isEditingCategory ? (
              <div>
                <ColorPalette value={collar} onChange={setCollar} />
              </div>
            ) : (
              <div />
            )}
          </div>

          {/* 項目名 */}
          <div style={{ marginBottom: "20px" }}>
            {isEditing ? (
              <TextBox
                label="項目名"
                type="text"
                value={itemName}
                bgColor="#e8eff5"
                onChange={(v) => setItemName(v)}
              />
            ) : (
              <div style={{ cursor: isEditing ? "pointer" : "default" }}>
                項目名：{data.name}
              </div>
            )}
          </div>

          {/* 予算金額 */}
          <div style={{ marginBottom: "20px" }}>
            {isEditing ? (
              <TextBox
                label="積み立て金額"
                type="number"
                value={String(fixedMoney)}
                bgColor="#e8eff5"
                onChange={(v) => setFixedMoney(Number(v))}
              />
            ) : (
              <span> 積み立て金額：{moneyComma(fixedMoney)}円</span>
            )}
          </div>

          {/* 残金 */}
          <div style={{ marginBottom: "20px" }}>
            {isEditing ? (
              <TextBox
                label="残金"
                type="number"
                value={String(remaining)}
                bgColor="#e8eff5"
                onChange={(v) => setRemaining(Number(v))}
              />
            ) : (
              <span> 残金：{moneyComma(remaining)}円</span>
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

export default CategoryEditPage;
