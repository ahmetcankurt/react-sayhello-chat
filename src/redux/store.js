import { configureStore } from "@reduxjs/toolkit";
import selectedUserReducer from "./slices/selectedUser";  // selectedUser reducer'ını ekliyoruz
import userInformationReducer from "./slices/userInformation"; // Yeni slice'ı ekliyoruz
import messagesReducer from "./slices/messagesSlice"; // Yeni slice'ı ekliyoruz

const store = configureStore({
  reducer: {
    selectedUser: selectedUserReducer,  // selectedUser reducer'ını ekliyoruz
    userInformation: userInformationReducer, // userDetails slice'ını store'a ekliyoruz
    messages: messagesReducer, // messages slice'ını store'a ek
  },
});

export default store;