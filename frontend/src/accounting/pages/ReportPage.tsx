import React, { useState, useEffect } from "react";
import Header from "../components/header";
import axios from "axios";
import { ResultPopup } from "../../shared/resultPopup/resultPopup";
import ReportHeader from "../components/reportHeader";
import ReportCategory from "../components/reportCategory";
import OneReportCategory from "../components/oneReportCategory";

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

// 年月フォーマット関数
function formatYM(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}/${m}`;
}

function InputPage() {
  const [popupStatus, setPopupStatus] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [record, setRecord] = useState<Record[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectDate, setSelectDate] = useState(formatYM(new Date()));
  const [sumAmount, setSumAmount] = useState(0);
  const BE_ENDPOINT = import.meta.env.VITE_BEAPI;
  const [view, setView] = useState(true);
  function ymToISO(ym: string) {
    const [y, m] = ym.split("/").map(Number);
    return `${y}-${String(m).padStart(2, "0")}-01`;
  }

  const fetchCategories = React.useCallback(async () => {
    try {
      const date = ymToISO(selectDate);
      const res = await axios.get(
        `${BE_ENDPOINT}/accounting/record?date=${date}`,
        { withCredentials: true },
      );

      setCategories(res.data);

      setSumAmount(
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
  }, [selectDate, BE_ENDPOINT]);

  const oneCategory = async (id: string) => {
    try {
      const date = ymToISO(selectDate);
      const res = await axios.get(
        `${BE_ENDPOINT}/accounting/record?date=${date}&category=${id}&detail=true`,
        { withCredentials: true },
      );

      setRecord(res.data);
      setSumAmount(
        res.data.reduce((sum: number, item: Record) => sum + item.amount, 0),
      );
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

  const handleSelectCategory = (id: string) => {
    setSelectedCategory(id);
    oneCategory(id);
    setView(false); //画面切り替え
  };

  useEffect(() => {
    const run = async () => {
      await fetchCategories();
    };
    run();
  }, [fetchCategories]);

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
      <ReportHeader
        sum={sumAmount}
        selectDate={selectDate}
        onChangeDate={setSelectDate}
      />
      {view ? (
        <ReportCategory
          categories={categories}
          onSelectCategory={handleSelectCategory}
        />
      ) : (
        <OneReportCategory
          categorieInfo={
            categories.find((cat) => cat.id === selectedCategory) ?? null
          }
          recordDate={record}
          onSelectCategory={setSelectedCategory}
          onBack={() => {
            setView(true);
            fetchCategories();
          }}
        />
      )}
    </div>
  );
}

export default InputPage;
