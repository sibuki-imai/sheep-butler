import React from "react";
import ArrowLeft from "../../icons/arrowLeft.svg?react";
import ArrowRight from "../../icons/arrowRight.svg?react";

type Props = {
  sum: number;
  selectDate: string;
  onChangeDate: (newDate: string) => void;
};

// 年月フォーマット関数
function formatYM(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}/${m}`;
}

// 月移動関数
function shiftMonth(ym: string, diff: number) {
  const [y, m] = ym.split("/").map(Number);
  const d = new Date(y, m - 1);
  d.setMonth(d.getMonth() + diff);
  return formatYM(d);
}

function ReportHeader({ sum, selectDate, onChangeDate }: Props) {
  const handlePrevMonth = (move: number) => {
    const newDate = shiftMonth(selectDate, move);
    onChangeDate(newDate);
  };

  return (
    <div>
      <div
        className="flex gap-4 items-center"
        style={{ width: "95%", marginLeft: "2.5%" }}
      >
        <div
          className="flex gap-4 items-center"
          style={{ width: "45%", marginLeft: "2.5%" }}
        >
          <ArrowLeft
            width={40}
            height={40}
            onClick={() => handlePrevMonth(-1)}
          />
          <div>{selectDate}</div>
          <ArrowRight
            width={40}
            height={40}
            onClick={() => handlePrevMonth(1)}
          />
        </div>

        <div>合計金額：{Number(sum).toLocaleString()}円</div>
      </div>

      <div
        style={{
          borderBottom: "2px solid #181818",
          width: "95%",
          marginLeft: "2.5%",
        }}
      />
    </div>
  );
}

export default ReportHeader;
