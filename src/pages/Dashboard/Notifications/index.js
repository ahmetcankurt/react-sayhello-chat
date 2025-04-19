import { useState, useEffect, memo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { capitalize } from "../../../utils/stringUtils";
import { io } from "socket.io-client";
import "./index.css";
import ListHeader from './ListHeader';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import {API_URL} from "../../../config";
const socket = io(API_URL);

function Index() {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  // Request'leri almak için genel bir fonksiyon
  const fetchRequests = async (type) => {
    const url = `${API_URL}/friend-requests/${userId}/${type}`;
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

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", userId);

    // Yeni arkadaşlık isteği geldiğinde güncelle
    socket.on("newFriendRequest", () => {
      fetchRequests("incoming-requests");
    });

    // Arkadaşlık isteği iptal edildiğinde gelen istekleri güncelle
    socket.on("friendRequestCancelled", ({ senderId }) => {
      setIncomingRequests((prevRequests) =>
        prevRequests.filter((request) => Number(request.sender.userId) !== Number(senderId))
      );
    });

    return () => {
      socket.off("newFriendRequest");
      socket.off("friendRequestCancelled");
    };
  }, [userId]);

  const handleRequest = async (senderId, action) => {
    try {
      await axios.put(
        `${API_URL}/friend-requests/${userId}/friend-request/${senderId}`,
        { action }
      );
      setIncomingRequests((prevRequests) =>
        prevRequests.filter((request) => request.sender.userId !== senderId)
      );
    } catch (err) {
      alert("Could not process the request. Please try again.");
    }
  };

  const handleRemoveFriendRequest = async (receiverId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/friend-requests/${userId}/friend-request/${receiverId}`,
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
    return requests.length > 0 && (
      requests.map((request) => (
        <div key={request[isIncoming ? "sender" : "receiver"].userId} className="d-flex">
          <div className="d-flex">
            <div className="friends-list-img-container me-2">
              <div className="avatar-sm">
                <img
                  src={`${API_URL}/${request[isIncoming ? "sender" : "receiver"].profileImage}`}
                  alt="Profile"
                  className="img-fluid rounded-circle"
                />
              </div>
            </div>
            <div>
              <span>
                {capitalize(request[isIncoming ? "sender" : "receiver"].name)}{" "}
                {capitalize(request[isIncoming ? "sender" : "receiver"].surname)}
              </span>
            </div>
          </div>
          <Dropdown isOpen={dropdownVisible === request[isIncoming ? "sender" : "receiver"].userId} toggle={() => toggleDropdown(request[isIncoming ? "sender" : "receiver"].userId)} className="ms-auto">
            <DropdownToggle tag="a" className="text-mute">
              <i className="bx bx-dots-vertical-rounded align-middle"></i>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              {isIncoming ? (
                <>
                  <DropdownItem
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => handleRequest(request.sender.userId, "accept")}
                  >
                     Kabul et 
                    <i className="bx bx-check ms-2 text-muted"></i>
                  </DropdownItem>
                  <DropdownItem
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => handleRequest(request.sender.userId, "reject")}
                  >
                     Reddet
                    <i className="bx bx-x ms-2 text-muted"></i>
                  </DropdownItem>
                </>
              ) : (
                <DropdownItem
                  className="d-flex align-items-center justify-content-between"
                  onClick={() => handleRemoveFriendRequest(request.receiver.userId)}
                >
                  Remove <i className="bx bx-trash ms-2 text-muted"></i>
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </div>
      ))
    );
  };

  return (
    <>
      <ListHeader />
      <div className="friend-request-page">
        {/* Gelen arkadaşlık istekleri */}
        <div className="request-section">
          <span className="section-title">Gelen İstekler</span>
          <div className="request-list">{renderRequestList(incomingRequests, true)}</div>
        </div>
  
        {/* Gönderilen arkadaşlık istekleri */}
        <div className="request-section">
          <span className="section-title">Gönderdiğiniz İstekler</span>
          <div className="request-list">{renderRequestList(sentRequests, false)}</div>
        </div>
      </div>
    </>
  );
  
}

export default memo(Index);

