import { useEffect, useState, memo } from "react";
import { useDispatch } from "react-redux";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle
} from "reactstrap";
import axios from "axios";
import { io } from "socket.io-client";
import classnames from "classnames";

import { API_URL } from "../../../config";
import {
  acceptFriendRequest,
  fetchFriends
} from "../../../redux/slices/friendRequestsSlice";
import { getShortName } from "../../../utils/userHelpers";
import { capitalize } from "../../../utils/stringUtils";
import DelayedImage from "../../../components/DelayedImage"

import "./index.css";

const socket = io(API_URL);

function FriendRequestList() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const [incomingRequests, setIncomingRequests] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const res = await axios.get(`${API_URL}/friend-requests/${userId}/incoming-requests`);
        setIncomingRequests(res.data);
      } catch (err) {
        console.error("Gelen istekler alınamadı:", err);
      }
    };

    if (userId) fetchIncomingRequests();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    socket.emit("joinRoom", userId);

    socket.on("newFriendRequest", (newRequest) => {
      setIncomingRequests((prev) => [...prev, newRequest]);
    });

    socket.on("friendRequestCancelled", ({ senderId }) => {
      setIncomingRequests((prev) =>
        prev.filter((req) => Number(req.sender.userId) !== Number(senderId))
      );
    });

    // ** Önemli: friendRequestAccepted event'i dinle ve arkadaş listeni güncelle **
    socket.on("friendRequestAccepted", ({ friend }) => {
      // Kabul edilen arkadaş isteği kalkmalı, listeyi güncelle
      setIncomingRequests((prev) =>
        prev.filter((req) => Number(req.sender.userId) !== Number(friend.userId))
      );

      // Arkadaş listesi redux'undan fetch et
      dispatch(fetchFriends(userId));
    });

    return () => {
      socket.off("newFriendRequest");
      socket.off("friendRequestCancelled");
      socket.off("friendRequestAccepted");
    };
  }, [userId, dispatch]);

  const toggleDropdown = (id) => {
    setDropdownVisible((prev) => (prev === id ? null : id));
  };

  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
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

  return (
    <>
      <div className="px-3 pt-4">
        <div className="d-flex align-items-start">
          <div className="flex-grow-1">
            <h4 className="mb-4">Arkadaşlık İstekleri</h4>
          </div>
        </div>
      </div>
      <div className="friend-request-page">
        <div className="request-section">
          <h5 className="mb-3 font-size-11 text-muted text-uppercase">
            Gelen İstekler
          </h5>
          <div className="request-list">
            {incomingRequests.map((request) => {
              const user = request.sender;
              const fullName = `${capitalize(user.name)} ${capitalize(user.surname)}`;
              const shortName = getShortName(user);
              const hasImageError = imageErrors[user.userId];

              return (
                <div key={user.userId} className="d-flex align-items-center mb-3">
                  <div className="d-flex align-items-center flex-grow-1">
                    <div className="friends-list-img-container me-2">
                      <div className="avatar-sm">
                        {user.profileImage && !hasImageError ? (
                          <DelayedImage
                            src={`${API_URL}/${user.profileImage}`}
                            alt={fullName}
                            className="rounded-circle avatar-sm"
                            onError={() => handleImageError(user.userId)}
                            fallback={
                              <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center">
                                <i className="bx bx-user text-muted"></i>
                              </div>
                            }
                          />

                        ) : (
                          <span
                            className={classnames(
                              "avatar-title",
                              "rounded-circle",
                              "text-uppercase",
                              "text-white"
                            )}
                            style={{ backgroundColor: user?.color }}
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
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default memo(FriendRequestList);
