import React, { useState } from "react";
import Icon from "../../icons/Icon.svg?react";

/*========================
  アイコンのインポート
========================*/
// 食事
import Food from "../../icons/categoryIcons/food.svg?react";
// 水
import Water from "../../icons/categoryIcons/water.svg?react";
// 化粧品
import Beauty from "../../icons/categoryIcons/beauty.svg?react";
// 日用品
import DailyNecessities from "../../icons/categoryIcons/dailyNecessities.svg?react";
// 家
import Home from "../../icons/categoryIcons/home.svg?react";
// ガス
import Flame from "../../icons/categoryIcons/flame.svg?react";
// 電気
import Electricity from "../../icons/categoryIcons/electricity.svg?react";
// 電車
import Train from "../../icons/categoryIcons/train.svg?react";
// 貯金箱
import PigBank from "../../icons/categoryIcons/pigBank.svg?react";
// 勉強
import Study from "../../icons/categoryIcons/study.svg?react";
// 病院
import Hospital from "../../icons/categoryIcons/hospital.svg?react";
// ドリンク
import Drink from "../../icons/categoryIcons/drink.svg?react";
// アルコール
import Alcohol from "../../icons/categoryIcons/alcohol.svg?react";
// カート
import Cart from "../../icons/categoryIcons/cart.svg?react";
// スマホ
import Communication from "../../icons/categoryIcons/communication.svg?react";
// 箱
import Box from "../../icons/categoryIcons/box.svg?react";
// 服
import Clothes from "../../icons/categoryIcons/clothes.svg?react";
// インフラ
import Infrastructure from "../../icons/categoryIcons/infrastructure.svg?react";

// デフォルト
import Refresh from "../../icons/categoryIcons/refresh.svg?react";

const iconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  icon: Icon,
  food: Food,
  water: Water,
  beauty: Beauty,
  dailyNecessities: DailyNecessities,
  fome: Home,
  flame: Flame,
  electricity: Electricity,
  train: Train,
  pigBank: PigBank,
  study: Study,
  hospital: Hospital,
  drink: Drink,
  alcohol: Alcohol,
  cart: Cart,
  communication: Communication,
  box: Box,
  clothes: Clothes,
  infrastructure: Infrastructure,
};

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
          const IconComponent = iconMap[item.icon] ?? Refresh;

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
