// slices/messagesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";

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

// Mesaj güncelleme
export const updateMessage = (newMessage) => ({
  type: "messages/updateMessage",
  payload: newMessage,
});

const initialState = {
  messages: [],
  status: "idle",
  error: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessages(state, action) {
      state.messages = action.payload;
    },
    addNewMessage(state, action) {
      state.messages.push(action.payload);  // Add the new message
    },
    updateMessageReadStatus(state, action) {
      const { messageId, isRead } = action.payload;
      const message = state.messages.find(msg => msg.userId === messageId);
      if (message) {
        message.isRead = isRead;  // Update the message's read status
      }
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
      })
      .addCase("messages/updateMessage", (state, action) => {
        const updatedMessage = action.payload;
        const index = state.messages.findIndex((message) => message.userId === updatedMessage.userId);
        if (index !== -1) {
          state.messages[index] = {
            ...state.messages[index],
            lastMessage: updatedMessage.lastMessage,
            lastMessageSender: updatedMessage.lastMessageSender,
            lastMessageCreatedAt: updatedMessage.lastMessageCreatedAt,
          };
        }
      });
  },
});

export const { resetMessages } = messagesSlice.actions;
export default messagesSlice.reducer;
