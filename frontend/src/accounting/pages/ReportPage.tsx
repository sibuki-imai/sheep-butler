import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from "../components/header";
import axios from "axios";
import { ResultPopup } from "../../shared/resultPopup/resultPopup";
import ReportHeader from "../components/reportHeader";
import ReportCategory from "../components/reportCategory";

type Category = {
  id: string;
  name: string;
  icon: string;
  collar: string;
  remaining_balance: number;
  sum_amount: number;
  fixed_money: number;
};

// 年月フォーマット関数
// 例：2026/09
function formatYM(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");

  return `${y}/${m}`;
}

// 画面表示用 → URL用
// 2026/09 → 2026-09
function ymToURL(ym: string) {
  return ym.replace("/", "-");
}

// URL用 → 画面表示用
// 2026-09 → 2026/09
function urlToYM(date: string) {
  return date.replace("-", "/");
}

// 年月 → API用の日付
// 2026/09 → 2026-09-01
function ymToISO(ym: string) {
  const [y, m] = ym.split("/").map(Number);

  return `${y}-${String(m).padStart(2, "0")}-01`;
}

function ReportPage() {
  const BE_ENDPOINT = import.meta.env.VITE_BEAPI;
  const navigate = useNavigate();

  // URLのクエリパラメータ
  const [searchParams, setSearchParams] = useSearchParams();

  const [popupStatus, setPopupStatus] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalSumAmount, setTotalSumAmount] = useState(0);

  const urlDate = searchParams.get("date");

  const selectDate = urlDate ? urlToYM(urlDate) : formatYM(new Date());

  useEffect(() => {
    if (!searchParams.get("date")) {
      const currentDate = formatYM(new Date());

      setSearchParams({
        date: ymToURL(currentDate),
      });
    }
  }, [searchParams, setSearchParams]);

  /*
   * カテゴリ情報取得
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const date = ymToISO(selectDate);

        const res = await axios.get(
          `${BE_ENDPOINT}/accounting/record?date=${date}`,
          {
            withCredentials: true,
          },
        );

        setCategories(res.data);

        setTotalSumAmount(
          res.data.reduce(
            (sum: number, item: Category) => sum + item.sum_amount,
            0,
          ),
        );
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
  }, [selectDate, BE_ENDPOINT]);

  /*
   * カテゴリ選択
   */
  const handleSelectCategory = (id: string) => {
    navigate(`/accounting/report/category/${id}`);
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

      <Header type="report" />

      <div>
        <ReportHeader
          sum={totalSumAmount}
          selectDate={selectDate}
          onChangeDate={(date) => {
            setSearchParams({
              date: ymToURL(date),
            });
          }}
        />

        <ReportCategory
          categories={categories}
          onSelectCategory={handleSelectCategory}
        />
      </div>
    </div>
  );
}

export default ReportPage;
