import { useEffect, useState, memo } from "react";
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

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const fetchIncomingRequests = async () => {
    try {
      const res = await axios.get(`${API_URL}/friend-requests/${userId}/incoming-requests`);
      setIncomingRequests(res.data);
    } catch (err) {
      console.error("Gelen istekler alınamadı:", err);
    }
  };

  useEffect(() => {
    fetchIncomingRequests();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;
  
    socket.emit("joinRoom", userId);
  
    socket.on("newFriendRequest", (newRequest) => {
      setIncomingRequests((prevRequests) => [...prevRequests, newRequest]);
    });
  
    socket.on("friendRequestCancelled", ({ senderId }) => {
      setIncomingRequests((prevRequests) =>
        prevRequests.filter((req) => Number(req.sender.userId) !== Number(senderId))
      );
    });
  
    return () => {
      socket.off("newFriendRequest");
      socket.off("friendRequestCancelled");
    };
  }, [userId]);
  

  const toggleDropdown = (userId) => {
    setDropdownVisible((prev) => (prev === userId ? null : userId));
  };

  const handleImageError = (userId) => {
    setImageErrors((prev) => ({ ...prev, [userId]: true }));
  };

  const handleRequest = async (senderId, action) => {
    try {
      if (action === "accept") {
        await dispatch(acceptFriendRequest({ userId, senderId })).unwrap();
        dispatch(fetchFriends(userId));
      } else {
        await axios.put(`${API_URL}/friend-requests/${userId}/friend-request/${senderId}`, { action });
      }

      setIncomingRequests((prev) =>
        prev.filter((req) => req.sender.userId !== senderId)
      );
    } catch (err) {
      console.error("İşlem başarısız:", err);
    }
  };

  const getRandomColor = (userId) => {
    const hash = userId.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return COLORS[hash % COLORS.length];
  };

  const renderRequestList = (requests) =>
    requests.map((request) => {
      const user = request.sender;
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
              <i className="bx bx-dots-vertical-rounded align-middle" />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem onClick={() => handleRequest(user.userId, "accept")}>
                Kabul Et <i className="bx bx-check ms-2 text-muted" />
              </DropdownItem>
              <DropdownItem onClick={() => handleRequest(user.userId, "reject")}>
                Reddet <i className="bx bx-x ms-2 text-muted" />
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    });

  return (
    <>
      <ListHeader />
      <div className="friend-request-page">
        <div className="request-section">
          <h5 className="mb-3 font-size-11 text-muted text-uppercase">Gelen İstekler</h5>
          <div className="request-list">{renderRequestList(incomingRequests)}</div>
        </div>
      </div>
    </>
  );
}

export default memo(Index);