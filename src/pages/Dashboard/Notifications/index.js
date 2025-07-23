import { memo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Spinner } from "reactstrap";
import classNames from "classnames";

import { API_URL } from "../../../config";
import { formatMessageDate } from "../../../utils/formatMessageDate";
import { getFormattedDateGroup } from "./getFormattedDateGroup";
import { getShortName } from "../../../utils/userHelpers";
import AppSimpleBar from "../../../components/AppSimpleBar";

import { fetchFriends } from "../../../redux/slices/friendRequestsSlice";
import {
    fetchNotifications,
    removeNotificationBySenderId,
} from "../../../redux/slices/notificationsSlice";
import DelayedImage from "../../../components/DelayedImage";

function Notifications() {
    const userId = localStorage.getItem("userId");
    const dispatch = useDispatch();

    const { list: notifications, status } = useSelector((state) => state.notifications);
    const friends = useSelector((state) => state.friendRequests.friends);
    const loading = status === "loading";

    // Arkadaş listesi sadece bir kere çekilir
    useEffect(() => {
        if (userId) {
            dispatch(fetchFriends(userId));
        }
    }, [userId, dispatch]);

    // Bildirimleri sadece bir kere çek
    useEffect(() => {
        if (userId && status === "idle") {
            dispatch(fetchNotifications(userId));
        }
    }, [userId, dispatch, status]);

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = "";
    };

    const isFriend = (senderId) => {
        return friends.some((f) => Number(f.userId) === Number(senderId));
    };

    const handleFriendRequest = async (senderId, action) => {
        try {
            await axios.put(`${API_URL}/friend-requests/${userId}/friend-request/${senderId}`, { action });

            // Redux içinden bildirimi kaldır
            dispatch(removeNotificationBySenderId(senderId));

            // Arkadaş listesini güncelle
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
        <div className="pt-4">
            <div className="d-flex align-items-start px-3">
                <div className="flex-grow-1">
                    <h4 className="mb-4">Bildirimler</h4>
                </div>
            </div>
            <AppSimpleBar className="px-3" style={{ maxHeight: "calc(100vh - 130px)" }}>
                {loading ? (
                    <Spinner color="primary" />
                ) : notifications.length === 0 ? (
                    <p>Henüz bildirimin yok.</p>
                ) : (
                    groupOrder.map((groupKey) => {
                        const group = groupedNotifications[groupKey];
                        if (!group || group.length === 0) return null;

                        return (
                            <div key={groupKey}>
                                <h6 className="text-white font-size-12 bg-primary d-inline-block p-1 px-2 rounded-4">
                                    {groupKey}
                                </h6>
                                <ul className="list-unstyled">
                                    {group.map((notif) => {
                                        const sender = notif.sender;
                                        if (!sender) return null;

                                        const fullName = [sender?.name, sender?.surname].filter(Boolean).join(" ");
                                        const shortName = getShortName(sender);
                                        const profileImageUrl = sender?.profileImage
                                            ? `${API_URL}/${sender.profileImage}`
                                            : null;

                                        const isFriendRequest = notif.type === "friendRequest";
                                        const friend = isFriend(notif.senderId);

                                        return (
                                            <li key={notif.id || notif.notificationId} className="mb-3 pb-2">
                                                <div className="d-flex align-items-center">
                                                    {profileImageUrl ? (
                                                        <div className="avatar-sm me-2 position-relative">
                                                            <DelayedImage
                                                                src={profileImageUrl}
                                                                alt={fullName}
                                                                className="rounded-circle avatar-sm"
                                                                onError={handleImageError}
                                                                fallback={
                                                                    <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center">
                                                                        <i className="bx bx-user text-muted"></i>
                                                                    </div>
                                                                }
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
                                                            <span className="text-muted ms-1">
                                                                {formatMessageDate(notif.createdAt)}
                                                            </span>
                                                        </p>

                                                        {isFriendRequest && (
                                                            friend ? (
                                                                <span className="text-success fw-semibold">
                                                                    Arkadaş olundu
                                                                </span>
                                                            ) : (
                                                                <div>
                                                                    <button
                                                                        className="btn btn-sm btn-success me-2"
                                                                        onClick={() =>
                                                                            handleFriendRequest(notif.senderId, "accept")
                                                                        }
                                                                    >
                                                                        Onayla
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-secondary"
                                                                        onClick={() =>
                                                                            handleFriendRequest(notif.senderId, "decline")
                                                                        }
                                                                    >
                                                                        Reddet
                                                                    </button>
                                                                </div>
                                                            )
                                                        )}
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
            </AppSimpleBar>
        </div>
    );
}

export default memo(Notifications);
