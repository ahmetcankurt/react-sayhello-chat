import { useState, useEffect, memo } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { capitalize } from "../../../utils/stringUtils";
import { io } from "socket.io-client";
import "./index.css";
import ListHeader from './ListHeader';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import classnames from "classnames";
import { API_URL } from "../../../config";
import { useDispatch } from "react-redux";
import { acceptFriendRequest, fetchFriends } from "../../../redux/slices/friendRequestsSlice";
import { getShortName } from "../../../utils/userHelpers";
import { COLORS } from "../../../constants/bgShortColor";
const socket = io(API_URL);

function Index() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

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

  const handleImageError = (userId) => {
    setImageErrors(prev => ({ ...prev, [userId]: true }));
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
    if (action === "accept") {
      try {
        await dispatch(acceptFriendRequest({ userId, senderId })).unwrap();
        // İsteği kabul ettikten sonra arkadaş listesini yenile
        dispatch(fetchFriends(userId));
        setIncomingRequests((prevRequests) =>
          prevRequests.filter((request) => request.sender.userId !== senderId)
        );
      } catch (error) {
        console.error("Arkadaşlık isteği kabul edilirken hata:", error);
      }
    } else {
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

  const getRandomColor = (userId) => {
    const hash = userId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return COLORS[hash % COLORS.length];
  };

  const renderRequestList = (requests, isIncoming) => {
    return requests.length > 0 && (
      requests.map((request) => {
        const user = request[isIncoming ? "sender" : "receiver"];
        const fullName = `${capitalize(user.name)} ${capitalize(user.surname)}`;
        const shortName = getShortName(user);

        const hasImageError = imageErrors[user.userId];
        const color = getRandomColor(user.userId);

        return (
          <div key={user.userId} className="d-flex align-items-center mb-3">
            <div className="d-flex align-items-center flex-grow-1">
              <div className="friends-list-img-container me-2">
                <div className="avatar-sm">
                  {user.profileImage && !hasImageError ? (
                    <img
                      src={`${API_URL}/${user.profileImage}`}
                      alt={fullName}
                      className="img-fluid rounded-circle"
                      onError={() => handleImageError(user.userId)}
                    />
                  ) : (
                    <span
                      className={classnames(
                        "avatar-title",
                        "rounded-circle",
                        "text-uppercase",
                        "text-white",
                        color
                      )}
                    >
                      {shortName}
                    </span>
                  )}
                </div>
              </div>
              <div>
                <span>{fullName}</span>
              </div>
            </div>
            <Dropdown isOpen={dropdownVisible === user.userId} toggle={() => toggleDropdown(user.userId)}>
              <DropdownToggle tag="a" className="text-mute">
                <i className="bx bx-dots-vertical-rounded align-middle"></i>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                {isIncoming ? (
                  <>
                    <DropdownItem
                      className="d-flex align-items-center justify-content-between"
                      onClick={() => handleRequest(user.userId, "accept")}
                    >
                      Kabul et
                      <i className="bx bx-check ms-2 text-muted"></i>
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex align-items-center justify-content-between"
                      onClick={() => handleRequest(user.userId, "reject")}
                    >
                      Reddet
                      <i className="bx bx-x ms-2 text-muted"></i>
                    </DropdownItem>
                  </>
                ) : (
                  <DropdownItem
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => handleRemoveFriendRequest(user.userId)}
                  >
                    Remove <i className="bx bx-trash ms-2 text-muted"></i>
                  </DropdownItem>
                )}
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      })
    );
  };

  return (
    <>
      <ListHeader />
      <div className="friend-request-page">
        {/* Gelen arkadaşlık istekleri */}
        <div className="request-section">
          <h5 className="mb-3 font-size-11 text-muted text-uppercase">
            Gelen İstekler
          </h5>
          <div className="request-list">{renderRequestList(incomingRequests, true)}</div>
        </div>

        {/* Gönderilen arkadaşlık istekleri */}
        <div className="request-section">
          <h5 className="mb-3 font-size-11 text-muted text-uppercase">
          Gönderdiğiniz İstekler
          </h5>
          <div className="request-list">{renderRequestList(sentRequests, false)}</div>
        </div>
      </div>
    </>
  );
}

export default memo(Index);