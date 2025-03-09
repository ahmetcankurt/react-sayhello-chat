
import { useState, useEffect, memo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import ImageMe from "../../assets/image/imageAdmin.jpeg";
import axios from "axios";
import { FaCheck, FaTrash } from "react-icons/fa6";
import "./index.css";
import Swal from "sweetalert2";

function Index() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);



  // Request'leri almak için genel bir fonksiyon
  const fetchRequests = async (type) => {
    const url = `http://localhost:3000/friend-requests/${userId}/${type}`;
    try {
      const response = await axios.get(url);
      type === "incoming-requests"
        ? setIncomingRequests(response.data)
        : setSentRequests(response.data);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  useEffect(() => {
    fetchRequests("incoming-requests");
    fetchRequests("sent-requests");
  }, [userId]);

  const toggleDropdown = (userId) => {
    setDropdownVisible(dropdownVisible === userId ? null : userId);
  };

  const handleRequest = async (senderId, action) => {
    try {
      await axios.put(
        `http://localhost:3000/friend-requests/${userId}/friend-request/${senderId}`,
        { action }
      );
      setIncomingRequests((prevRequests) =>
        prevRequests.filter((request) => request.sender.userId !== senderId)
      );
    } catch (err) {
      console.error("Error processing the friend request:", err);
      alert("Could not process the request. Please try again.");
    }
  };

  const handleRemoveFriendRequest = async (receiverId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/friend-requests/${userId}/friend-request/${receiverId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        title: "Başarıyla İstek iptal Edildi!",
        icon: "success",
        text: response.data.message,
        timer: 3000,
        position: "top-end",
        toast: true,
        showConfirmButton: false,
      });

      setSentRequests((prevRequests) =>
        prevRequests.filter((request) => request.receiver.userId !== receiverId)
      );
    } catch (err) {
      Swal.fire({
        title: "Hata!",
        text: err.response?.data?.message || "Bir hata oluştu.",
        icon: "error",
        confirmButtonText: "Tamam",
      });
    }
  };

  const renderRequestList = (requests, isIncoming) => {
    return requests.length > 0 ? (
      requests.map((request) => (
        <div key={request[isIncoming ? "sender" : "receiver"].userId} className="friends-list-blog">
          <div className="d-flex">
            <div className="friends-list-img-container me-2">
              <img
                src={`http://localhost:3000/${request[isIncoming ? "sender" : "receiver"].profileImage}` || ImageMe}
                className="friends-list-img-me"
                alt="Profile"
              />
              <span
                className={`status-light ${request[isIncoming ? "sender" : "receiver"].isActive ? "active" : "inactive"
                  }`}
              />
            </div>
            <div>
              <span>{`${request[isIncoming ? "sender" : "receiver"].name} ${request[isIncoming ? "sender" : "receiver"].surname
                }`}</span>
            </div>
          </div>
          <div className="dropdown-wrapper">
            <BsThreeDotsVertical
              className="friends-list-dots-icon"
              onClick={() => toggleDropdown(request[isIncoming ? "sender" : "receiver"].userId)}
            />
            {dropdownVisible === request[isIncoming ? "sender" : "receiver"].userId && (
              <div className="request-list-dropdown">
                {isIncoming ? (
                  <>
                    <FaCheck
                      className="dropdown-request-icon"
                      onClick={() => handleRequest(request.sender.userId, "accept")}
                    />
                    <FaTrash
                      className="dropdown-request-icon"
                      onClick={() => handleRequest(request.sender.userId, "reject")}
                    />
                  </>
                ) : (
                  <FaTrash
                    className="dropdown-request-icon"
                    onClick={() => handleRemoveFriendRequest(request.receiver.userId)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      ))
    ) : (
      <div>No {isIncoming ? "incoming" : "sent"} requests.</div>
    );
  };

  return (
    <div >
      <div className="Mymessages-add">
        <span className="Mymessages-title">Arkadaşlık İstekleri</span>
      </div>

      {/* Gelen arkadaşlık istekleri */}
      <div className="friends-list-container">
        <span className="section-title">Gelen İstekler</span>
        {renderRequestList(incomingRequests, true)}
      </div>

      <hr />

      {/* Gönderdiğiniz arkadaşlık istekleri */}
      <div className="friends-list-container">
        <span className="section-title">Gönderdiğiniz İstekler</span>
        {renderRequestList(sentRequests, false)}
      </div>
    </div>
  );
};

export default memo(Index);
