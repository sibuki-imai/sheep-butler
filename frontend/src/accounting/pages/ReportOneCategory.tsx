import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import Header from "../components/header";
import axios from "axios";
import { ResultPopup } from "../../shared/resultPopup/resultPopup";
import ReportHeader from "../components/reportHeader";
import OneReportCategory from "../components/oneReportCategory";

type Category = {
  id: string;
  name: string;
  icon: string;
  collar: string;
  remaining_balance: number;
  sum_amount: number;
  fixed_money: number;
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

// 年月 → API用
// 2026/09 → 2026-09-01
function ymToISO(ym: string) {
  const [y, m] = ym.split("/").map(Number);

  return `${y}-${String(m).padStart(2, "0")}-01`;
}

function ReportOneCategory() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categoryId } = useParams();

  const urlDate = searchParams.get("date");
  const selectDate = urlDate ? urlToYM(urlDate) : formatYM(new Date());

  const [popupStatus, setPopupStatus] = useState<number | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);

  const [category, setCategorie] = useState<Category | null>(null);
  const [record, setRecord] = useState<Record[]>([]);
  const [detailSumAmount, setDetailSumAmount] = useState(0);

  const BE_ENDPOINT = import.meta.env.VITE_BEAPI;

  const fetchCategory = async () => {
    if (!categoryId) return;

    try {
      const date = ymToISO(selectDate);

      const [resCategorie, resRecord] = await Promise.all([
        axios.get(`${BE_ENDPOINT}/accounting?id=${categoryId}&date=${date}`, {
          withCredentials: true,
        }),
        axios.get(
          `${BE_ENDPOINT}/accounting/record?date=${date}&category=${categoryId}&detail=true`,
          {
            withCredentials: true,
          },
        ),
      ]);
      return {
        category: resCategorie.data[0] ?? null,
        records: resRecord.data,
      };
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

  useEffect(() => {
    if (!searchParams.get("date")) {
      const currentDate = formatYM(new Date());

      setSearchParams({
        date: ymToURL(currentDate),
      });
    }
  }, [searchParams, setSearchParams]);

  /*
   * カテゴリ情報・レコード情報取得
   *
   * categoryId または selectDate が変わったら再取得
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCategory();

        if (!data) return;

        // カテゴリ情報
        setCategorie(data.category);

        // レコード情報
        setRecord(data.records);

        // 合計金額
        setDetailSumAmount(
          data.records.reduce(
            (sum: number, item: Record) => sum + item.amount,
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

    loadData();
  }, [categoryId, selectDate]);

  /*
   * レコード保存
   */
  const handleSaveRecord = async (updated: Record) => {
    try {
      await axios.patch(`${BE_ENDPOINT}/accounting/record`, updated, {
        withCredentials: true,
      });

      // 保存後も最新データを取得
      const data = await fetchCategory();

      if (data) {
        setCategorie(data.category);
        setRecord(data.records);

        setDetailSumAmount(
          data.records.reduce(
            (sum: number, item: Record) => sum + item.amount,
            0,
          ),
        );
      }

      setPopupStatus(200);
      setPopupMessage("登録が完了しました");
    } catch (e) {
      console.error(e);

      setPopupStatus(500);
      setPopupMessage("エラーが発生しました");
    }
  };

  /*
   * レコード削除
   */
  const handleDeleteRecord = async (id: string) => {
    try {
      await axios.delete(`${BE_ENDPOINT}/accounting/record/${id}`, {
        withCredentials: true,
      });
      const data = await fetchCategory();

      if (data) {
        setCategorie(data.category);
        setRecord(data.records);

        setDetailSumAmount(
          data.records.reduce(
            (sum: number, item: Record) => sum + item.amount,
            0,
          ),
        );
      }

      setPopupStatus(200);
      setPopupMessage("登録が完了しました");
    } catch (e) {
      console.error(e);

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

      <Header type="report" />

      <div>
        <ReportHeader
          sum={detailSumAmount}
          selectDate={selectDate}
          onChangeDate={(date) => {
            setSearchParams({
              date: ymToURL(date),
            });
          }}
        />

        <OneReportCategory
          categorieInfo={category}
          recordDate={record}
          onSaveRecord={handleSaveRecord}
          onDeleteRecord={handleDeleteRecord}
          onBack={() => {
            navigate(`/accounting/report?date=${ymToURL(selectDate)}`);
          }}
        />
      </div>
    </div>
  );
}

export default ReportOneCategory;
