import { configureStore } from "@reduxjs/toolkit";
import selectedUserReducer from "./slices/selectedUser";  // selectedUser reducer'ını ekliyoruz
import userInformationReducer from "./slices/userInformation"; // Yeni slice'ı ekliyoruz
import messagesReducer from "./slices/messagesSlice"; // Yeni slice'ı ekliyoruz
import tabReducer from "./slices/tabSlice";
import layoutReducer from "./slices/layoutSlice"; // Yeni slice'ı ekliyoruz
import friendRequestsReducer from "./slices/friendRequestsSlice";
const store = configureStore({
  reducer: {
    selectedUser: selectedUserReducer,  // selectedUser reducer'ını ekliyoruz
    userInformation: userInformationReducer, // userDetails slice'ını store'a ekliyoruz
    messages: messagesReducer, // messages slice'ını store'a ek
    tab: tabReducer,
    layout: layoutReducer,
    friendRequests: friendRequestsReducer,
  },
});

export default store;