import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "http://localhost:3000";

// Asenkron işlem: Seçili kullanıcının bilgilerini çek
export const fetchUserData = createAsyncThunk("selectedUser/fetchUserData",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/users/my-friends-profile/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  isselectedUserOpen: false,
  userId: null,
  userInfo: null,
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const selectedUserSlice = createSlice({
  name: "selectedUser",
  initialState,
  reducers: {
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
    resetUserId: (state) => {
      state.userId = null;
    },
    toggleselectedUser: (state) => {
      state.isselectedUserOpen = !state.isselectedUserOpen;
    },
    openselectedUser: (state) => {
      state.isselectedUserOpen = true;
    },
    closeselectedUser: (state) => {
      state.isselectedUserOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setUserId, resetUserId, toggleselectedUser, openselectedUser, closeselectedUser } = selectedUserSlice.actions;
export default selectedUserSlice.reducer;