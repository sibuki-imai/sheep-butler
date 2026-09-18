import React, { useState, useEffect } from "react";
import CalendarDrawing from "../../shared/calendar/calendarDrawing";
import Header from "../components/header";
import TextBox from "../../shared/textBox/textBox";
import SendButton from "../../icons/send.svg?react";
import CategoryGrid from "../components/categoryList";
import FormatDate from "../components/formatDate";
import axios from "axios";
import { ResultPopup } from "../../shared/resultPopup/resultPopup";

function InputPage() {
  const [money, setMoney] = useState("");
  const [memo, setMemo] = useState("");
  const [itemName, setItemName] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [categories, setCategories] = useState([]);
  const [popupStatus, setPopupStatus] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
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

        // その他のエラー
        setPopupStatus(500);
        setPopupMessage("エラーが発生しました");
      }
    };

    fetchCategories();
  }, []);

  const sendPush = async () => {
    try {
      if (Number(money) == 0 || selectedCategory == null) {
        if (Number(money) == 0 && selectedCategory == null) {
          throw new Error("金額とカテゴリが入力されていません");
        } else if (Number(money) == 0) {
          throw new Error("金額が入力されていません");
        } else {
          throw new Error("カテゴリが入力されていません");
        }
      }

      await axios.post(
        `${BE_ENDPOINT}/accounting/record`,
        {
          accounting_basic_id: selectedCategory,
          amount: Number(money),
          purchase_date: FormatDate(selectedDate ?? new Date()),
          item_name: itemName,
          memo: memo,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      setPopupStatus(200);
      setPopupMessage("登録が完了しました");
      // ★ フォームをクリア
      setMoney("");
      setMemo("");
      setItemName("");
      setSelectedCategory(null);
    } catch (e) {
      console.log("e", e);
      if (axios.isAxiosError(e)) {
        const detail = e.response?.data?.detail;

        // detail が配列 or オブジェクトの場合に文字列化
        const errorMessage =
          typeof detail === "string"
            ? detail
            : Array.isArray(detail)
              ? detail.map((d) => d.msg).join(" / ")
              : "不明なエラーです";
        setPopupStatus(e.response?.status ?? 500);
        setPopupMessage(errorMessage);
      } else {
        if (axios.isAxiosError(e) && e.response?.status === 401) {
          setPopupStatus(401);
          setPopupMessage("再ログインが必要です");
          return;
        }
        if (e instanceof Error) {
          setPopupStatus(400);
          setPopupMessage(e.message);
          return;
        }
        setPopupStatus(500);
        setPopupMessage("不明なエラーです");
      }
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
      <Header type="input" />
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        {/* ============================
            カレンダー
            ============================ */}
        <div
          style={{
            width: isMobile ? "100%" : "50%",
            display: "flex",
            justifyContent: "center",
            marginTop: "15px",
          }}
        >
          <CalendarDrawing onSelectDate={setSelectedDate} openSelect={false} />
        </div>

        <div
          style={{
            width: isMobile ? "100%" : "80%",
          }}
        >
          {/* ============================
            金額入力
            ============================ */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <div
                style={{
                  width: isMobile ? "75%" : "50%",
                  marginLeft: "15%",
                  // display: "flex",
                }}
              >
                <TextBox
                  label="金額"
                  value={money}
                  onChange={setMoney}
                  type="number"
                />
              </div>
              <div
                style={{
                  marginLeft: "10px",
                  marginTop: "15px",
                  fontSize: "20px",
                }}
              >
                円
              </div>
            </div>
          </div>
          {/* ============================
            項目リスト
            ============================ */}
          <div
            style={{
              width: "100%",
              height: "300px",
              marginTop: "20px",
            }}
          >
            <CategoryGrid
              categories={categories}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>
      </div>
      {/* ============================
          商品名欄
          ============================ */}
      <div
        style={{
          width: "80%",
          marginLeft: "10%",
        }}
      >
        <TextBox
          label="商品名"
          value={itemName}
          onChange={setItemName}
          type="text"
        />
      </div>
      {/* ============================
          メモ欄
          ============================ */}
      <div
        style={{
          width: "80%",
          marginLeft: "10%",
        }}
      >
        <TextBox label="メモ" value={memo} onChange={setMemo} type="text" />
      </div>

      {/* ============================
          送信ボタン
          ============================ */}
      <button
        style={{
          color: "#1976D2",
          position: "fixed",
          display: "flex",
          fontSize: "20px",
          width: "70%",
          backgroundColor: "#daeeff",
          borderRadius: "30px",
          padding: "12px 20px",
          bottom: "20px", // 画面下からの距離
          left: "50%", // 中央寄せの基準
          justifyContent: "center",
          transform: "translateX(-50%)", // 中央にする
          zIndex: 999, // 他の要素より前に出す
        }}
        onClick={sendPush}
      >
        送信
        <SendButton width={40} height={40} style={{ marginLeft: "15px" }} />
      </button>
    </div>
  );
}

export default InputPage;
