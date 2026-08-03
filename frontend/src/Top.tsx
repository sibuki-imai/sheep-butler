import React from "react";
import Hamburger from "./icons/hamburger.svg?react";

function Top() {
  return (
    <div className="flex gap-4 items-center">
      <Hamburger width={48} height={48} className="text-black" />
      <Hamburger width={48} height={48} className="text-red-500" />
      <Hamburger width={48} height={48} style={{ color: "#83A5C4" }} />
    </div>
  );
}
export default Top;
