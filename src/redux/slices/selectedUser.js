import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";

// Asenkron işlem: Kullanıcı ya da grup verisini çek
export const fetchUserData = createAsyncThunk(
  "selectedUser/fetchUserData",
  async ({ id, userType }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response =
        userType === "user"
          ? await axios.get(`${API_URL}/users/my-friends-profile/${id}`)
          : await axios.get(`${API_URL}/groups/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

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
    removeGroupMember: (state, action) => {
      const removedUserId = action.payload;

      if (state.userInfo?.members) {
        state.userInfo.members = state.userInfo.members.filter(
          member => member.userId !== removedUserId
        );
      }
    },
    addGroupMembers: (state, action) => {
      const newMembers = action.payload;

      // Eğer members yoksa, boş bir dizi olarak başlat
      if (!state.userInfo) return;

      if (!Array.isArray(state.userInfo.members)) {
        state.userInfo.members = [];
      }

      const existingUserIds = state.userInfo.members.map(m => m.member?.userId || m.userId);
      const uniqueNewMembers = newMembers.filter(
        newMember => !existingUserIds.includes(newMember.member?.userId || newMember.userId)
      );
      state.userInfo.members = [...state.userInfo.members, ...uniqueNewMembers];
    }

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.error = null;
        state.userInfo = null;
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const {
  setUserId,
  resetUserId,
  toggleselectedUser,
  openselectedUser,
  closeselectedUser,
  removeGroupMember,
  addGroupMembers,
} = selectedUserSlice.actions;

export default selectedUserSlice.reducer;
