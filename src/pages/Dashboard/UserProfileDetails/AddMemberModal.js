import { memo, useState } from "react";
import classnames from "classnames";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Label,
  FormGroup,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { API_URL } from "../../../config";
import { getShortName } from "../../../utils/userHelpers";
import Swal from "sweetalert2";
import { addGroupMembers } from "../../../redux/slices/selectedUser";

const AddMemberModal = ({ isOpen, toggle, groupId, onMembersAdded }) => {
  const dispatch = useDispatch();
  const { friends, status } = useSelector((state) => state.friendRequests);
  const userInfo = useSelector((state) => state.selectedUser.userInfo);

  const groupMembers = userInfo?.members || [];
  const groupMemberUserIds = groupMembers.map(
    (m) => m.member?.userId || m.userId
  );

  // Gruba dahil olmayan arkadaşları filtrele
  const friendsNotInGroup = friends.filter(
    (friend) => !groupMemberUserIds.includes(friend.userId)
  );

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [imageErrorMap, setImageErrorMap] = useState({});

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAddMembers = async () => {
    if (selectedUsers.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Üye seçimi yapılmadı",
        text: "Lütfen en az bir arkadaş seçin.",
      });
    }

    setLoadingAdd(true);
    try {
      console.log("Gönderilen userIds:", selectedUsers);

      const response = await axios.post(
        `${API_URL}/groups/${groupId}/members`,
        { userIds: selectedUsers },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );


      if (response.data.addedUsers) {
        dispatch(addGroupMembers(response.data.addedUsers));
      }

      Swal.fire({
        icon: "success",
        title: "Üyeler eklendi",
        timer: 1500,
        showConfirmButton: false,
      });

      setSelectedUsers([]);
      // İstersen burada ekleme sonrası callback çağırabilirsin
      if (onMembersAdded) onMembersAdded();
      toggle();
    } catch (err) {
      console.error(err.response?.data || err.message);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "Üyeler eklenirken bir sorun oluştu.",
      });
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleImageError = (userId) => {
    setImageErrorMap((prev) => ({ ...prev, [userId]: true }));
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Arkadaşlarından Üye Seç</ModalHeader>

      <ModalBody>
        {status === "loading" && <p>Arkadaşlar yükleniyor...</p>}
        {status === "failed" && (
          <p className="text-danger">Arkadaşlar yüklenirken hata oluştu.</p>
        )}
        {status === "succeeded" && friendsNotInGroup.length === 0 && (
          <p>Eklenebilecek arkadaşınız yok.</p>
        )}

        {status === "succeeded" && friendsNotInGroup.length > 0 && (
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {friendsNotInGroup.map((friend) => {
              const shortName = getShortName(friend);
              const fullName = [friend.name, friend.surname]
                .filter(Boolean)
                .join(" ");

              const isImageError = imageErrorMap[friend.userId] || false;

              return (
                <FormGroup check key={friend.userId} className="mb-2">
                  <Label check className="d-flex align-items-center gap-3">
                    <Input
                      type="checkbox"
                      checked={selectedUsers.includes(friend.userId)}
                      onChange={() => handleCheckboxChange(friend.userId)}
                      disabled={loadingAdd}
                    />
                    <div className="avatar-sm">
                      {friend.profileImage && !isImageError ? (
                        <img
                          src={`${API_URL}/${friend.profileImage}`}
                          alt={fullName}
                          className="img-fluid rounded-circle"
                          onError={() => handleImageError(friend.userId)}
                        />
                      ) : (
                        <span
                          className={classnames(
                            "avatar-title",
                            "rounded-circle",
                            "text-uppercase",
                            "text-white"
                          )}
                          style={{ backgroundColor: friend?.color || "#777" }}
                        >
                          {shortName}
                        </span>
                      )}
                    </div>
                    <span>
                      {fullName} ({friend.username})
                    </span>
                  </Label>
                </FormGroup>
              );
            })}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button color="primary" onClick={handleAddMembers} disabled={loadingAdd}>
          {loadingAdd ? "Ekleniyor..." : "Ekle"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={loadingAdd}>
          Vazgeç
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default memo(AddMemberModal);
