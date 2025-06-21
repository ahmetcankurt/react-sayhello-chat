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

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    contacts: [],
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    updateContactList: (state, action) => {
      const { message, isOwnMessage } = action.payload;
      
      // Grup mesajı mı yoksa birebir mesaj mı kontrolü
      const isGroupMessage = message.groupId !== null;
      
      // İlgili contact'ı bul
      const contactIndex = state.contacts.findIndex(contact => 
        isGroupMessage 
          ? contact.type === "group" && contact.contactId === message.groupId
          : contact.type === "user" && contact.contactId === (isOwnMessage ? message.receiverId : message.senderId)
      );
      
      if (contactIndex !== -1) {
        // Contact bulundu, güncelle
        const updatedContacts = [...state.contacts];
        updatedContacts[contactIndex] = {
          ...updatedContacts[contactIndex],
          lastMessage: message.content,
          lastMessageSender: isOwnMessage ? "ben" : "o",
          lastMessageCreatedAt: message.createdAt,
          ...(!isOwnMessage && { unRead: (updatedContacts[contactIndex].unRead || 0) + 1 })
        };
        
        // Güncellenmiş contact'ı en üste taşı
        const [updatedContact] = updatedContacts.splice(contactIndex, 1);
        state.contacts = [updatedContact, ...updatedContacts];
      } else {
        // Yeni contact ekle (eğer kendi mesajımız değilse)
        if (!isOwnMessage) {
          const newContact = {
            type: isGroupMessage ? "group" : "user",
            contactId: isGroupMessage ? message.groupId : message.senderId,
            name: isGroupMessage ? "Yeni Grup" : message.senderName,
            surname: isGroupMessage ? "" : message.senderSurname,
            username: isGroupMessage ? "" : message.senderUsername,
            profileImage: isGroupMessage ? null : message.senderProfileImage,
            isActive: true,
            lastMessage: message.content,
            lastMessageSender: "o",
            lastMessageCreatedAt: message.createdAt,
            isBlocked: false,
            unRead: 1
          };
          
          state.contacts = [newContact, ...state.contacts];
        }
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
