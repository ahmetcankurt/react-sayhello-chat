import React, { memo, useState } from "react";
import classnames from "classnames";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { API_URL } from "../../../config";
import { deleteFriend } from "../../../redux/slices/friendRequestsSlice";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2"; // Swal'ı import ediyoruz
import { getShortName } from "../../../utils/userHelpers";
import axios from "axios"; // Axios import ettik

const ContactItem = ({ contact, setSelectedUser }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  const toggle = () => setDropdownOpen(!dropdownOpen);
  const handleImageError = () => setImageError(true);
  const fullName = [contact?.name, contact?.surname].filter(Boolean).join(' ');
  const shortName = getShortName(contact);
  const dispatch = useDispatch();

  // Kullanıcıyı engelleme fonksiyonu
  const handleBlockUser = async (event, blockerId, blockedId) => {
    event.stopPropagation(); // Menü kapanmasını engellemek için

    Swal.fire({
      title: "Emin misiniz?",
      text: "Bu kişiyi engellemek istiyor musunuz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, engelle!",
      cancelButtonText: "İptal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(
            `${API_URL}/user-blocked/${blockerId}/block/${blockedId}`
          );
          Swal.fire("Engellendi!", "Kullanıcı başarıyla engellendi.", "success");
        } catch (error) {
          console.error("Error blocking user", error);
          Swal.fire("Hata!", "Kullanıcı engellenirken bir hata oluştu.", "error");
        }
      }
    });
  };

  const handleDeleteFriend = async (event, friendId) => {
    event.stopPropagation(); // Menü kapanmasını engellemek için
    Swal.fire({
      title: "Emin misiniz?",
      text: "Bu kişiyi arkadaş listenizden silmek istiyor musunuz?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "İptal",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const userId = localStorage.getItem("userId"); // Kullanıcının ID'sini alıyoruz
        try {
          await dispatch(deleteFriend({ userId, friendId }));
          console.log("Dispatch finished");
          Swal.fire("Silindi!", "Arkadaşınız başarıyla silindi.", "success"); // Onay mesajı
        } catch (error) {
          console.error("Error removing friend", error);
          Swal.fire("Hata!", "Arkadaş silinirken bir hata oluştu.", "error"); // Hata mesajı
        }
      }
    });
  };

  return (
    <li className="contact-list-item">
      <div className="d-flex align-items-center">
        <div className="flex-shrink-0 me-2">
          <div className="avatar-sm" onClick={() => setSelectedUser({ id: contact.userId, userType: contact.type })} >
            {contact.profileImage && !imageError ? (
              <img
                src={`${API_URL}/${contact.profileImage}`}
                alt={fullName}
                className="img-fluid rounded-circle"
                onError={handleImageError}
              />
            ) : (
              <span
                className={classnames(
                  "avatar-title",
                  "rounded-circle",
                  "text-uppercase",
                  "text-white",
                  "user-select-none"
                )}
                style={{ backgroundColor: contact?.color }}
              >
                {shortName}
              </span>
            )}
          </div>
        </div>
        <div className="flex-grow-1" onClick={() => setSelectedUser({ id: contact.userId, userType: contact.type })}>
          <h5 className="font-size-14 m-0">{fullName}</h5>
        </div>
        <div className="flex-shrink-0">
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle tag="a" className="text-mute">
              <i className="bx bx-dots-vertical-rounded align-middle"></i>
            </DropdownToggle>
            <DropdownMenu >
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                onClick={(event) =>
                  handleBlockUser(event, localStorage.getItem("userId"), contact.userId)
                }
              >
                Engelle
                <i className="bx bx-block ms-2 text-muted"></i>
              </DropdownItem>
              <DropdownItem
                className="d-flex align-items-center justify-content-between"
                onClick={(event) => handleDeleteFriend(event, contact.userId)}
              >
                Arkadaşlıktan Çıkar
                <i className="bx bx-trash ms-2 text-muted"></i>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </li>
  );
};

export default memo(ContactItem);