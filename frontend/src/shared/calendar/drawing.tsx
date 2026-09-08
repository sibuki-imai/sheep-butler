import React, { useState } from "react";
import DayBox from "./dayBox";

const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

/* ============================
   日付表示コンポーネント
   ============================ */
function DayDisplay({
  day,
  onClick,
  style,
}: {
  day: Date;
  onChange: (d: Date) => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const dateLabel =
    `${day.getFullYear()}/` +
    `${String(day.getMonth() + 1).padStart(2, "0")}/` +
    `${String(day.getDate()).padStart(2, "0")}（${dayOfWeek[day.getDay()]}）`;
  return (
    <div
      style={{
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        ...style,
      }}
    >
      <button onClick={onClick}>
        <DayBox dayString={dateLabel} />
      </button>
    </div>
  );
}

/* ============================
   年月ダイアルポップアップ
   ============================ */
function DayDisplayPopUp({
  day,
  onChange,
  onClose,
}: {
  day: Date;
  onChange: (d: Date) => void;
  onClose: () => void;
}) {
  const MIN_YEAR = 2000;
  const MAX_YEAR = 2100;
  const yy = day.getFullYear();
  const mm = day.getMonth() + 1;

  /* ============================ 年を変更 ============================ */
  const changeYear = (move: number) => {
    const newYear = Math.min(MAX_YEAR, Math.max(MIN_YEAR, yy + move));
    const newDate = new Date(day);
    newDate.setFullYear(newYear);
    onChange(newDate);
  };

  /* ============================ 月を変更 ============================ */
  const changeMonth = (move: number) => {
    let newMonth = mm + move;

    // 12月 → 1月
    if (newMonth > 12) {
      newMonth = 1;
    }

    //  1月 → 12月
    if (newMonth < 1) {
      newMonth = 12;
    }

    const newDate = new Date(day.getFullYear(), newMonth - 1, 1);
    onChange(newDate);
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      {/* ============================ モーダル本体 ============================ */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "12px",
          width: "280px",
          textAlign: "center",
        }}
      >
        {" "}
        {/* ============================ 年月ダイアル ============================ */}{" "}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
          }}
        >
          {" "}
          {/* ============================ 年 ============================ */}{" "}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {" "}
            {/* 前の年 */}{" "}
            <button
              onClick={() => changeYear(-1)}
              disabled={yy <= MIN_YEAR}
              style={{
                fontSize: "20px",
                width: "40px",
                height: "32px",
                cursor: yy <= MIN_YEAR ? "default" : "pointer",
                opacity: yy <= MIN_YEAR ? 0.3 : 1,
              }}
            >
              {" "}
              ▲{" "}
            </button>{" "}
            {/* 現在の年 */}{" "}
            <div
              style={{ fontSize: "24px", fontWeight: "bold", minWidth: "90px" }}
            >
              {" "}
              {yy}年{" "}
            </div>{" "}
            {/* 次の年 */}{" "}
            <button
              onClick={() => changeYear(1)}
              disabled={yy >= MAX_YEAR}
              style={{
                fontSize: "20px",
                width: "40px",
                height: "32px",
                cursor: yy >= MAX_YEAR ? "default" : "pointer",
                opacity: yy >= MAX_YEAR ? 0.3 : 1,
              }}
            >
              {" "}
              ▼{" "}
            </button>{" "}
          </div>{" "}
          {/* ============================ 月 ============================ */}{" "}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {" "}
            {/* 前の月 */}{" "}
            <button
              onClick={() => changeMonth(-1)}
              style={{ fontSize: "20px", width: "40px", height: "32px" }}
            >
              {" "}
              ▲{" "}
            </button>{" "}
            {/* 現在の月 */}{" "}
            <div
              style={{ fontSize: "24px", fontWeight: "bold", minWidth: "60px" }}
            >
              {" "}
              {String(mm).padStart(2, "0")}月{" "}
            </div>{" "}
            {/* 次の月 */}{" "}
            <button
              onClick={() => changeMonth(1)}
              style={{ fontSize: "20px", width: "40px", height: "32px" }}
            >
              {" "}
              ▼{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {/* ============================ 閉じるボタン ============================ */}
        <button
          onClick={onClose}
          style={{ marginTop: "24px", padding: "8px 24px" }}
        >
          {" "}
          閉じる{" "}
        </button>{" "}
      </div>{" "}
    </div>
  );
}

/* ============================
   カレンダー本体
   ============================ */
