import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Notifications.css";
import { io } from "socket.io-client";  // Socket.IO istemcisi
const socket = io("http://localhost:3000"); // Socket.IO sunucusuna bağlanıyoruz
const Notifications = ({ selectedUser })  => {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    // Bildirimleri yükle
    const fetchNotifications = () => {
      axios
        .get(`http://localhost:3000/notifications/${userId}`)
        .then((response) => {
          const notificationsData = response?.data.notifications;
          setNotifications(notificationsData);

          if (notificationsData.length > 0) {
            // Bildirimleri okundu olarak işaretle
            notificationsData.forEach((notification) => {
              markAsRead(notification.notificationId); // Bildirimi okundu olarak işaretle
            });

            // 5 saniye sonra bildirimleri temizle
            setTimeout(() => {
              setNotifications([]); // Bildirimleri ekrandan kaldır
            }, 5000); // 5 saniye sonra okundu olarak işaretle ve temizle
          }
        })
        .catch((error) => {
          console.error("Kullanıcı bilgileri alınırken hata:", error);
        });
    };

    // İlk başta bildirimleri yükleyelim
    fetchNotifications();

    // Her 5 saniyede bir bildirimleri kontrol et
    const intervalId = setInterval(fetchNotifications, 5000);

    // Temizleme işlemi (component unmount olduğunda interval'ı temizle)
    return () => clearInterval(intervalId);
  }, [userId]);

  // Bildirimi okundu olarak işaretleme fonksiyonu
  const markAsRead = (notificationId) => {
    console.log("notificationId", notificationId);
    axios
      .put(`http://localhost:3000/notifications/${notificationId}/read`)
      .then((response) => {
        console.log(response.data.message); // Başarı mesajını kontrol et
      })
      .catch((error) => {
        console.error("Okundu olarak işaretleme hatası:", error);
      });
  };

   useEffect(() => {
      socket.on('newNotification', (message) => {
          setNotifications(prevMessages => [...prevMessages, message]); 
          console.log(prevMessages => [...prevMessages, message])
      });
      return () => {
        socket.off('newNotification'); // Temizleme
      };
    }, [userId]); // `userId` ve `selectedUser` bağımlılık olarak eklenmeli

    
   useEffect(() => {
    socket.on('newNotificationMessage', (message) => {
        setNotifications(prevMessages => [...prevMessages, message]); 
        console.log(prevMessages => [...prevMessages, message])
    });
    return () => {
      socket.off('newNotificationMessage'); 
    };
  }, [userId]);

  return !selectedUser && (
    <div className="notification-container">
      {notifications.map((notification, index) => (
        <div key={index} className="notification-card">
          <img
            src={`http://localhost:3000/${notification.sender.profileImage}` || "https://via.placeholder.com/50"}
            alt="Avatar"
            className="notification-avatar"
          />
          <div className="notification-content">
            <span>{notification.content}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notifications;