import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../config";

// Arşivlenmiş mesajları kullanıcı ID'ye göre getir
export const fetchArchivedMessages = createAsyncThunk(
  "messages/fetchArchivedMessages",
  async (_, thunkAPI) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return thunkAPI.rejectWithValue("Kullanıcı ID bulunamadı");

      const response = await axios.get(`${API_URL}/messages/users/${userId}/archives`);
      return response.data.conversations;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Async thunk: mesajları kullanıcı ID'ye göre getir
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (_, thunkAPI) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) return thunkAPI.rejectWithValue("Kullanıcı ID bulunamadı");

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
    contacts: [],           // normal sohbetler
    archivedContacts: [],   // arşivli sohbetler
    conversations: {}, // contactId: [mesajlar]
    status: "idle",
    archiveStatus: "idle",
    error: null,
  },
  reducers: {
    updateContactList: (state, action) => {
      const { message, isOwnMessage } = action.payload;
      const currentUserId = parseInt(localStorage.getItem("userId"), 10);

      const { senderId, receiverId, groupId } = message;
      const contactId = String(groupId || (senderId === currentUserId ? receiverId : senderId));
      const contactType = groupId ? "group" : "user";

      const lastMessageSender =
        message.lastMessageSender?.type === "me" || senderId === currentUserId
          ? { type: "me" }
          : message.lastMessageSender?.type === "user"
            ? message.lastMessageSender
            : {
              type: "user",
              userId: message.senderId,
              name: message.groupName || (message.receiver?.name ?? "Bilinmeyen"),
              surname: message.receiver?.surname ?? "",
              username: message.receiver?.username ?? "",
              profileImage: message.receiver?.profileImage ?? null,
            };

      const fullName =
        lastMessageSender.type === "me"
          ? `${message.receiver?.name ?? "Bilinmeyen"} ${message.receiver?.surname ?? ""}`.trim()
          : `${lastMessageSender.name ?? "Bilinmeyen"} ${lastMessageSender.surname ?? ""}`.trim();

      // Önce arşivde var mı kontrol et
      const archivedIndex = state.archivedContacts.findIndex(
        c => String(c.contactId) === contactId && c.type === contactType
      );

      // Normal listede var mı kontrol et
      const existingIndex = state.contacts.findIndex(
        c => String(c.contactId) === contactId && c.type === contactType
      );

      // Eğer arşivde varsa SADECE arşivi güncelle
      if (archivedIndex !== -1) {
        const updatedArchivedContact = {
          ...state.archivedContacts[archivedIndex],
          lastMessage: message.content,
          lastMessageCreatedAt: message.createdAt,
          lastMessageSender,
          isRead: isOwnMessage,
          unreadCount: isOwnMessage ? 0 : (state.archivedContacts[archivedIndex].unreadCount || 0) + 1,
        };
        state.archivedContacts[archivedIndex] = updatedArchivedContact;
        return; // Normal listeye ekleme yapma
      }

      // Arşivde yoksa ve normal listede varsa normal listeyi güncelle
      if (existingIndex !== -1) {
        const updatedContact = {
          ...state.contacts[existingIndex],
          lastMessage: message.content,
          lastMessageCreatedAt: message.createdAt,
          lastMessageSender,
          isRead: isOwnMessage,
          unreadCount: isOwnMessage ? 0 : (state.contacts[existingIndex].unreadCount || 0) + 1,
        };
        const newContacts = [...state.contacts];
        newContacts.splice(existingIndex, 1);
        state.contacts = [updatedContact, ...newContacts];
      }
      // Hiçbirinde yoksa YENİ bir sohbet oluştur ve normal listeye ekle
      else {
        console.log("Yeni sohbet ekleniyor:",message )
        state.contacts.unshift({
          contactId,
          type: contactType,
          name: message.groupName || fullName,
          lastMessage: message.content || "",
          color: message?.color,
          lastMessageCreatedAt: message.createdAt || new Date().toISOString(),
          lastMessageSender,
          isRead: isOwnMessage,
          unreadCount: isOwnMessage ? 0 : 1,
          profileImage: message.groupImage || message.profileImage || null, // ✅ BURASI ÖNEMLİ
        });

      }
    },
    addNewMessageToConversation: (state, action) => {
      const message = action.payload;
      const currentUserId = parseInt(localStorage.getItem("userId"), 10);
      const contactId = String(
        message.groupId || (message.senderId === currentUserId ? message.receiverId : message.senderId)
      );

      if (!state.conversations[contactId]) state.conversations[contactId] = [];

      state.conversations[contactId].push(message);
    },
    setMessagesForContact: (state, action) => {
      const { contactId, messages } = action.payload;
      state.conversations[contactId] = messages;
    },
    removeFromContacts: (state, action) => {
      const { contactId, type } = action.payload;
      state.contacts = state.contacts.filter(
        contact => !(String(contact.contactId) === String(contactId) && contact.type === type)
      );
    },

  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";

        // contacts olarak set et
        state.contacts = action.payload.map((contact) => {
          let lastMessageSender = contact.lastMessageSender;
          const currentUserId = parseInt(localStorage.getItem("userId"), 10);

          if (typeof lastMessageSender === "string") {
            lastMessageSender =
              lastMessageSender === "me"
                ? { type: "me" }
                : { type: "user", name: contact.name };
          }

          if (!lastMessageSender?.type) {
            lastMessageSender =
              contact.senderId === currentUserId
                ? { type: "me" }
                : { type: "user", name: contact.name };
          }

          return {
            ...contact,
            lastMessageSender,
          };
        });
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })

      // Arşivli sohbetler
      .addCase(fetchArchivedMessages.pending, (state) => {
        state.archiveStatus = "loading";
        state.error = null;
      })
      .addCase(fetchArchivedMessages.fulfilled, (state, action) => {
        state.archiveStatus = "succeeded";
        state.archivedContacts = action.payload;
      })
      .addCase(fetchArchivedMessages.rejected, (state, action) => {
        state.archiveStatus = "failed";
        state.error = action.payload || action.error.message;
      });
  },
});

export const { updateContactList, addNewMessageToConversation, setMessagesForContact } = messagesSlice.actions;
export default messagesSlice.reducer;