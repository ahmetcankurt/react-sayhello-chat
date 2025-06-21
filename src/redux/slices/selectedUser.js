import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../config";

// Asenkron işlem: Seçili kullanıcının bilgilerini çek
export const fetchUserData = createAsyncThunk(
  "selectedUser/fetchUserData",
  async (userId, { rejectWithValue }) => {
    if (!userId) {
      return rejectWithValue("Kullanıcı ID'si boş, istek yapılmadı.");
    }


    try {
      const response = await axios.get(`${API_URL}/users/my-friends-profile/${userId.id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Bilinmeyen bir hata oluştu.");
    }
  }
);


const initialState = {
  isselectedUserOpen: false,
  userId: null,
  userInfo: null,
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
        state.error = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
  
});

export const { setUserId, resetUserId, toggleselectedUser, openselectedUser, closeselectedUser } = selectedUserSlice.actions;
export default selectedUserSlice.reducer;