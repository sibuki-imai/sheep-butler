import HamburgerButton from "../../shared/hamburgerButton/menu";
import { useNavigate } from "react-router-dom";
import Pen from "../../icons/pen.svg?react";
import WriteBook from "../../icons/writeBook.svg?react";
import Tag from "../../icons/categoryIcons/tag.svg?react";
import Camera from "../../icons/camera.svg?react";

type Props = {
  type: "input" | "report" | "category" | "bulk";
};

function AccountingHeader({ type }: Props) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex gap-4 items-center">
        <HamburgerButton />

        {/* 入力ページ */}
        <div
          className="flex flex-col items-center cursor-pointer"
          style={{ marginTop: "15px" }}
          onClick={() => navigate("/accounting", { replace: true })}
        >
          <Pen
            width={35}
            height={35}
            style={{ color: type === "input" ? "#ff76D2" : "#1976D2" }}
          />
          <div style={{ fontSize: "10px" }}>入力</div>
        </div>

        {/* レポートページ */}
        <div
          className="flex flex-col items-center cursor-pointer"
          style={{ marginTop: "15px" }}
          onClick={() => navigate("/accounting/report", { replace: true })}
        >
          <WriteBook
            width={35}
            height={35}
            style={{ color: type === "report" ? "#ff76D2" : "#1976D2" }}
          />
          <div style={{ fontSize: "10px" }}>レポート</div>
        </div>

        {/* カテゴリページ */}
        <div
          className="flex flex-col items-center cursor-pointer"
          style={{ marginTop: "15px" }}
          onClick={() => navigate("/accounting/category", { replace: true })}
        >
          <Tag
            width={35}
            height={35}
            style={{ color: type === "category" ? "#ff76D2" : "#1976D2" }}
          />
          <div style={{ fontSize: "10px" }}>カテゴリー</div>
        </div>

        {/* 一括入力 */}
        <div
          className="flex flex-col items-center cursor-pointer"
          style={{ marginTop: "15px" }}
          onClick={() => navigate("/accounting/bulk", { replace: true })}
        >
          <Camera
            width={35}
            height={35}
            style={{ color: type === "bulk" ? "#ff76D2" : "#1976D2" }}
          />
          <div style={{ fontSize: "10px" }}>一括入力</div>
        </div>
      </div>

      {/* 下部線 */}
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

export default AccountingHeader;
