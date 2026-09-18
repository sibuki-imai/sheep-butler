type ColorPaletteProps = {
  value: string; // 現在のカラーコード (#xxxxxx)
  onChange: (color: string) => void; // 選択後のカラーコードを返す
};

const presetColors = [
  "#FF6B6B",
  "#FFB56B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#843BFF",
  "#FF3EA5",
  "#3D3D3D",
  "#494848",
  "#FFFFFF",
];

export const ColorPalette: React.FC<ColorPaletteProps> = ({
  value,
  onChange,
}) => {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.5em",
        padding: "1em",
      }}
    >
      {presetColors.map((color) => (
        <div
          key={color}
          onClick={() => onChange(color)}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "8px",
            background: color,
            border: value === color ? "3px solid #000" : "2px solid #ccc",
            cursor: "pointer",
          }}
        />
      ))}
    </div>
  );
};

export default ColorPalette;
