import React, { useState } from "react";
import { IconMap } from "./iconIndex";
import BackLogo from "../../icons/backLogo.svg?react";
import ArrowRight from "../../icons/arrowRight.svg?react";
import RecordModal from "./recordModal";

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

type Props = {
  categorieInfo: Category | null;
  recordDate: Record[];
  onBack: () => void;
  onSaveRecord: (updated: Record) => void;
  onDeleteRecord: (id: string) => void;
};

const isMobile = window.innerWidth < 768;

function OneReportCategory({
  categorieInfo,
  recordDate,
  onBack,
  onSaveRecord,
  onDeleteRecord,
}: Props) {
  const view = isMobile ? 1 : 2;
  const height = isMobile ? "350px" : "280px";
  const iconName = categorieInfo ? categorieInfo.icon : "refresh";
  const IconComponent = IconMap[iconName];
  const categorieId = categorieInfo ? categorieInfo.id : "00000";
  const collar = categorieInfo ? categorieInfo.collar : "#000";
  const categoryName = categorieInfo ? categorieInfo.name : "---";
  const remaining = categorieInfo
    ? Number(categorieInfo.remaining_balance).toLocaleString()
    : "---";
  const [selected, setSelected] = useState<Record | null>(null);
  const categoryInfo = { categorieId, iconName, categoryName, collar };
  const sliceSize = isMobile ? 7 : 20;

  return (
    <div>
      {/* 戻るボタン */}
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
        onClick={onBack}
      >
        <BackLogo width={30} height={30} style={{ marginRight: "15px" }} />
        一覧に戻る
      </button>

      {/* カテゴリ情報表示 */}

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "8px",
          width: "95%",
          marginLeft: "5%",
        }}
      >
        {/* アイコン部分 */}
        <div
          style={{
            marginLeft: "2.5%",
            width: "45%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <IconComponent width={40} height={40} style={{ color: collar }} />
          <div style={{ fontSize: "14px", marginLeft: "3%" }}>
            {categoryName}
          </div>
        </div>

        {/* 予算部分 */}
        <div
          style={{
            width: "55%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "right", marginRight: "3%" }}> 残 高 :</div>
          <div>{remaining}円</div>
        </div>
      </div>

      {/* 詳細レコード */}
      <div
        style={{
          height: height,
          // overflowY: "auto",
          padding: "10px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${view}, 1fr)`,
            gap: "12px",
          }}
        >
          {recordDate
            ? recordDate.map((record) => {
                return (
                  <button
                    key={record.id}
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
                    }}
                    onClick={() => {
                      setSelected(record);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        // alignItems: "center",
                        // flexDirection: "column",
                        // alignItems: "flex-start",
                        gap: "8px",
                        width: "100%",
                      }}
                    >
                      <div style={{ width: "15%" }}>
                        {record.purchase_date.slice(5, 10).replace("-", "/")}
                      </div>

                      <div
                        style={{
                          marginLeft: "3%",
                          width: "25%",
                          textAlign: "right",
                        }}
                      >
                        {Number(record.amount).toLocaleString()} 円
                      </div>

                      <div style={{ marginLeft: "3%" }}>
                        {record.item_name.length > sliceSize
                          ? record.item_name.slice(0, sliceSize) + "..."
                          : record.item_name}
                      </div>

                      {/* 右寄せ枠 */}
                      <div
                        style={{
                          marginLeft: "auto",
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
                        <ArrowRight width={30} height={25} />
                      </div>
                    </div>
                  </button>
                );
              })
            : []}
        </div>
        {selected && (
          <RecordModal
            categoryInfo={categoryInfo}
            record={selected}
            onClose={() => setSelected(null)}
            onSave={(updated) => {
              updated.id = selected.id;
              onSaveRecord(updated);
              setSelected(null);
            }}
            onDelete={(id) => {
              onDeleteRecord(id);
              setSelected(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default OneReportCategory;
