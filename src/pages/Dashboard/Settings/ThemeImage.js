import { memo, useEffect, useState } from "react";
import classnames from "classnames";

// Tema arka plan resmi stilleri (sabit)
const themeImages = [
  { id: "bgimg-radio1", pattern: "bg-pattern-1" },
  { id: "bgimg-radio2", pattern: "bg-pattern-2" },
  { id: "bgimg-radio3", pattern: "bg-pattern-3" },
  { id: "bgimg-radio4", pattern: "bg-pattern-4" },
  { id: "bgimg-radio5", pattern: "bg-pattern-5" },
  { id: "bgimg-radio6", pattern: "bg-pattern-6" },
  { id: "bgimg-radio7", pattern: "bg-pattern-7" },
  { id: "bgimg-radio8", pattern: "bg-pattern-8" },
  { id: "bgimg-radio9", pattern: "bg-pattern-9" },
];

// Yardımcı: Arka plan görselini uygula
const changeImage = (id) => {
  const el = document.getElementById(`image-${id}`);
  const userChat = document.getElementById("user-chat");
  if (el && userChat) {
    const bg = window.getComputedStyle(el).getPropertyValue("background-image");
    userChat.style.backgroundImage = bg;
  }
};

// Görsel seçim kutusu
const FormCheck = ({ image, selected, onChange }) => (
  <div className="form-check">
    <input
      className="form-check-input theme-img"
      type="radio"
      name="bgimg-radio"
      id={image.id}
      onChange={() => onChange(image)}
      checked={selected?.id === image.id}
    />
    <label className="form-check-label avatar-xs" htmlFor={image.id}>
      <span
        id={`image-${image.id}`}
        className={classnames("avatar-title", "rounded-circle", "theme-btn", image.pattern, image.id)}
      ></span>
    </label>
  </div>
);

// Ana bileşen
const ThemeImage = ({ theme, onChangeData }) => {
  const [selected, setSelected] = useState(null);

  const handleChange = (image) => {
    setSelected(image);
    localStorage.setItem("selectedThemeImage", image.id);
    onChangeData("theme", { ...theme, image: image.id });
  };

  // İlk yüklemede kaydedilen tema görselini uygula
  useEffect(() => {
    const savedId = localStorage.getItem("selectedThemeImage");
    const found = themeImages.find((img) => img.id === savedId) || themeImages[0];
    setSelected(found);
    changeImage(found.id);
    localStorage.setItem("selectedThemeImage", found.id); // Eğer boşsa kaydet
  }, []);

  // Seçilen görsel değişince arka planı uygula
  useEffect(() => {
    if (selected) changeImage(selected.id);
  }, [selected]);

  return (
    <div className="mt-4 pt-2">
      <h5 className="mb-3 font-size-11 text-muted text-uppercase">Arka Plan Resmi</h5>
      <div className="d-flex align-items-center flex-wrap gap-2 theme-btn-list theme-btn-list-img">
        {themeImages.map((image, index) => (
          <FormCheck
            key={index}
            image={image}
            selected={selected}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ThemeImage);