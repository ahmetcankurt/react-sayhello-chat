import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../config";

// Async Thunk: Arkadaş listesini getir
export const fetchFriends = createAsyncThunk(
  "friendRequests/fetchFriends",
  async (userId, thunkAPI) => {
    const response = await axios.get(`${API_URL}/friend-requests/${userId}/friends-status`);
    return response.data.map(friend => ({
      id: friend.userId,
      firstName: friend.name,
      lastName: friend.surname,
      profileImage: friend.profileImage,
      status: friend.status
    }));
  }
);

const friendRequestsSlice = createSlice({
  name: "friendRequests",
  initialState: {
    friends: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = action.payload;
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default friendRequestsSlice.reducer;
