import React, { useState } from "react";
import { IconMap } from "./iconIndex";

type CategoryBoxProps = {
  label: string;
  value: string | null;
  categorys: Category[];
  onChange: (v: string) => void;
  error?: string;
  bgColor?: string;
};

type Category = {
  id: string;
  name: string;
  icon: string;
  collar: string;
  remaining_balance: number;
  fixed_money: number;
};

function CategoryBox({
  label,
  categorys,
  onChange,
  error,
  bgColor = "#e8eff5",
}: CategoryBoxProps) {
  const [open, setOpen] = useState(false);
  const [categorie, setCategorie] = useState<Category | null>(null);
  const [category, setCategory] = useState<string>("refresh");

  const IconComponent = IconMap[category] ?? IconMap["refresh"];

  const isMobile = window.innerWidth < 768;
  const view = isMobile ? 1 : 3; // PCは6列で見やすく

  // ============================
  // 色
  // ============================
  const activeColor = "#1976D2";
  const errorColor = "#EF4444";

  const borderColor = error ? errorColor : activeColor;

  // ============================
  // カテゴリ選択
  // ============================
  const handleSelect = (item: Category) => {
    setCategorie(item);
    setCategory(item.icon);
    setOpen(false);
    onChange(item.id);
  };

  return (
    <div
      className="relative w-full"
      style={{
        backgroundColor: bgColor,
        marginTop: "15px",
        marginLeft: "5px",
        display: "flex",
      }}
    >
      {/* ============================
          外枠
         ============================ */}
      <div
        className="w-full rounded px-3 py-2 outline-none"
        onClick={() => {
          setOpen(!open);
        }}
        style={{
          border: `solid 3px ${borderColor}`,
          borderRadius: "10px",
          background: "#e8eff5",
          transition: "border-color 0.2s ease",
          height: "100px",
          width: "150px",
          position: "relative",
          padding: "0.5em 1em",
          color: "#1976D2",
        }}
      >
        {/* ============================
            中身
          ============================ */}

        <div style={{ cursor: "pointer" }}>
          {categorie ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <IconComponent
                width={40}
                height={40}
                style={{
                  color: categorie?.collar ?? "#000",
                }}
              />
              <div>{categorie?.name}</div>
            </div>
          ) : (
            <div>---</div>
          )}
        </div>
      </div>
      <div>
        {open ? (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${view}, 1fr)`,
                width: isMobile ? "155px" : "480px",
                height: "170px",
                gap: "5px",
                justifyContent: "center",
                alignItems: "start",
                overflowY: "auto",
                backgroundColor: "#eeeff5",
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              {categorys.map((item) => {
                const Icon = IconMap[item.icon] ?? IconMap["refresh"];
                return (
                  <div
                    key={item.id}
                    style={{
                      padding: "0.8em",
                      background: "#eeeff5",
                      border: "2px solid #494848",
                      borderRadius: "10px",
                      width: "150px",
                      cursor: "pointer",

                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                    onClick={(e) => {
                      e.stopPropagation(); // ← 外枠のクリックを止める
                      handleSelect(item);
                    }}
                  >
                    <Icon
                      width={40}
                      height={40}
                      style={{ color: item.collar }}
                    />
                    <div>{item.name}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* ============================
          ラベル（固定位置 & 枠線と同じ色）
         ============================ */}
      <label
        className="absolute left-3 pointer-events-none transition-all duration-200"
        style={{
          top: "-8px",
          transform: "translateY(0)",
          backgroundColor: bgColor,
          paddingLeft: "4px",
          paddingRight: "4px",
          fontSize: "12px",
          lineHeight: "16px",
          color: borderColor,
          fontWeight: "bold",
        }}
      >
        {label}
      </label>

      {/* ============================
          エラー表示
         ============================ */}
      {error && (
        <span
          className="text-xs"
          style={{
            color: errorColor,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default CategoryBox;
