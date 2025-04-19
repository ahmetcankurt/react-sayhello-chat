import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../config";

// Async thunk: kullanıcı mesajlarını getir
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages", 
  async (_, thunkAPI) => {
    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        return thunkAPI.rejectWithValue("Kullanıcı ID bulunamadı");
      }

      const response = await axios.get(`${API_URL}/messages/users/${userId}`);
      return response.data.contacts;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    contacts: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.contacts = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default messagesSlice.reducer;
