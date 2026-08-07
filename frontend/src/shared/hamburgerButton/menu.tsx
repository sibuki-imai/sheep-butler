import React, { useState } from "react";
import Hamburger from "../../icons/hamburger.svg?react";
import Culose from "../../icons/close.svg?react";
import MenusList from "./menuList";

function HamburgerButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* ハンバーガーアイコン */}
      <div
        style={{ marginTop: "15px", marginLeft: "20px", cursor: "pointer" }}
        onClick={toggleMenu}
      >
        <Hamburger width={120} height={120} style={{ color: "#83A5C4" }} />
      </div>

      {/* 画面全体メニュー */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#E8EFF5",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          zIndex: 1000,
        }}
      >
        {/* 閉じるボタン */}
        <button
          onClick={closeMenu}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            fontSize: "18px",
          }}
        >
          <Culose width={120} height={120} style={{ color: "#83A5C4" }} />
        </button>

        <MenusList />
      </div>

      {/* 背景オーバーレイ（クリックで閉じる） */}
      {isOpen && (
        <div
          onClick={closeMenu}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            zIndex: 999,
          }}
        />
      )}
    </>
  );
}

export default HamburgerButton;
