import React, { useState, useEffect } from "react";
import axios from "axios";
import { IconMap } from "../components/iconIndex";
import { ResultPopup } from "../../shared/resultPopup/resultPopup";
import Header from "../components/header";
import Refresh from "../../icons/categoryIcons/refresh.svg?react";
import CategoryEditPage from "../components/categoryEditPage";

type Category = {
  id: string;
  name: string;
  icon: string;
  collar: string;
  remaining_balance: number;
  fixed_money: number;
};

function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selected, setSelected] = useState<Category | null>(null);
  const [popupStatus, setPopupStatus] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isOpen, setOpen] = useState<boolean>(false);
  const BE_ENDPOINT = import.meta.env.VITE_BEAPI;
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BE_ENDPOINT}/accounting`, {
          withCredentials: true,
        });
        setCategories(res.data);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          setPopupStatus(401);
          setPopupMessage("再ログインが必要です");
          return;
        }
        setPopupStatus(500);
        setPopupMessage("エラーが発生しました");
      }
    };

    fetchCategories();
  });

  // データ編集
  const handleSaveRecord = async (updated: Category) => {
    try {
      await axios.patch(`${BE_ENDPOINT}/accounting/`, updated, {
        withCredentials: true,
      });
      setPopupStatus(200);
      setPopupMessage("編集が完了しました");
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setPopupStatus(401);
        setPopupMessage("再ログインが必要です");
        return;
      }

      // その他のエラー
      setPopupStatus(500);
      setPopupMessage("エラーが発生しました");
    }
  };

  // データ削除
  const handleDeleteRecord = async (id: string) => {
    try {
      await axios.delete(`${BE_ENDPOINT}/accounting/${id}`, {
        withCredentials: true,
      });
      setPopupStatus(200);
      setPopupMessage("削除が完了しました");
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 401) {
        setPopupStatus(401);
        setPopupMessage("再ログインが必要です");
        return;
      }

      // その他のエラー
      setPopupStatus(500);
      setPopupMessage("エラーが発生しました");
    }
  };

  return (
    <div style={{ width: "100%", paddingBottom: "200px" }}>
      {popupStatus !== null && (
        <ResultPopup
          status={popupStatus}
          message={popupMessage ?? undefined}
          onClose={() => setPopupStatus(null)}
        />
      )}

      <Header type="category" />
      {isOpen ? (
        <CategoryEditPage
          categoryInfo={selected}
          onClose={() => {
            setSelected(null);
            setOpen(false);
          }}
          onSave={(updated) => {
            handleSaveRecord(updated);
            setSelected(null);
            setOpen(false);
          }}
          onDelete={(id) => {
            handleDeleteRecord(id);
            setSelected(null);
            setOpen(false);
          }}
        />
      ) : (
        <div />
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(1, 1fr)`,
          gap: "1px",
        }}
      >
        <div
          style={{
            boxSizing: "border-box",
            padding: "1em",
            border: "2px solid #ccc",
            borderRadius: "10px",
            backgroundColor: "#f7f7fb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
            transition: "all 0.2s ease",
            margin: "5px auto",
            width: isMobile ? "90%" : "70%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "16px",
                maxWidth: "150px",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            >
              項目名
            </div>
          </div>

          {/* 右側：固定金額 */}
          <div
            style={{
              fontSize: "15px",
              minWidth: "120px",
              textAlign: "right",
            }}
          >
            毎月の予算
          </div>
        </div>
        {categories.map((data) => {
          const IconComponent = IconMap[data.icon] ?? Refresh;

          return (
            <button
              key={data.id}
              style={{
                boxSizing: "border-box",
                padding: "1em",
                border: "2px solid #ccc",
                borderRadius: "10px",
                backgroundColor: "#f7f7fb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                margin: "5px auto",
                width: isMobile ? "90%" : "70%",
              }}
              onClick={() => {
                setSelected(data);
                setOpen(true);
              }}
            >
              {/* 左側：アイコン＋名前（横並び） */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >
                <IconComponent
                  width={40}
                  height={40}
                  style={{ color: data.collar }}
                />

                <div
                  style={{
                    fontSize: "16px",
                    maxWidth: "150px",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {data.name}
                </div>
              </div>

              {/* 右側：固定金額 */}
              <div
                style={{
                  fontSize: "15px",
                  minWidth: "120px",
                  textAlign: "right",
                }}
              >
                {Number(data.fixed_money).toLocaleString()} 円
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryPage;
