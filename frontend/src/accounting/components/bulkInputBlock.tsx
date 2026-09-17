import React from "react";
import TextBox from "../../shared/textBox/textBox";
import AddSquare from "../../icons/add-square.svg?react";
import Trash from "../../icons/trash.svg?react";

type DataFormat = {
  item_name: string | null;
  amount: number | null;
  memo: string | null;
};

type Props = {
  data: DataFormat[];
  onChange: (v: DataFormat[]) => void;
};

function BulkInputBlock({ data, onChange }: Props) {
  // const [dataArr, setDataArr] = useState<DataFormat[]>(data ?? []);
  const isMobile = window.innerWidth < 768;

  // ============================
  // 商品名変更
  // ============================
  const onChangeName = (index: number, value: string) => {
    const newData = data.map((item, i) =>
      i === index ? { ...item, item_name: value } : item,
    );
    onChange(newData);
  };

  // ============================
  // 金額変更
  // ============================
  const onChangeMoney = (index: number, value: string) => {
    const newData = data.map((item, i) =>
      i === index
        ? { ...item, amount: value === "" ? null : Number(value) }
        : item,
    );
    onChange(newData);
  };

  // ============================
  // メモ変更
  // ============================
  const onChangeMemo = (index: number, value: string) => {
    const newData = data.map((item, i) =>
      i === index ? { ...item, memo: value } : item,
    );
    onChange(newData);
  };

  // ============================
  // 行追加
  // ============================
  const onAdd = () => {
    const newData = [...data, { item_name: null, amount: null, memo: null }];
    onChange(newData);
  };

  // ============================
  // 行削除
  // ============================
  const onDelete = (index: number) => {
    const newData = data.filter((_, i) => i !== index);
    onChange(newData);
  };

  return (
    <div
      style={{
        width: "95%",
        marginLeft: "2.5%",
      }}
    >
      {/* ============================
          入力欄
         ============================ */}
      {data.length > 0 &&
        data.map((item, index) => (
          <div
            key={index}
            style={{
              borderRadius: "10px",
              background: "#e8eff5",
              transition: "border-color 0.2s ease",
              border: "solid 3px #83A5C4",
              padding: "0.5em 1em",
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {/* ============================
                入力エリア
               ============================ */}
            <div style={{ width: "90%" }}>
              {/* 商品名・金額 */}
              <div
                style={{
                  display: isMobile ? "" : "flex",
                  alignItems: "center",
                }}
              >
                {/* ============================
                    商品名欄
                   ============================ */}
                <div
                  style={{
                    width: isMobile ? "80%" : "50%",
                  }}
                >
                  <TextBox
                    label="商品名"
                    value={item.item_name ?? ""}
                    onChange={(v) => onChangeName(index, v)}
                    type="text"
                  />
                </div>

                {/* ============================
                    金額入力
                   ============================ */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    width: isMobile ? "85%" : "40%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        marginLeft: isMobile ? "0%" : "5%",
                      }}
                    >
                      <TextBox
                        label="金額"
                        value={String(item.amount ?? "")}
                        onChange={(v) => onChangeMoney(index, v)}
                        type="number"
                      />
                    </div>

                    <div
                      style={{
                        marginLeft: "10px",
                        marginTop: "15px",
                        fontSize: "20px",
                      }}
                    >
                      円
                    </div>
                  </div>
                </div>
              </div>

              {/* ============================
                  メモ欄
                 ============================ */}
              <div
                style={{
                  width: "84%",
                }}
              >
                <TextBox
                  label="メモ"
                  value={item.memo ?? ""}
                  onChange={(v) => onChangeMemo(index, v)}
                  type="text"
                />
              </div>
            </div>

            {/* ============================
                削除
               ============================ */}
            <div
              style={{
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                alignItems: "center",
                cursor: "pointer",
              }}
              onClick={() => onDelete(index)}
            >
              <Trash
                width={40}
                height={40}
                style={{
                  color: "#ff0000",
                }}
              />

              <span>削除</span>
            </div>
          </div>
        ))}

      {/* ============================
          行の追加
         ============================ */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          width: "220px",
          height: "55px",
          margin: "20px auto 10px",
          boxSizing: "border-box",
          border: "2px dashed #83A5C4",
          borderRadius: "12px",
          backgroundColor: "#f7f9fc",
          color: "#5f7f9d",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onClick={onAdd}
      >
        <AddSquare
          width={32}
          height={32}
          style={{
            color: "#83A5C4",
          }}
        />

        <span
          style={{
            fontSize: "16px",
            fontWeight: "600",
          }}
        >
          行の追加
        </span>
      </div>
    </div>
  );
}

export default BulkInputBlock;
