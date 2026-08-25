import HamburgerButton from "../../shared/hamburgerButton/menu";
import { Link } from "react-router-dom";
import Pen from "../../icons/pen.svg?react";
import WriteBook from "../../icons/writeBook.svg?react";

type Props = {
  type: "input" | "report";
};

function AccountingHeader({ type }: Props) {
  return (
    <div>
      <div className="flex gap-4 items-center">
        <HamburgerButton />
        {/* 入力ページ */}
        <Link
          to={"/accounting"}
          className="flex flex-col items-center"
          style={{ marginTop: "15px" }}
        >
          <Pen
            width={35}
            height={35}
            style={{ color: type === "input" ? "#ff76D2" : "#1976D2" }}
          />
          <div style={{ fontSize: "10px" }}>入力</div>
        </Link>

        {/* レポートページ */}
        <Link
          to={"/accounting/report"}
          className="flex flex-col items-center"
          style={{ marginTop: "15px" }}
        >
          <WriteBook
            width={35}
            height={35}
            style={{ color: type === "report" ? "#ff76D2" : "#1976D2" }}
          />
          <div style={{ fontSize: "10px" }}>レポート</div>
        </Link>
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
