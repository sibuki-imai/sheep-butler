import React, { useState } from "react";
import Hamburger from "../../icons/hamburger.svg?react";
import Culose from "../../icons/close.svg?react";
import Login from "../../icons/login.svg?react";
import MenusList from "./menuList";
import { useNavigate } from "react-router-dom";

function HamburgerButton() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const navigate = useNavigate();

  return (
    <>
      {/* ハンバーガーアイコン */}
      <div
        style={{ marginTop: "10px", marginLeft: "20px", cursor: "pointer" }}
        onClick={toggleMenu}
      >
        <Hamburger width={85} height={85} style={{ color: "#83A5C4" }} />
      </div>

      {/* 画面全体メニュー */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background: "#efffff",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
          zIndex: 1000,
        }}
      >
        <div style={{ display: "flex" }}>
          {/* 閉じるボタン */}
          <button
            onClick={closeMenu}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              fontSize: "18px",
            }}
          >
            <Culose width={85} height={85} style={{ color: "#83A5C4" }} />
          </button>
          <div
            style={{
              marginLeft: "auto",
              marginTop: "60px",
              padding: "10px 50px",
              fontSize: "18px",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: "10px",
            }}
            onClick={() => navigate("/login")}
          >
            <Login width={40} height={40} style={{ color: "#698095" }} />
            Login
          </div>
        </div>
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
