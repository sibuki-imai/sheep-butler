import React, { useState, useEffect } from "react";
import Drawing from "../../shared/calendar/drawing";
import Header from "../components/header";
import SendButton from "../../icons/send.svg?react";
import CategoryBox from "../components/categoryBox";
import BulkInputBlock from "../components/bulkInputBlock";
import FormatDate from "../components/formatDate";
import axios from "axios";
import { ResultPopup } from "../../shared/resultPopup/resultPopup";

type Data = {
  item_name: string | null;
  amount: number | null;
  memo: string | null;
};

function BulkInputPage() {
  const [popupStatus, setPopupStatus] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // SEND
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [data, setData] = useState<Data[]>([]);

  const [categories, setCategories] = useState([]);

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
    console.log("data", data);
    try {
      if (!(data.length > 0)) {
        throw new Error("値が入力されていません");
      }
      if (selectedCategory == null) {
        throw new Error("カテゴリが入力されていません");
      }
      data.map((item) => {
        if (Number(item.amount) == 0) {
          throw new Error("金額が入力されていません");
        }
      });

      await axios.post(
        `${BE_ENDPOINT}/accounting/record/bulk`,
        {
          accounting_basic_id: selectedCategory,
          purchase_date: FormatDate(selectedDate ?? new Date()),
          data: data,
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
      setData([]);
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
      <Header type="bulk" />
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
            width: isMobile ? "50%" : "25%",
            display: "flex",
            justifyContent: "center",
            marginTop: "15px",
            marginLeft: isMobile ? "13%" : "20%",
          }}
        >
          <Drawing
            onSelectDate={setSelectedDate}
            selectedDate={selectedDate}
            openSituation={false}
          />
        </div>

        {/* ============================
            カテゴリー
            ============================ */}
        <div style={{ marginLeft: isMobile ? "13%" : "5px" }}>
          <CategoryBox
            label={"カテゴリー"}
            value={selectedCategory}
            categorys={categories}
            onChange={setSelectedCategory}
          />
        </div>
      </div>
      <BulkInputBlock data={data} onChange={setData} />

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

export default BulkInputPage;
