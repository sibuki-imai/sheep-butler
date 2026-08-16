import React from "react";

type Props = {
  dayString: string;
};

function DayBox({ dayString }: Props) {
  return (
    <div
      style={{
        position: "relative",
        padding: "0.5em 1em",
        fontWeight: "bold",
        color: "#1976D2",
        background: "#e8eff5",
        border: "solid 3px #1976D2",
        borderRadius: "10px",
      }}
    >
      <label
        style={{
          position: "absolute",
          top: "-10px",
          left: "12px",
          backgroundColor: "#e8eff5",
          paddingLeft: "4px",
          paddingRight: "4px",
          fontSize: "12px",
          lineHeight: "16px",
          color: "#1976D2",
        }}
      >
        日付
      </label>

      {dayString}
    </div>
  );
}

export default DayBox;
