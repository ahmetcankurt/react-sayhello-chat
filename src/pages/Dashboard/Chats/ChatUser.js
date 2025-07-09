import { memo, useState } from "react";
import classnames from "classnames";
import { STATUS_TYPES } from "../../../constants";
import { getShortenedMessage } from "../../../utils/getShortenedMessage";
import { formatMessageDate } from "../../../utils/formatMessageDate";
import { API_URL } from "../../../config";
import { getShortName } from '../../../utils/userHelpers';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap";
import axios from "axios"; // axios ekledim
import { fetchArchivedMessages, fetchMessages } from "../../../redux/slices/messagesSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

const ChatUser = ({ user, setSelectedUser, refreshChats ,activeTab }) => {
  const fullName = [user?.name, user?.surname].filter(Boolean).join(" ");
  const [imageError, setImageError] = useState(false);
  const shortName = getShortName(user);
  const isOnline = user.status === STATUS_TYPES.ACTIVE;
  const isSelectedChat = setSelectedUser && setSelectedUser === user.contactId;
  const shortenedMessage = getShortenedMessage(user.lastMessage);

  const handleImageError = () => setImageError(true);

  const currentUserId = parseInt(localStorage.getItem("userId"), 10);

  const isMessageReadByOthers = user.messageStatuses?.some(
    (status) => status.userId !== currentUserId && status.isRead
  );

  const isLastMessageFromMe = user.lastMessageSender?.type === "me";
  const isLastMessageFromOtherUser = user.lastMessageSender?.type === "user";

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(!dropdownOpen);

  // Arşivleme işlemi
  const dispatch = useDispatch(); // Redux kullanıyorsanız, useDispatch'i ekley


  const handleArchive = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.post(`${API_URL}/archive`, {
        userId: currentUserId,
        archivedUserId: user.type === "user" ? user.contactId : null,
        archivedGroupId: user.type === "group" ? user.contactId : null,
      });

      Swal.fire({
        toast: true,
        position: "top-end", // sağ üst köşe
        icon: "success",
        title: `"${fullName}" arşivlendi`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Arşivleme başarılı olursa, kullanıcıyı state'ten çıkar
      dispatch({
        type: "messages/removeFromContacts",
        payload: {
          contactId: user.contactId,
          type: user.type
        },
      });

      // Arşiv listesini yenile
      dispatch(fetchArchivedMessages());

    } catch (error) {
      console.error("Arşivleme hatası:", error);
      alert("Arşivleme sırasında hata oluştu");
    }
  };

  const handleUnarchive = async (e) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_URL}/archive`, {
        data: {
          userId: currentUserId,
          archivedUserId: user.type === "user" ? user.contactId : null,
          archivedGroupId: user.type === "group" ? user.contactId : null,
        },
      });

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: `"${fullName}" arşivden çıkarıldı`,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      // Redux'tan arşivli listeden çıkar
      dispatch({
        type: "messages/removeFromContacts",
        payload: {
          contactId: user.contactId,
          type: user.type,
        },
      });

      // Normal listeyi yeniden getir
      dispatch(fetchMessages());
      dispatch(fetchArchivedMessages());
    } catch (error) {
      console.error("Arşivden çıkarma hatası:", error);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "Arşivden çıkarma sırasında bir hata oluştu",
      });
    }
  };



  return (
    <li className={classnames("position-relative", { active: isSelectedChat })}>
      <div className="d-flex px-3 mb-2">
        {/* Profil resmi */}
        <div className={classnames("chat-user-img", "align-self-center", "me-2", "ms-0", { online: isOnline })}>
          {user.profileImage && !imageError ? (
            <>
              <img
                src={`${API_URL}/${user.profileImage}`}
                className="rounded-circle avatar-sm"
                alt={fullName}
                onError={handleImageError}
              />
              {isOnline && <span className="user-status"></span>}
            </>
          ) : (
            <div className="avatar-sm">
              <span
                className={classnames(
                  "avatar-title",
                  "rounded-circle",
                  "text-uppercase",
                  "text-white",
                )}
                style={{ backgroundColor: user?.color }}
              >
                <span className="username user-select-none">{shortName}</span>
                {isOnline && <span className="user-status"></span>}
              </span>
            </div>
          )}
        </div>

        <div className="overflow-hidden">
          <div
            className="text-truncate mb-0 cursor-pointer"
            onClick={() => setSelectedUser({ id: user.contactId, userType: user.type })}
          >
            {fullName}
            <div className="text-muted font-size-12">
              {user.lastMessage ? (
                <>
                  {isLastMessageFromMe ? (
                    <span className="text-truncate d-block font-size-12">
                      <i
                        className={classnames("bx me-1", {
                          "bx-check-double": isMessageReadByOthers,
                          "bx-check": !isMessageReadByOthers,
                          "text-success": isMessageReadByOthers,
                          "text-muted": !isMessageReadByOthers,
                        })}
                      />
                      {shortenedMessage}
                    </span>
                  ) : (
                    <span
                      className="text-truncate d-block font-size-12"
                      style={{ fontWeight: user?.messageStatuses?.isRead ? "normal" : "bold" }}
                    >
                      {(user.type === "user" && isLastMessageFromOtherUser) ? (
                        <div>{shortenedMessage}</div>
                      ) : (
                        <>
                          <span className="text-muted font-size-12">
                            {user.lastMessageSender?.name || ""} {user.lastMessageSender?.surname || ""}
                          </span>
                          <span className="mx-1 text-muted font-size-12">:</span>
                          <span className="text-muted font-size-12">
                            {user.lastMessageSender?.type === "me" ? "Sen" : ""}
                            {shortenedMessage}
                          </span>
                        </>
                      )}
                    </span>
                  )}
                </>
              ) : (
                <span className="text-muted font-size-12 fst-italic">
                  {user.type === "group" ? "Grup oluşturuldu" : "Henüz mesaj yok"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Sağ tarafta tarih */}
        <div className="ms-auto text-end">
          {(user.lastMessage || (user.type === "group" && user.createdAt)) && (
            <p className="mb-0 font-size-11 text-muted">
              {user.type === "group" && <span className="me-1 text-muted font-size-10">(Grup)</span>}
              {formatMessageDate(user.lastMessage ? user.lastMessageCreatedAt : user.createdAt)}
            </p>
          )}
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle tag="a" className="text-muted p-0 cursor-pointer">
              <i className="bx bx-chevron-down align-middle font-size-18 text-primary "></i>
            </DropdownToggle>
            <DropdownMenu container="body">
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                onClick={(e) => {
                  e.stopPropagation();
                  // handleBlockUser(user.contactId);
                }}
              >
                Engelle
                <i className="bx bx-block ms-2 text-muted"></i>
              </DropdownItem>

              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                onClick={(e) => {
                  e.stopPropagation();
                  // handleDeleteFriend(user.contactId);
                }}
              >
                Arkadaşlıktan Çıkar
                <i className="bx bx-user-x ms-2 text-muted"></i>
              </DropdownItem>

              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                onClick={(e) => {
                  e.stopPropagation();
                  // handleClearChat(user.contactId);
                }}
              >
                Sohbeti Temizle
                <i className="bx bx-eraser ms-2 text-muted"></i>
              </DropdownItem>

              {activeTab === "acrhive" ? (
                <DropdownItem
                  className="d-flex align-items-center justify-content-between"
                  onClick={handleUnarchive}
                >
                  Arşivden Çıkar
                  <i className="bx bx-archive-out align-middle text-muted"></i>
                </DropdownItem>
              ) : (
                <DropdownItem
                  className="d-flex align-items-center justify-content-between"
                  onClick={handleArchive}
                >
                  Arşivle
                  <i className="bx bx-archive-in align-middle text-muted"></i>
                </DropdownItem>
              )}

              <DropdownItem
                className="d-flex align-items-center justify-content-between text-danger"
                onClick={(e) => {
                  e.stopPropagation();
                  // handleDeleteLastMessage(user.contactId);
                }}
              >
                Mesajı Sil
                <i className="bx bx-message-square-x ms-2 text-danger"></i>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </li>
  );
};

export default memo(ChatUser);
