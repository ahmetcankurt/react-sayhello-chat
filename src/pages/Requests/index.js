import { useState, useEffect, memo } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import ImageMe from "../../assest/image/imageAdmin.jpeg";
import axios from "axios";
import { FaCheck, FaTrash } from "react-icons/fa6";
import "./index.css";

const Index = () => {
  const userId = localStorage.getItem("userId");
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [dropdownVisible, setDropdownVisible] = useState(null);

  // Arkadaşlık isteklerini alma
  useEffect(() => {
    const fetchIncomingRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/friend-requests/${userId}/incoming-requests`
        );
        setIncomingRequests(response.data);
      } catch (error) {
        console.error("Error fetching incoming requests:", error);
      }
    };

    fetchIncomingRequests();
  }, [userId]);

  const toggleDropdown = (userId) => {
    setDropdownVisible(dropdownVisible === userId ? null : userId);
  };

  // Arkadaşlık isteğini kabul etme
 const handleRequest = async (senderId, action) => {
    try {
      await axios.put(`http://localhost:3000/friend-requests/${userId}/friend-request/${senderId}`, {
        action,
      });
      setIncomingRequests((prevRequests) =>
        prevRequests.filter((request) => request.sender.userId !== senderId)
      );
    } catch (err) {
      console.error("Error processing the friend request:", err);
      alert("Could not process the request. Please try again.");
    }
  };

  return (
    <div>
      <div className="Mymessages-add">
        <span className="Mymessages-title">Requests List</span>
      </div>
      <div className="friends-list-container">
        {incomingRequests.length > 0 ? (
          incomingRequests.map((request) => (
            <div key={request.sender.userId} className="friends-list-blog">
              <div className="d-flex">
                <div className="friends-list-img-container me-2">
                  <img
                    src={ImageMe}
                    className="friends-list-img-me"
                    alt="Profile"
                  />
                  <span
                    className={`status-light ${
                      request.sender.isActive ? "active" : "inactive"
                    }`}
                  />
                </div>
                <div>
                  <span>{`${request.sender.name} ${request.sender.surname}`}</span>
                </div>
              </div>
              <div className="dropdown-wrapper">
                <BsThreeDotsVertical
                  className="friends-list-dots-icon"
                  onClick={() => toggleDropdown(request.sender.userId)}
                />
                {dropdownVisible === request.sender.userId && (
                  <div className="request-list-dropdown">
                    <FaCheck
                      className="dropdown-request-icon"
                      onClick={() => handleRequest(request.sender.userId, "accept")}
                    />
                    <FaTrash
                      className="dropdown-request-icon"
                      onClick={() => handleRequest(request.sender.userId, "reject")}
                    />
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No incoming requests.</div>
        )}
      </div>
    </div>
  );
};

export default memo(Index);
