// redux/slices/chatTabsSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { CHATS_TABS } from '../../constants';

const initialState = {
  activeTab: CHATS_TABS.DEFAULT,
};

const chatTabsSlice = createSlice({
  name: 'chatTabs',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
});

export const { setActiveTab } = chatTabsSlice.actions;
export default chatTabsSlice.reducer;
