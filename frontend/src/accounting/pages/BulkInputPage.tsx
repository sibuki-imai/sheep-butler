import React, { useState, useEffect } from "react";
import Drawing from "../../shared/calendar/drawing";
import Header from "../components/header";
import SendButton from "../../icons/send.svg?react";
import CategoryBox from "../components/categoryBox";
import BulkInputBlock from "../components/bulkInputBlock";
import FormatDate from "../components/formatDate";
import axios from "axios";
import Camera from "../../icons/camera.svg?react";
import CameraModal from "../components/cameraModal";
import { ResultPopup } from "../../shared/resultPopup/resultPopup";

type Data = {
  item_name: string | null;
  amount: number | null;
  memo: string | null;
};

function BulkInputPage() {
  const [popupStatus, setPopupStatus] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // SEND
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [data, setData] = useState<Data[]>([]);
  const dataSum = data.reduce(
    (total, item) => total + Number(item.amount ?? 0),
    0,
  );

  const [categories, setCategories] = useState([]);

  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/api/accounting/`, {
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

  const cameraBoot = async () => {
    try {
      setIsCameraOpen(true);
    } catch (error) {
      console.error(error);
      setPopupStatus(500);
      setPopupMessage("カメラが起動できませんでした");
    }
  };

  const takePhoto = (image: string): Promise<Blob | null> => {
    return new Promise((resolve) => {
      // image が data URL の場合
      if (image.startsWith("data:")) {
        const [header, base64] = image.split(",");
        if (!base64) {
          resolve(null);
          return;
        }
        const mimeMatch = header.match(/data:(.*?);base64/);
        const mimeType = mimeMatch?.[1] ?? "image/jpeg";
        const byteCharacters = atob(base64);
        const byteArrays = [];
        for (let i = 0; i < byteCharacters.length; i += 512) {
          const slice = byteCharacters.slice(i, i + 512);
          const byteNumbers = new Array(slice.length);
          for (let j = 0; j < slice.length; j++) {
            byteNumbers[j] = slice.charCodeAt(j);
          }
          byteArrays.push(new Uint8Array(byteNumbers));
        }
        const blob = new Blob(byteArrays, { type: mimeType });
        resolve(blob);
        return;
      }

      // 通常の画像URLの場合
      fetch(image)
        .then((response) => response.blob())
        .then((blob) => resolve(blob))
        .catch(() => resolve(null));
    });
  };

  const sendPhoto = async (image: string) => {
    try {
      const photo = await takePhoto(image);
      if (!photo) {
        setPopupStatus(400);
        setPopupMessage("写真の取得に失敗しました");
        return;
      }
      const formData = new FormData();
      formData.append("photo", photo, "photo.jpg");
      const response = await axios.post<{ name: string; amount: number }[]>(
        `/api/accounting/record/photo`,
        formData,
        {
          withCredentials: true,
        },
      );

      const photoList = response.data;

      if (photoList.length > 0) {
        const newList: Data[] = [];

        for (const item of photoList) {
          newList.push({
            item_name: item.name,
            amount: item.amount,
            memo: null,
          });
        }
        setPopupMessage("データ読み込みが完了しました。");
        setPopupStatus(200);

        setData(newList);
      }
    } catch (e) {
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
  };

  const sendPush = async () => {
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
        `/api/accounting/record/bulk`,
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
      {isCameraOpen == true && (
        <div>
          <CameraModal
            onClose={() => setIsCameraOpen(false)}
            onCapture={(image) => {
              sendPhoto(image);
            }}
          />
        </div>
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
            画像入力
            ============================ */}
        <div
          style={{
            marginTop: "10px",
            marginLeft: isMobile ? "auto" : "5%",
            marginRight: isMobile ? "5%" : undefined,
            gap: "5px",
            display: "flex",
            alignItems: "center",
            padding: "0.3em 0.3em",
            border: "solid 3px #83A5C4",
            borderRadius: "20px",
            color: "#5f7f9d",
            userSelect: "none",
          }}
          onClick={() => {
            cameraBoot();
          }}
        >
          <Camera width={35} height={35} style={{ color: "#83A5C4" }} />
          画像入力
        </div>
        {/* ============================
            カレンダー
            ============================ */}
        <div
          style={{
            width: isMobile ? "50%" : "25%",
            display: "flex",
            justifyContent: "center",
            marginTop: "15px",
            marginLeft: isMobile ? "13%" : "5%",
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
      {/* 合計値と税割り振り */}
      <div>
        <div>合計：{dataSum.toLocaleString()}円</div>
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

export default BulkInputPage;
