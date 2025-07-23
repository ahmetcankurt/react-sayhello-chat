import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";

// Async thunk: bildirimleri çekme
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (userId, thunkAPI) => {
    const res = await axios.get(`${API_URL}/notifications/${userId}/all`);
    return res.data.notifications || [];
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    clearNotifications: (state) => {
      state.list = [];
      state.status = "idle";
    },
    removeNotificationBySenderId: (state, action) => {
      const senderId = action.payload;
      state.list = state.list.filter(
        (notif) => !(notif.sender?.userId === senderId && notif.type === "friendRequest")
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { clearNotifications, removeNotificationBySenderId } = notificationsSlice.actions;
export default notificationsSlice.reducer;
