import React from "react";
import Icon from "./icons/mainIcon.svg?react";
import MenuList from "./shared/hamburgerButton/menuList";

function Top() {
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        transition: "transform 0.3s ease",
      }}
    >
      <Icon
        width={120}
        height={120}
        style={{
          marginTop: "15px",
          marginLeft: "25px",
          cursor: "pointer",
          color: "#83A5C4",
        }}
      />
      <MenuList />
    </div>
  );
}
export default Top;
