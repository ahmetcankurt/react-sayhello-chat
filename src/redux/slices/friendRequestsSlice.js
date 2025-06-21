import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {API_URL} from "../../config";

// Async Thunk: Arkadaş listesini getir
export const fetchFriends = createAsyncThunk(
  "friendRequests/fetchFriends",
  async (userId, thunkAPI) => {
    const response = await axios.get(`${API_URL}/friend-requests/${userId}/friends-status`);
    return response.data
  }
);

export const deleteFriend = createAsyncThunk(
  "friendRequests/deleteFriend",
  async ({ userId, friendId }, thunkAPI) => {
    try {
      const response = await axios.delete(`${API_URL}/friend-requests/${userId}/friend/${friendId}`)
      return { userId, friendId }; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friendRequests/acceptFriendRequest",
  async ({ userId, senderId }, thunkAPI) => {
    try {
      const response = await axios.put(
        `${API_URL}/friend-requests/${userId}/friend-request/${senderId}`,
        { action: "accept" }
      );
      return { friend: response.data, senderId }; // Hem yeni arkadaş bilgisini hem de senderId'yi döndürüyoruz
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
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
      })
      .addCase(deleteFriend.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteFriend.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends = state.friends.filter(
          (friend) => friend.userId !== action.payload.friendId
        );
      })
      .addCase(deleteFriend.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.friends.push(action.payload.friend);
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
  },
});

export default friendRequestsSlice.reducer;
