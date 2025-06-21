// slices/userInformationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserData, updateUser, updateUserImages } from "../api/userAPI";

export const getUsers = createAsyncThunk("user/getUsers", async (_, { rejectWithValue }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return rejectWithValue("Kullanıcı oturumu yok");
  }

  try {
    const response = await fetchUserData(token);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Bir hata oluştu");
  }
});

export const updateUserInfo = createAsyncThunk("user/updateUser", async ({ userId, updatedData }, { rejectWithValue }) => {
  const token = localStorage.getItem("token");
  try {
    const response = await updateUser({ userId, updatedData, token });
    return {
      ...response,
      // Sosyal medya bilgilerini doğru şekilde güncelle
      socials: updatedData.socials || []
    };
  } catch (error) {
    return rejectWithValue(error.response?.data || "Güncelleme hatası");
  }
});

export const updateUserImage = createAsyncThunk("user/updateUserImage", async ({ userId, formData }, { rejectWithValue }) => {
  const token = localStorage.getItem("token");
  try {
    return await updateUserImages({ userId, formData, token });
  } catch (error) {
    return rejectWithValue(error.response?.data || "Resim güncelleme hatası");
  }
});

const initialState = {
  user: {},
  status: "idle",
  error: null,
};

const userInformationSlice = createSlice({
  name: "userInformation",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = {};
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUsers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUserImage.fulfilled, (state, action) => {
        if (state.user && action.payload) {
          state.user.profileImage = action.payload.profileImage ?? state.user.profileImage;
          state.user.backgroundImage = action.payload.backgroundImage ?? state.user.backgroundImage;
        }
      })
      .addCase(updateUserImage.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { resetUserState } = userInformationSlice.actions;
export default userInformationSlice.reducer;