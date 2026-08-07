import React from "react";
import MainIcon from "./icons/mainIcon.svg?react";
import Hamburger from "./icons/hamburger.svg?react";
import Home from "./icons/home.svg?react";
import Flame from "./icons/flame.svg?react";
import Saving from "./icons/saving.svg?react";
import PoletMoney from "./icons/pocketMoney.svg?react";
import Hospital from "./icons/hospital.svg?react";
import Water from "./icons/water.svg?react";
import Study from "./icons/study.svg?react";
import Beauty from "./icons/beauty.svg?react";
import Communication from "./icons/communication.svg?react";
import DailyNecessities from "./icons/dailyNecessities.svg?react";
import Electricity from "./icons/electricity.svg?react";
import TransportationExpenses from "./icons/transportationExpenses.svg?react";
import HamburgerButton from "./shared/hamburgerButton/menu";
function Test() {
  return (
    <div style={{ padding: 40 }}>
      <HamburgerButton />
      <h1>テストページ</h1>
      <div className="bg-red-500 p-8 rounded-xl">TEST</div>
      <div className="flex gap-4 items-center">
        <MainIcon width={48} height={48} className="text-black" />
        <MainIcon width={48} height={48} className="text-red-500" />
        <MainIcon width={48} height={48} style={{ color: "#83A5C4" }} />
      </div>
      <div className="flex gap-4 items-center">
        <Hamburger width={48} height={48} className="text-black" />
        <Hamburger width={48} height={48} className="text-red-500" />
        <Hamburger width={48} height={48} style={{ color: "#83A5C4" }} />
      </div>

      <div className="flex gap-4 items-center">
        <Home width={48} height={48} className="text-black" />
        <Home width={48} height={48} className="text-red-500" />
        <Home width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <Flame width={48} height={48} className="text-black" />
        <Flame width={48} height={48} className="text-red-500" />
        <Flame width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <Saving width={48} height={48} className="text-black" />
        <Saving width={48} height={48} className="text-red-500" />
        <Saving width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <PoletMoney width={48} height={48} className="text-black" />
        <PoletMoney width={48} height={48} className="text-red-500" />
        <PoletMoney width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <Hospital width={48} height={48} className="text-black" />
        <Hospital width={48} height={48} className="text-red-500" />
        <Hospital width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <Water width={48} height={48} className="text-black" />
        <Water width={48} height={48} className="text-red-500" />
        <Water width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <Study width={48} height={48} className="text-black" />
        <Study width={48} height={48} className="text-red-500" />
        <Study width={48} height={48} style={{ color: "hotpink" }} />
      </div>

      <div className="flex gap-4 items-center">
        <Beauty width={48} height={48} className="text-black" />
        <Beauty width={48} height={48} className="text-red-500" />
        <Beauty width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <Communication width={48} height={48} className="text-black" />
        <Communication width={48} height={48} className="text-red-500" />
        <Communication width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <DailyNecessities width={48} height={48} className="text-black" />
        <DailyNecessities width={48} height={48} className="text-red-500" />
        <DailyNecessities width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <Electricity width={48} height={48} className="text-black" />
        <Electricity width={48} height={48} className="text-red-500" />
        <Electricity width={48} height={48} style={{ color: "hotpink" }} />
      </div>
      <div className="flex gap-4 items-center">
        <TransportationExpenses width={48} height={48} className="text-black" />
        <TransportationExpenses
          width={48}
          height={48}
          className="text-red-500"
        />
        <TransportationExpenses
          width={48}
          height={48}
          style={{ color: "hotpink" }}
        />
      </div>
    </div>
  );
}

export default Test;
