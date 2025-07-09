import { memo, useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchFriends } from "../../../redux/slices/friendRequestsSlice";
import { API_URL } from "../../../config";
import { Spinner } from "reactstrap";
import { formatMessageDate } from "../../../utils/formatMessageDate";
import { getFormattedDateGroup } from "./getFormattedDateGroup";
import classNames from "classnames";
import { getShortName } from "../../../utils/userHelpers";

function Notifications() {
    const userId = localStorage.getItem("userId");
    const dispatch = useDispatch();

    const friends = useSelector((state) => state.friendRequests.friends);

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Arkadaş listesini Redux üzerinden çek ve güncelle
    useEffect(() => {
        if (userId) {
            dispatch(fetchFriends(userId)); 
        }
    }, [userId, dispatch]);

    // Bildirimleri çek
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await axios.get(`${API_URL}/notifications/${userId}/all`);
                setNotifications(res.data.notifications || []);
            } catch (err) {
                console.error("Bildirimler alınamadı:", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchNotifications();
    }, [userId]);

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "";
    };

    // Arkadaş mı kontrolü (Redux'daki friends listesinden)
    const isFriend = (senderId) => {
        return friends.some((f) => Number(f.userId) === Number(senderId));
    };

    // Arkadaşlık isteğini kabul et / reddet / sil
    const handleFriendRequest = async (senderId, action) => {
        try {
            await axios.put(`${API_URL}/friend-requests/${userId}/friend-request/${senderId}`, { action });
            // Bildirimlerden o isteği kaldır
            setNotifications((prev) =>
                prev.filter((notif) => !(notif.sender?.userId === senderId && notif.type === "friendRequest"))
            );
            // Arkadaş listesini Redux'dan tekrar çek
            dispatch(fetchFriends(userId));
        } catch (err) {
            console.error("Arkadaşlık isteği işlenirken hata:", err);
        }
    };

    const groupByDateCategory = (notifs) =>
        notifs.reduce((groups, notif) => {
            const key = getFormattedDateGroup(notif.createdAt);
            if (!groups[key]) groups[key] = [];
            groups[key].push(notif);
            return groups;
        }, {});

    const groupedNotifications = groupByDateCategory(notifications);
    const groupOrder = ["Bugün", "Dün", "Son 7 Gün", "Son 30 Gün", "30 Günden Önce"];

    return (
        <div className="px-3 pt-4">
            <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                    <h4 className="mb-4">Bildirimler</h4>
                </div>
            </div>

            {loading ? (
                <Spinner color="primary" />
            ) : notifications.length === 0 ? (
                <p>Henüz bildirimin yok.</p>
            ) : (
                groupOrder.map((groupKey) => {
                    const group = groupedNotifications[groupKey];
                    if (!group || group.length === 0) return null;

                    return (
                        <div key={groupKey} className="mb-4">
                            <h6 className="text-muted mb-2">{groupKey}</h6>
                            <ul className="list-unstyled">
                                {group.map((notif) => {
                                    const sender = notif.sender;
                                    if (!sender) return null;

                                    const fullName = [sender?.name, sender?.surname].filter(Boolean).join(" ");
                                    const shortName = getShortName(sender);
                                    const profileImageUrl = sender?.profileImage ? `${API_URL}/${sender.profileImage}` : null;

                                    const isFriendRequest = notif.type === "friendRequest";
                                    const friend = isFriend(notif.senderId);
                                    return (
                                        <li key={notif.id || notif.notificationId} className="mb-3 border-bottom pb-2">
                                            <div className="d-flex align-items-center">
                                                {profileImageUrl ? (
                                                    <div className="avatar-sm me-2 position-relative">
                                                        <img
                                                            src={profileImageUrl}
                                                            className="rounded-circle avatar-sm"
                                                            alt={fullName}
                                                            onError={handleImageError}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="avatar-sm me-2 position-relative">
                                                        <span
                                                            className={classNames(
                                                                "avatar-title",
                                                                "rounded-circle",
                                                                "text-uppercase",
                                                                "text-white"
                                                            )}
                                                            style={{ backgroundColor: sender?.color }}
                                                        >
                                                            {shortName}
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="flex-grow-1">
                                                    <strong>{fullName}</strong> @{sender?.username}
                                                    <p className="mb-1 text-muted font-size-14">
                                                        {notif.content}
                                                        <span className="text-muted ms-1">{formatMessageDate(notif.createdAt)}</span>
                                                    </p>

                                                {/* {isFriendRequest && (
                                                    friend ? (
                                                        <span className="text-success fw-semibold">
                                                            Arkadaş olundu
                                                        </span>
                                                    ) : (
                                                        <div>
                                                            <button
                                                                className="btn btn-sm btn-success me-2"
                                                                onClick={() => handleFriendRequest(notif.senderId, "accept")}
                                                            >
                                                                Onayla
                                                            </button>
                                                        </div>
                                                    )
                                                )} */}
                                                </div>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })
            )}
        </div>
    );
}

export default memo(Notifications);
