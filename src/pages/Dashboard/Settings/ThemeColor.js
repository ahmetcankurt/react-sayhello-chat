import { memo, useEffect, useState } from "react";
import classnames from "classnames";

// Sabit tema renkleri
const themeColors = [
  { id: "bgcolor-radio2", color: "bg-info" },
  { id: "bgcolor-radio3", color: "bg-purple" },
  { id: "bgcolor-radio4", color: "bg-pink" },
  { id: "bgcolor-radio5", color: "bg-danger" },
  { id: "bgcolor-radio6", color: "bg-secondary" },
  { id: "bgcolor-radio7", color: "bg-success" },
  { id: "bgcolor-radio8", color: "bg-warning" },
  { id: "bgcolor-radio11", color: "bg-transparent" },
];

// Yardımcı: Renk değişimini uygula
const changeColor = (id) => {
  const el = document.getElementById(`color-${id}`);
  const overlay = document.getElementById("user-chat-overlay");
  if (!el || !overlay) return;

  const color = window.getComputedStyle(el).getPropertyValue("background-color");
  overlay.style.background = color;

  const rgb = color.substring(color.indexOf("(") + 1, color.indexOf(")"));
  document.documentElement.style.setProperty("--bs-primary-rgb", rgb);
};

// Renk seçim kutusu
const FormCheck = ({ color, selected, onChange }) => (
  <div className="form-check">
    <input
      className="form-check-input theme-color"
      type="radio"
      name="bgcolor-radio"
      id={color.id}
      onChange={() => onChange(color)}
      checked={selected?.id === color.id}
    />
    <label className="form-check-label avatar-xs" htmlFor={color.id}>
      <span
        id={`color-${color.id}`}
        className={classnames("avatar-title", "rounded-circle", "theme-btn", color.color, color.id)}
      ></span>
    </label>
  </div>
);

// Ana bileşen
const ThemeColor = ({ theme, onChangeData }) => {
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem("selected-theme-color");
    return saved ? JSON.parse(saved) : themeColors[0];
  });

  const handleChange = (color) => {
    setSelected(color);
    onChangeData("theme", { ...theme, color: color.id });

    const el = document.getElementById(`color-${color.id}`);
    const rgb = el
      ? window.getComputedStyle(el).getPropertyValue("background-color")
      : "";

    localStorage.setItem("selected-theme-color", JSON.stringify({ ...color, rgb }));
  };

  useEffect(() => {
    const saved = localStorage.getItem("selected-theme-color");
    const colorId = saved ? JSON.parse(saved).id : theme?.color;
    const found = themeColors.find((c) => c.id === colorId);
    if (found) {
      setSelected(found);
      onChangeData("theme", { ...theme, color: found.id });
    }
  }, [theme, onChangeData]);

  useEffect(() => {
    if (selected) changeColor(selected.id);
  }, [selected]);

  return (
    <div>
      <h5 className="mb-3 font-size-11 text-muted text-uppercase">Tema Rengi</h5>
      <div className="d-flex align-items-center flex-wrap gap-2 theme-btn-list theme-color-list">
        {themeColors.map((color, index) => (
          <FormCheck
            key={index}
            color={color}
            selected={selected}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ThemeColor);