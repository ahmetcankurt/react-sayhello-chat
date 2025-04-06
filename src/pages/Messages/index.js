import React, { memo, useEffect, useState, } from "react";
import SearchInput from "../../Component/input/searchInput";
import ScrollContainer from "../../Component/ScrollContainer";
import { API_URL } from "../../config";
import MessagesItem from "./MessagesItem";
import axios from "axios";
import "./Mymessages.css";


// Index bileşeni
function Index({ selectedUser, setSelectedUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    const userId = localStorage.getItem("userId");
  
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${API_URL}/messages/users/${userId}`);
        setMessages(response.data.contacts);
        console.log(response.data.contacts);
      } catch (error) {
        console.error("Mesajlar alınamadı:", error);
      }
    };
  
    fetchMessages();
  }, []);
  


  // Arama filtresi
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMessages = messages.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div>
      <div className="bg">
        <div className="Mymessages-add">
          <span className="Mymessages-title">Mesajlarım</span>
        </div>
        <div className="mx-2 mb-2">
          <SearchInput searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
        </div>
      </div>
      <ScrollContainer paddingBottom="80px">{
        filteredMessages?.map((message) => (
          <MessagesItem
            key={message.userId}
            message={message}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        ))
      }</ScrollContainer>
    </div>
  );
}

export default memo(Index);
