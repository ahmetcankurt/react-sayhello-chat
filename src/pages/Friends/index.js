import { useState, useEffect, memo } from "react";
import { FaTrash } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import "./FriendsList.css";
import Modal from "./Modal";
import Swal from "sweetalert2";
import SearchInput from "../../Component/input/searchInput";
import UserImage from "../../Component/UserImage";
import { API_URL } from "../../config";
import ScrollContainer from "../../Component/ScrollContainer";
import io from "socket.io-client";
import { capitalize } from "../../utils/stringUtils";

const socket = io(API_URL);

const Index = ({ setSelectedUser}) => {
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

  const handleFriendshipDelete = (friendId) => {
    Swal.fire({
      title: "Emin misiniz?",
      text: "Bu kişiyi arkadaş listenizden silmek istiyor musunuz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "İptal",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${API_URL}/friend-requests/${userId}/friend/${friendId}`)
          .then(() => {
            setFriends((prevFriends) =>
              prevFriends.filter((friend) => friend.userId !== friendId)
            );
            Swal.fire({
              title: "Silindi!",
              text: "Arkadaşınız başarıyla silindi.",
              icon: "success",
              timer: 3000,
              position: "top-end",
              toast: true,
              showConfirmButton: false,
            });
          })
          .catch((err) => {
            Swal.fire("Hata!", "Arkadaş silinemedi, lütfen tekrar deneyin.", "error");
          });
      }
    });
  };


  useEffect(() => {
    socket.on("userStatus", ({ userId, isActive }) => {
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.userId === userId ? { ...friend, isActive } : friend
        )
      );
    });

    return () => {
      socket.off("userStatus"); // Temizleme işlemi
    };
  }, []);

  return (
    <div>
      <div className="Mymessages-add">
        <span className="Mymessages-title" >Arkadaşlarım</span>
        <MdAdd className="Mymessages-icon" onClick={openModal} />
      </div>
      <SearchInput searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <ScrollContainer paddingBottom="80px">
        <div className="friends-scroll-container">
          {Object.keys(groupedFriends)
            .sort()
            .map((letter) => (
              <div key={letter}>
                <div key={letter + "letter-header"} className="letter-header">
                  <h5>{letter}</h5>
                  <div className="line"></div>
                </div>

                {groupedFriends[letter].map((friend) => (
                  <div key={friend.userId} className="friends-list-blog" >
                    <div className="d-flex" onClick={() => setSelectedUser(friend.userId)}>
                      <UserImage src={friend?.profileImage} isActive={friend.isActive} />
                      <span>{capitalize(friend?.name)} {capitalize(friend?.surname)}</span>
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
      </ScrollContainer>
      {isModalOpen && <Modal onClose={closeModal} />} {/* Modal açma/kapatma */}
    </div>

  );
};

export default memo(Index)
