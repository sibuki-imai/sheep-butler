import React, { useState, useEffect } from "react";
import CalendarDrawing from "../../shared/calendar/calendarDrawing";
import Header from "../components/header";
import TextBox from "../../shared/textBox/textBox";
import SendButton from "../../icons/send.svg?react";
import CategoryGrid from "../components/categoryList";
import axios from "axios";

function InputPage() {
  const [money, setMoney] = useState("");
  const [memo, setMemo] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [categories, setCategories] = useState([]);
  const BE_ENDPOINT = import.meta.env.VITE_BEAPI;
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${BE_ENDPOINT}/account`, {
          withCredentials: true,
        });
        console.log("res", res);
        setCategories(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchCategories();
  }, []);

  const sendPush = () => {
    console.log("date:", selectedDate);
    console.log("money:", money);
    console.log("category:", selectedCategory);
    console.log("memo:", memo);
  };

  return (
    <div style={{ width: "100%", paddingBottom: "200px" }}>
      <Header />
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
          <CalendarDrawing onSelectDate={setSelectedDate} />
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
                  width: isMobile ? "80%" : "50%",
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
          zIndex: 9999, // 他の要素より前に出す
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
