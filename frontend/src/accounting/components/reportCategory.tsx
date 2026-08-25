import React, { useState } from "react";
import { IconMap } from "./iconIndex";

// デフォルト
import Refresh from "../../icons/categoryIcons/refresh.svg?react";

type Category = {
  id: string;
  name: string;
  icon: string;
  collar: string;
  remaining_balance: number;
  sum_amount: number;
};

type Props = {
  categories: Category[];
  onSelectCategory: (id: string) => void;
};

const isMobile = window.innerWidth < 768;

function ReportCategory({ categories, onSelectCategory }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const view = isMobile ? 1 : 3;
  const height = isMobile ? "350px" : "280px";

  return (
    <div>
      <div
        style={{
          height: height,
          overflowY: "auto",
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
          {categories.map((item) => {
            const IconComponent = IconMap[item.icon] ?? Refresh;

            return (
              <button
                key={item.id}
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
                  setSelected(item.id);
                  onSelectCategory(item.id);
                }}
              >
                {/* 左側：アイコン＋名前 */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                  }}
                >
                  <IconComponent
                    width={40}
                    height={40}
                    style={{ color: item.collar }}
                  />
                  <div style={{ marginTop: "8px", fontSize: "14px" }}>
                    {item.name}
                  </div>
                </div>

                {/* 右側：金額 */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "100px auto",
                    columnGap: "6px",
                    fontSize: "13px",
                    rowGap: "4px",
                  }}
                >
                  <div style={{ textAlign: "right" }}> 残 高 :</div>
                  <div>{Number(item.remaining_balance).toLocaleString()}円</div>

                  <div style={{ textAlign: "right" }}>使用金額:</div>
                  <div>{Number(item.sum_amount).toLocaleString()}円</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ReportCategory;