function Calendar({
  day,
  onChange,
  onSelectDay,
  onOpenPopUp,
}: {
  day: Date;
  onChange: (d: Date) => void;
  onSelectDay?: () => void;
  onOpenPopUp: () => void;
}) {
  const anchorDay = day;

  const y = anchorDay.getFullYear();
  const m = anchorDay.getMonth() + 1;
  const mm = String(m).padStart(2, "0");

  const firstDay = new Date(y, anchorDay.getMonth(), 1);
  const dow = firstDay.getDay();

  // eslint-disable-next-line no-useless-assignment
  let maxDay = 0;

  if ([1, 3, 5, 7, 8, 10, 12].includes(m)) {
    maxDay = 31;
  } else if ([4, 6, 9, 11].includes(m)) {
    maxDay = 30;
  } else {
    maxDay = 28;

    if (y % 4 === 0) {
      maxDay = 29;

      if (y % 100 === 0 && y % 400 !== 0) {
        maxDay = 28;
      }
    }
  }

  const calendarArr: number[][] = [];
  let cday = 1;

  for (let cweek = 0; cweek < 6; cweek++) {
    const weeks: number[] = [];

    for (let cdow = 0; cdow < 7; cdow++) {
      if (cweek === 0) {
        weeks.push(cdow < dow ? 0 : cday++);
      } else {
        weeks.push(cday <= maxDay ? cday++ : 0);
      }
    }

    calendarArr.push(weeks);
  }

  const MonthMove = (move: boolean) => {
    const newMonth = anchorDay.getMonth() + (move ? 1 : -1);
    const newDate = new Date(anchorDay.getFullYear(), newMonth, 1);

    onChange(newDate);
  };

  const calendarWidth = 7 * 20 + 6 * 8;

  return (
    <div
      style={{
        userSelect: "none",
        width: `${calendarWidth}px`,
        height: "200px",
      }}
    >
      {/* 月移動 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          marginBottom: "12px",
        }}
      >
        {/* 年月（ポップアップを開く） */}
        <div>
          <button onClick={onOpenPopUp}>
            {y}/{mm}
          </button>
        </div>

        {/* 月移動ボタン */}
        <div
          style={{
            display: "flex",
            marginLeft: "auto",
            gap: "8px",
          }}
        >
          <button onClick={() => MonthMove(false)}>＜</button>
          <button onClick={() => MonthMove(true)}>＞</button>
        </div>
      </div>

      {/* 曜日行 */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "8px",
        }}
      >
        {dayOfWeek.map((w) => (
          <div
            key={w}
            style={{
              width: "20px",
              textAlign: "center",
              color: "#555",
            }}
          >
            {w}
          </div>
        ))}
      </div>

      {/* カレンダー本体 */}
      <div>
        {calendarArr.map((week, wi) => (
          <div
            key={wi}
            style={{
              display: "flex",
              gap: "8px",
            }}
          >
            {week.map((d, di) => {
              const isAnchor =
                d === anchorDay.getDate() &&
                m === anchorDay.getMonth() + 1 &&
                y === anchorDay.getFullYear();

              return (
                <button
                  key={di}
                  style={{
                    width: "20px",
                    height: "20px",
                    padding: 0,
                    textAlign: "center",
                    color: isAnchor ? "#ffffff" : "#181818",
                    borderRadius: "50%",
                    backgroundColor: isAnchor ? "#1976D2" : "transparent",
                    lineHeight: "20px",
                  }}
                  onClick={() => {
                    if (d !== 0) {
                      onChange(
                        new Date(
                          anchorDay.getFullYear(),
                          anchorDay.getMonth(),
                          d,
                        ),
                      );

                      if (onSelectDay) {
                        onSelectDay();
                      }
                    }
                  }}
                >
                  {d === 0 ? "" : d}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================
   親コンポーネント（編集用）
   ============================ */
function Drawing({
  onSelectDate,
  selectedDate,
  openSituation,
}: {
  onSelectDate: (d: Date) => void;
  selectedDate: Date;
  openSituation: boolean;
}) {
  const [anchorDay, setAnchorDay] = useState(selectedDate);
  const [open, setOpen] = useState(openSituation);
  const [openPopUp, setOpenPopUp] = useState(false);

  const handleChangeDay = (newDate: Date) => {
    setAnchorDay(newDate);
    onSelectDate(newDate);
  };

  return (
    <div
      style={{
        userSelect: "none",
        width: "100%",
        display: "flex",
        flexDirection: "column",

        // alignItems: "center",
      }}
    >
      <DayDisplay
        day={anchorDay}
        onChange={handleChangeDay}
        onClick={() => setOpen(!open)}
      />

      {open && (
        <Calendar
          day={anchorDay}
          onChange={handleChangeDay}
          onSelectDay={() => setOpen(false)}
          onOpenPopUp={() => setOpenPopUp(true)}
        />
      )}

      {/* 年月ポップアップ */}
      {openPopUp && (
        <DayDisplayPopUp
          day={anchorDay}
          onChange={handleChangeDay}
          onClose={() => setOpenPopUp(false)}
        />
      )}
    </div>
  );
}

export default Drawing;
