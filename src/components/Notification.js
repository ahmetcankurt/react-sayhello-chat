import React, { useState, useEffect, useCallback, useRef, memo } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL } from "../config";
import { COLORS } from "../constants/bgShortColor";
import "./Notifications.css";

const socket = io(API_URL, { autoConnect: false });

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const timeoutRefs = useRef({});
  const userId = useRef(localStorage.getItem("userId"));
  const sound = useRef(new Audio('../assets/sound/notification-sound.mp3'));

  const fetchNotifications = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API_URL}/notifications/${userId.current}`);
      const newNotifs = data?.notifications || [];

      if (newNotifs.length) {
        setNotifications(prev => {
          const existing = new Set(prev.map(n => n.notificationId));
          const unique = newNotifs.filter(n => !existing.has(n.notificationId));
          unique.forEach(n => {
            markAsRead(n.notificationId);
            scheduleRemoval(n.notificationId);
          });
          return [...prev, ...unique];
        });
      }
    } catch (err) {
      console.error("Bildirimler alınamadı:", err);
    }
  }, []);

  const markAsRead = useCallback(id => {
    axios.put(`${API_URL}/notifications/${id}/read`).catch(console.error);
  }, []);

  const scheduleRemoval = useCallback(id => {
    clearTimeout(timeoutRefs.current[id]);
    timeoutRefs.current[id] = setTimeout(() => {
      document.querySelector(`.notification-card[data-id="${id}"]`)?.classList.add('exiting');
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.notificationId !== id));
        delete timeoutRefs.current[id];
      }, 300);
    }, 7000);
  }, []);

  const handleNewNotification = useCallback(notification => {
    setNotifications(prev => [...prev, notification]);
    markAsRead(notification.notificationId);
    scheduleRemoval(notification.notificationId);
    
    // Sesin çalınması için önce bir kullanıcı etkileşimi gerektirebilir
    if (sound.current) {
      sound.current.play().catch(err => {
        console.error("Bildirim sesi çalınamadı:", err);
      });
    }
  }, [markAsRead, scheduleRemoval]);

  const handleImageError = useCallback(id => {
    setImageErrors(prev => ({ ...prev, [id]: true }));
  }, []);

  const getBgColor = useCallback(str => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COLORS[Math.abs(hash) % COLORS.length];
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 7000);
    return () => {
      clearInterval(interval);
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, [fetchNotifications]);

  useEffect(() => {
    socket.on("newNotificationMessage", handleNewNotification);
    return () => socket.off("newNotificationMessage", handleNewNotification);
  }, [handleNewNotification]);

  return (
    <div className="notification-container">
      {notifications.map(({ notificationId, sender, content }) => {
        const shortName = `${sender.name?.[0] || ''}${sender.surname?.[0] || ''}`.toUpperCase();
        const hasImage = sender.profileImage && typeof sender.profileImage === "string" && !imageErrors[notificationId];
        const bgColor = getBgColor(sender.name + sender.surname);

        return (
          <div key={notificationId} className="notification-card entering" data-id={notificationId}>
            {hasImage ? (
              <img
                src={`${API_URL}/${sender.profileImage}`}
                alt="User"
                onError={() => handleImageError(notificationId)}
                className="notification-avatar"
              />
            ) : (
              <span className={`short-name-avatar ${bgColor}`}>
                {shortName}
              </span>
            )}
            <div className="notification-content">
              <p className="p-0 m-0">@{sender.username}</p>
              <span>{content}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default memo(Notifications);