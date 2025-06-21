import { createSlice } from "@reduxjs/toolkit";
import { TABS } from "../../constants";

const initialState = {
  selectedTab: TABS.USERS,
};

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { setSelectedTab } = tabSlice.actions;
export default tabSlice.reducer;
