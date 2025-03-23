import React, { useState, useEffect, memo } from "react";
import axios from "axios";
import "./Notifications.css";
import { io } from "socket.io-client";  // Socket.IO istemcisi
import { API_URL } from "../config";
import UserImage from "./UserImage";
const socket = io(API_URL, { autoConnect: false }); // Socket.IO bağlantısı
const Notifications = ({ selectedUser }) => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Bildirimleri yükle
    const fetchNotifications = () => {
      axios
        .get(`${API_URL}/notifications/${userId}`)
        .then((response) => {
          const notificationsData = response?.data.notifications;
          setNotifications(notificationsData);

          if (notificationsData.length > 0) {
            notificationsData.forEach((notification) => {
              markAsRead(notification.notificationId); 
            });

            setTimeout(() => {
              setNotifications([]); 
            }, 5000); 
          }
        })
        .catch((error) => {
        });
    };

    fetchNotifications();

    const intervalId = setInterval(fetchNotifications, 5000);

    return () => clearInterval(intervalId);
  }, [userId]);

  // Bildirimi okundu olarak işaretleme fonksiyonu
  const markAsRead = (notificationId) => {
    axios.put(`${API_URL}/notifications/${notificationId}/read`)
  };

  useEffect(() => {
    socket.on('newNotification', (message) => {
      setNotifications(prevMessages => [...prevMessages, message]);
    });
    return () => {
      socket.off('newNotification'); // Temizleme
    };
  }, [userId]); // `userId` ve `selectedUser` bağımlılık olarak eklenmeli


  useEffect(() => {
    socket.on('newNotificationMessage', (message) => {
      setNotifications(prevMessages => [...prevMessages, message]);
    });
    return () => {
      socket.off('newNotificationMessage');
    };
  }, [userId]);

  return !selectedUser && (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div key={index} className="notification-card">
          <UserImage height={40} width={40} src={notification.sender.profileImage} />
          <div className="notification-content">
            <span>{notification.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(Notifications)