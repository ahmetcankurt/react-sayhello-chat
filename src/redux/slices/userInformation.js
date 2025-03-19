// slices/userInformationSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUserData, updateUser, updateUserImages } from "../api/userAPI";

const token = localStorage.getItem("token");

// Kullanıcı bilgilerini getir
export const getUsers = createAsyncThunk("user/getUsers", async (_, { rejectWithValue }) => {
  const token = localStorage.getItem("token"); // Token'i burada al
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


// Kullanıcı bilgilerini güncelle
export const updateUserInfo = createAsyncThunk("user/updateUser", async ({ userId, updatedData }, { rejectWithValue }) => {
  try {
    return await updateUser({ userId, updatedData, token });
  } catch (error) {
    return rejectWithValue(error.response?.data || "Güncelleme hatası");
  }
});

// Kullanıcı resimlerini güncelle
export const updateUserImage = createAsyncThunk("user/updateUserImage", async ({ userId, formData }, { rejectWithValue }) => {
  try {
    return await updateUserImages({ userId, formData, token });
  } catch (error) {
    return rejectWithValue(error.response?.data || "Resim güncelleme hatası");
  }
});

const initialState = {
  user: {}, // Tek bir kullanıcı objesi
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const userInformationSlice = createSlice({
  name: "userInformation",
  initialState,
  reducers: {
    resetUserState: (state) => {
      state.user = {}; // Kullanıcıyı sıfırlama
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
        state.user = action.payload; // Tek bir kullanıcı objesi
      })
      .addCase(getUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateUserInfo.fulfilled, (state, action) => {
        state.user = action.payload; // Güncellenmiş kullanıcı objesi
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
