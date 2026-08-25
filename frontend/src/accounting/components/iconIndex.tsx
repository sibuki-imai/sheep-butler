/*========================
  アイコンのインポート
========================*/
// アイコン
import Icon from "../../icons/Icon.svg?react";
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

export const IconMap: Record<
  string,
  React.FC<React.SVGProps<SVGSVGElement>>
> = {
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
  refresh: Refresh,
};
