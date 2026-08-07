import React, { useState } from "react";

const dayOfWeek = ["日", "月", "火", "水", "木", "金", "土"];

/* ============================
   日付表示コンポーネント
   ============================ */
function DayDisplay({
  day,
  onChange,
  onClick,
  style,
}: {
  day: Date;
  onChange: (d: Date) => void;
  onClick?: () => void;
  style?: React.CSSProperties;
}) {
  const DayMove = (move: boolean) => {
    const newDate = new Date(day);
    newDate.setDate(day.getDate() + (move ? 1 : -1));
    onChange(newDate);
  };

  return (
    <div style={{ userSelect: "none", ...style }}>
      <button onClick={() => DayMove(false)}>＜</button>

      <button onClick={onClick}>
        {day.getFullYear()}/{String(day.getMonth() + 1).padStart(2, "0")}/
        {String(day.getDate()).padStart(2, "0")}（{dayOfWeek[day.getDay()]}）
      </button>

      <button onClick={() => DayMove(true)}>＞</button>
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
  isMobile,
}: {
  day: Date;
  onChange: (d: Date) => void;
  onSelectDay?: () => void;
  isMobile: boolean;
}) {
  const anchorDay = day;

  const y = anchorDay.getFullYear();
  const m = anchorDay.getMonth() + 1;
  const mm = String(m).padStart(2, "0");

  const firstDay = new Date(y, anchorDay.getMonth(), 1);
  const dow = firstDay.getDay();

  // 月の日数
  // eslint-disable-next-line no-useless-assignment
  let maxDay = 0;
  if ([1, 3, 5, 7, 8, 10, 12].includes(m)) maxDay = 31;
  else if ([4, 6, 9, 11].includes(m)) maxDay = 30;
  else {
    maxDay = 28;
    if (y % 4 === 0) {
      maxDay = 29;
      if (y % 100 === 0 && y % 400 !== 0) maxDay = 28;
    }
  }

  // カレンダー配列生成
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

  // 月移動
  const MonthMove = (move: boolean) => {
    const newMonth = anchorDay.getMonth() + (move ? 1 : -1);
    const newDate = new Date(anchorDay.getFullYear(), newMonth, 1);
    onChange(newDate);
  };

  console.log("isMobile", isMobile);
  return (
    <div style={{ userSelect: "none" }}>
      {/* 月移動 */}
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-start",
          alignItems: "center",
          gap: "16px",
          marginBottom: "12px",
        }}
      >
        <button onClick={() => MonthMove(false)}>＜</button>
        <div>
          {y}/{mm}
        </div>
        <button onClick={() => MonthMove(true)}>＞</button>
      </div>

      {/* 曜日行 */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          justifyContent: isMobile ? "center" : "flex-start",
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
              justifyContent: isMobile ? "center" : "flex-start",
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

                      // スマホなら閉じる
                      if (onSelectDay) onSelectDay();
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
   親コンポーネント（全体）
   ============================ */
function CalendarDrawing() {
  const [anchorDay, setAnchorDay] = useState(new Date());
  const [open, setOpen] = useState(false);

  const isMobile = window.innerWidth < 768;

  // PC の場合は常に open=true にする
  const shouldOpen = isMobile ? open : true;

  return (
    <div style={{ userSelect: "none" }}>
      <p>カレンダー</p>

      {/* 日付表示部分（スマホはタップで展開、PCはただの表示） */}
      <DayDisplay
        day={anchorDay}
        onChange={setAnchorDay}
        onClick={isMobile ? () => setOpen(!open) : undefined}
        style={{
          display: "flex",
          justifyContent: isMobile ? "center" : "flex-start",
        }}
      />

      {/* PCは常時表示、スマホは shouldOpen のときだけ表示 */}
      {shouldOpen && (
        <Calendar
          day={anchorDay}
          onChange={setAnchorDay}
          onSelectDay={isMobile ? () => setOpen(false) : undefined}
          isMobile={isMobile}
        />
      )}
    </div>
  );
}

export default CalendarDrawing;
