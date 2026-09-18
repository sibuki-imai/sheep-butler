import Icon from "../../icons/Icon.svg?react";
import { Link } from "react-router-dom";

function MenuItem({
  name,
  color,
  rink,
}: {
  name: string;
  color: string;
  rink: string;
}) {
  return (
    <Link
      to={rink}
      className="flex items-center gap-4 mt-4"
      style={{ marginLeft: "20%" }}
    >
      <Icon style={{ color }} />
      <span>{name}</span>
    </Link>
  );
}

function MenusList() {
  return (
    <div>
      <MenuItem name="家計簿" color="#00d627" rink="/accounting" />
      <MenuItem name="在庫管理" color="#FF0000" rink="/test" />
      <MenuItem name="Coming soon" color="#83A5C4" rink="/test" />
    </div>
  );
}

export default MenusList;
