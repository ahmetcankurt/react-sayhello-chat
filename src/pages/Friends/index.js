import { useState, useEffect, memo } from "react";
import { FaSearch, FaTrash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import "./FriendsList.css";
import Modal from "./Modal";
import Swal from "sweetalert2";
import SearchInput from "../../Component/input/searchInput";
import UserImage from "../../Component/UserImage";
import { API_URL } from "../../config";

const Index = ({ setSelectedUser, selectedUser }) => {
  const [friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`${API_URL}/friend-requests/${userId}/friends-status`)
      .then((response) => {
        setFriends(response.data);
      })
      .catch((error) => {
        console.error("Error fetching friends:", error);
      });
  }, [userId]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedFriends = filteredFriends.reduce((acc, friend) => {
    const firstLetter = friend.name[0].toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(friend);
    return acc;
  }, {});

  const toggleDropdown = (userId) => {
    setDropdownVisible((prevId) => (prevId === userId ? null : userId));
  };

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal durumu

  const openModal = () => setIsModalOpen(true); // Modal açma
  const closeModal = () => setIsModalOpen(false); // Modal kapatma

  const handleFriendshipDelete = async (friendId) => {
    try {
      await axios.delete(`${API_URL}/friend-requests/${userId}/friend/${friendId}`);
      setFriends((prevFriends) =>
        prevFriends.filter((friend) => friend.userId !== friendId)
      );
      Swal.fire({
        title: 'Başarıyla Arkadaşlıktan Silindi!',
        text: 'Arkadaşınız listeden çıkarıldı.',
        icon: "success",
        timer: 3000,  // Bildirim süresi (3 saniye)
        position: "top-end",
        toast: true,  // Toast (küçük, ekranın köşesinde görünür)
        showConfirmButton: false,  // Kullanıcı onayı olmadan otomatik kapanır
      });
    } catch (err) {
      console.error("Error deleting friendship:", err);
      alert("Could not delete friendship. Please try again.");
    }
  };

  return (
    <div>
      <div className="Mymessages-add">
        <span className="Mymessages-title" >Arkadaşlarım</span>
        <MdAdd className="Mymessages-icon" onClick={openModal} />
      </div>
      <SearchInput searchTerm={searchTerm} handleSearchChange={handleSearchChange} />

      <div className="friends-list-container">
        {Object.keys(groupedFriends)
          .sort()
          .map((letter) => (
            <div key={letter}>
              <div key={letter} className="letter-header">
                <h5>{letter}</h5>
                <div className="line"></div>
              </div>

              {groupedFriends[letter].map((friend) => (
                <div key={friend.userId} className="friends-list-blog" onClick={() => setSelectedUser(friend.userId)}>
                  <div className="d-flex">
                    <UserImage src={friend?.profileImage} isActive={friend.isActive} />
                    <span>{friend?.name} {friend?.surname}</span>
                  </div>
                  <div className="dropdown-wrapper">
                    <BsThreeDotsVertical
                      className="friends-list-dots-icon"
                      onClick={() => toggleDropdown(friend.userId)}
                    />
                    {dropdownVisible === friend.userId && (
                      <div className="friends-list-dropdown">
                        <FaTrash className="dropdown-friends-list-icon" onClick={() => handleFriendshipDelete(friend.userId)} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </div>
      {isModalOpen && <Modal onClose={closeModal} />} {/* Modal açma/kapatma */}
    </div>

  );
};

export default memo(Index)
