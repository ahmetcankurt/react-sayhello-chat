import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL } from "../config";
import "./Notifications.css";
const socketRef = io(API_URL, { autoConnect: false });

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const timeoutRefs = useRef({});
  const animationRefs = useRef({});
  const userId = useRef(localStorage.getItem("userId"));

  // MARK: - Fetch Notifications
  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/notifications/${userId.current}`);
      const newNotifications = data?.notifications || [];

      console.log("Yeni Bildirimler:", data);

      if (newNotifications.length > 0) {
        setNotifications(prev => {
          const existingIds = prev.map(n => n.notificationId);
          const uniqueNew = newNotifications.filter(n => !existingIds.includes(n.notificationId));
          return [...prev, ...uniqueNew];
        });

        newNotifications.forEach(n => {
          markAsRead(n.notificationId);
          scheduleClearTimeout(n.notificationId);
        });
      }
    } catch (err) {
      console.error("Bildirimler alınamadı:", err);
    }
  }, []);

  // MARK: - Read
  const markAsRead = useCallback((notificationId) => {
    axios.put(`${API_URL}/notifications/${notificationId}/read`).catch(console.error);
  }, []);

  // MARK: - Socket Notification
  const handleNewNotification = useCallback((notification) => {
    setNotifications(prev => [...prev, notification]);
    markAsRead(notification.notificationId);
    scheduleClearTimeout(notification.notificationId);
  }, [ markAsRead ]);

  // MARK: - Timeout Helpers
  const clearTimeoutForNotification = (notificationId) => {
    if (timeoutRefs.current[notificationId]) {
      clearTimeout(timeoutRefs.current[notificationId]);
      delete timeoutRefs.current[notificationId];
    }
    if (animationRefs.current[notificationId]) {
      cancelAnimationFrame(animationRefs.current[notificationId]);
      delete animationRefs.current[notificationId];
    }
  };

  const scheduleClearTimeout = (notificationId) => {
    clearTimeoutForNotification(notificationId);

    timeoutRefs.current[notificationId] = setTimeout(() => {
      // Start exit animation
      const notificationElement = document.querySelector(`.notification-card[data-id="${notificationId}"]`);
      if (notificationElement) {
        notificationElement.classList.add('exiting');

        // Remove after animation completes
        const animationDuration = 300; // Should match CSS animation duration
        setTimeout(() => {
          setNotifications(prev =>
            prev.filter(n => n.notificationId !== notificationId)
          );
          delete timeoutRefs.current[notificationId];
        }, animationDuration);
      } else {
        // Fallback if element not found
        setNotifications(prev =>
          prev.filter(n => n.notificationId !== notificationId)
        );
        delete timeoutRefs.current[notificationId];
      }
    }, 7000);
  };

  // MARK: - Image error
  const handleImageError = useCallback((notificationId) => {
    setImageErrors(prev => ({ ...prev, [notificationId]: true }));
  }, []);

  // MARK: - Avatar Color
  const colors = useRef([
    "bg-primary", "bg-danger", "bg-info",
    "bg-warning", "bg-secondary", "bg-pink", "bg-purple"
  ]);

  const getRandomColor = useCallback((str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors.current[Math.abs(hash) % colors.current.length];
  }, []);

  // MARK: - Effects
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 7000);
    return () => {
      clearInterval(interval);
      Object.values(timeoutRefs.current).forEach(clearTimeout);
      Object.values(animationRefs.current).forEach(cancelAnimationFrame);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    socketRef.on("newNotificationMessage", handleNewNotification);
    return () => {
      socketRef.off("newNotificationMessage", handleNewNotification);
    };
  }, [handleNewNotification]);

  const truncateText = (text, maxLength = 30) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="notification-container">
      {notifications.map((n) => {
        const shortName = `${n.sender.name?.[0] || ''}${n.sender.surname?.[0] || ''}`.toUpperCase();
        const isValidImage = n.sender.profileImage && typeof n.sender.profileImage === "string" && !imageErrors[n.notificationId];
        const bgColor = getRandomColor(n.sender.name + n.sender.surname);
        const truncatedContent = truncateText(n.content);
        const username = n.sender.username;

        return (
          <div
            key={n.notificationId}
            className="notification-card entering"
            data-id={n.notificationId}
          >
            {isValidImage ? (
              <img
                src={`${API_URL}/${n.sender.profileImage}`}
                alt="User"
                onError={() => handleImageError(n.notificationId)}
                className="notification-avatar"
              />
            ) : (
              <span className={`short-name-avatar ${bgColor}`}>
                {shortName}
              </span>
            )}
            <div className="notification-content">
              <p className="p-0 m-0">@{username}</p>
              <span>{truncatedContent}</span>
            </div>
          </div>
        )
      })}
    </div>
  );
};

export default memo(Notifications);