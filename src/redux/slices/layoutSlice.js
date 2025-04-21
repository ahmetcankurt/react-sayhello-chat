import { createSlice } from "@reduxjs/toolkit";
import { LAYOUT_MODES } from "../../constants";

// localStorage'den layoutMode'u al
const savedLayoutMode = localStorage.getItem("layoutMode");

// Eğer localStorage'de yoksa varsayılan değeri LIGHT olarak ayarla
const initialState = {
  layoutMode: savedLayoutMode ? savedLayoutMode : LAYOUT_MODES.LIGHT,
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    setLayoutMode: (state, action) => {
      state.layoutMode = action.payload;
      // Yeni değeri localStorage'a kaydet
      localStorage.setItem("layoutMode", action.payload);
    },
    toggleLayoutMode: (state) => {
      const newLayoutMode =
        state.layoutMode === LAYOUT_MODES.LIGHT
          ? LAYOUT_MODES.DARK
          : LAYOUT_MODES.LIGHT;
      state.layoutMode = newLayoutMode;
      localStorage.setItem("layoutMode", newLayoutMode);
    },
  },
});

export const { setLayoutMode, toggleLayoutMode } = layoutSlice.actions;
export default layoutSlice.reducer;
