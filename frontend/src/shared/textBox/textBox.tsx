import React, { useState } from "react";

type TextBoxProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  type?: "text" | "number";
  bgColor?: string;
};

function TextBox({
  label,
  value,
  onChange,
  error,
  type = "text",
  bgColor = "#e8eff5",
}: TextBoxProps) {
  const [focused, setFocused] = useState(false);

  // ============================
  // 数字を3桁カンマ表示
  // ============================
  const formatNumber = (v: string) => {
    if (v === "") return "";

    const num = Number(v);

    if (isNaN(num)) return "";

    return num.toLocaleString();
  };

  // ============================
  // 表示用の値
  //
  // numberの場合
  // フォーカス中   → 数字のみ
  // フォーカス外   → 3桁カンマ
  // ============================
  const displayValue =
    type === "number" ? (focused ? value : formatNumber(value)) : value;

  // ============================
  // ラベルを浮かせるか
  // ============================
  const isEmpty = value.trim() === "";
  const floating = focused || !isEmpty;

  // ============================
  // 色
  // ============================
  const activeColor = "#1976D2";
  const normalColor = "#9CA3AF";
  const errorColor = "#EF4444";

  const borderColor = error ? errorColor : focused ? activeColor : normalColor;

  const labelColor = error ? errorColor : focused ? activeColor : "#111827";

  return (
    <div
      className="relative w-full"
      style={{
        backgroundColor: bgColor,
        marginTop: "15px",
      }}
    >
      {/* ============================
          入力欄
         ============================ */}
      <input
        className="w-full rounded px-3 py-2 outline-none"
        value={displayValue}
        type="text"
        inputMode={type === "number" ? "numeric" : undefined}
        onChange={(e) => {
          let raw = e.target.value;

          if (type === "number") {
            /*
             * 数値入力の場合は数字だけ許可
             *
             * 例：
             * 123456 → OK
             * 123a456 → 123456
             * 1,234 → 1234
             * abc → ""
             */
            raw = raw.replace(/[^0-9]/g, "");
          }

          onChange(raw);
        }}
        onFocus={() => {
          setFocused(true);
        }}
        onBlur={() => {
          setFocused(false);
        }}
        style={{
          border: `1px solid ${borderColor}`,
          backgroundColor: bgColor,
          color: "#111827",
          transition: "border-color 0.2s ease",
        }}
      />

      {/* ============================
          ラベル
         ============================ */}
      <label
        className="absolute left-3 pointer-events-none transition-all duration-200"
        style={{
          top: floating ? "-8px" : "50%",
          transform: floating ? "translateY(0)" : "translateY(-50%)",

          backgroundColor: bgColor,

          paddingLeft: "4px",
          paddingRight: "4px",

          fontSize: floating ? "12px" : "16px",
          lineHeight: "16px",

          color: floating ? labelColor : "#9CA3AF",

          transition:
            "top 0.2s ease, transform 0.2s ease, font-size 0.2s ease, color 0.2s ease",
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

export default TextBox;
