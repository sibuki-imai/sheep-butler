import React, { useState } from "react";
import CalendarDrawing from "../../shared/calendar/calendarDrawing";
import Header from "../components/header";
import TextBox from "../../shared/textBox/textBox";
import SendButton from "../../icons/send.svg?react";

function InputPage() {
  const [money, setMoney] = useState("");

  const isMobile = window.innerWidth < 768;

  return (
    <div style={{ width: "100%" }}>
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
          <CalendarDrawing />
        </div>

        {/* ============================
            金額入力
            ============================ */}
        <div
          style={{
            width: isMobile ? "100%" : "60%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
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
      </div>

      {/* ============================
          送信ボタン
          ============================ */}
      <SendButton width={40} height={40} style={{ color: "#1976D2" }} />
    </div>
  );
}

export default InputPage;
