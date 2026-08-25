import React, { useState } from "react";
import { IconMap } from "../components/iconIndex";

// デフォルト
import Refresh from "../../icons/categoryIcons/refresh.svg?react";

type Category = {
  id: string;
  name: string;
  icon: string;
  collar: string;
  fixed_money: number;
  remaining_balance: number;
  sort: number;
  user_id: string;
};

type Props = {
  categories: Category[];
  onSelectCategory: (id: string) => void;
};

const isMobile = window.innerWidth < 768;

function CategoryGrid({ categories, onSelectCategory }: Props) {
  const view = isMobile ? 3 : 4;

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div
      style={{
        height: "280px",
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
          const isActive = selected === item.id;
          const IconComponent = IconMap[item.icon] ?? Refresh;

          return (
            <button
              key={item.id}
              style={{
                boxSizing: "border-box",
                padding: "1em",
                border: isActive ? "3px double #1976D2" : "3px solid #ccc",
                borderRadius: "10px",
                backgroundColor: isActive ? "#cbe5f9" : "#eeeff5",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onClick={() => {
                setSelected(item.id);
                onSelectCategory(item.id);
              }}
            >
              {IconComponent && (
                <IconComponent
                  width={40}
                  height={40}
                  style={{ color: item.collar }}
                />
              )}
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                {item.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CategoryGrid;
