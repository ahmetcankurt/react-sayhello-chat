// slices/messagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";

// Async thunk: Mesajları çekmek
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, { rejectWithValue }) => {
    const userId = localStorage.getItem("userId");
    try {
      const response = await axios.get(`${API_URL}/messages/users/${userId}`);
      return response.data.contacts;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Mesajlar alınırken bir hata oluştu");
    }
  }
);

const initialState = {
  messages: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    resetMessages: (state) => {
      state.messages = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
