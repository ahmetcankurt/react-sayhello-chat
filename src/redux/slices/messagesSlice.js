import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";
import { STATUS_TYPES } from "../../constants";

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
      return response.data.conversations;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// messagesSlice.js
const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    contacts: [],
    status: "idle",
    error: null,
  },
  // messagesSlice.js
  reducers: {
    updateContactList: (state, action) => {
      const { message, isOwnMessage } = action.payload;
      const userId = parseInt(localStorage.getItem("userId"));
      const { senderId, receiverId, groupId } = message;

      console.log("updateContactList called with message:", message);
      console.log("isOwnMessage:", isOwnMessage);

      // Contact ID'yi belirle
      const contactId = groupId || (senderId === userId ? receiverId : senderId);
      const contactType = groupId ? "group" : "user";

      // Mevcut contact'ı bul
    const existingContactIndex = state.contacts.findIndex(
  contact => String(contact.contactId) === String(contactId) && contact.type === contactType
);


      if (existingContactIndex !== -1) {
        const updatedContact = {
          ...state.contacts[existingContactIndex],
          lastMessage: message.content,
          lastMessageCreatedAt: message.createdAt,
          lastMessageSender: isOwnMessage ? "ben" : "o",
          isRead: isOwnMessage,
          unreadCount: isOwnMessage ? 0 : (state.contacts[existingContactIndex].unreadCount || 0) + 1
        };

        const newContacts = [...state.contacts];
        newContacts.splice(existingContactIndex, 1);
        state.contacts = [updatedContact, ...newContacts];
      } else {
        const newContact = {
          contactId,
          type: contactType,
          lastMessage: message.content,
          lastMessageCreatedAt: message.createdAt,
          lastMessageSender: isOwnMessage ? "ben" : "o",
          isRead: isOwnMessage,
          unreadCount: isOwnMessage ? 0 : 1
        };

        state.contacts.unshift(newContact);
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
        state.contacts = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateContactList } = messagesSlice.actions;
export default messagesSlice.reducer;
