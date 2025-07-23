import { useState, useRef, useEffect } from "react";
import {
  Modal, ModalHeader, ModalBody, ModalFooter,
  Button, Input, Label, FormGroup
} from "reactstrap";
import classnames from "classnames";
import Swal from "sweetalert2";
import { API_URL } from "../../../config";

const EditGroupModal = ({ isOpen, toggle, groupData, onUpdate }) => {
  const [groupName, setGroupName] = useState(groupData?.name || "");
  const [description, setDescription] = useState(groupData?.description || "");
  const [groupImage, setGroupImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(groupData?.groupImage ? `${API_URL}/${groupData.groupImage}` : null);
  const [imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setGroupImage(file);
      setImageError(false);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!groupName.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Grup adı boş bırakılamaz.",
      });
    }

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("description", description);
    if (groupImage) {
      formData.append("groupImage", groupImage);
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/groups/${groupData.groupId}`, {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Güncelleme başarısız");
      }

      Swal.fire({
        icon: "success",
        title: "Grup bilgileri güncellendi",
        timer: 1500,
        showConfirmButton: false,
      });

      if (onUpdate) onUpdate(); // Refresh etmek istiyorsan
      toggle();
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: error.message || "Grup güncellenemedi",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setGroupName(groupData?.name || "");
      setDescription(groupData?.description || "");
      setPreviewImage(groupData?.groupImage ? `${API_URL}/${groupData.groupImage}` : null);
      setGroupImage(null);
      setImageError(false);
    }
  }, [isOpen, groupData]);

  return (
    <Modal isOpen={isOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>Grup Bilgilerini Düzenle</ModalHeader>
      <ModalBody>
        <FormGroup className="text-center">
          <div className="profile-user">
            {previewImage && !imageError ? (
              <img
                src={previewImage}
                className="rounded-circle avatar-xl img-thumbnail"
                alt="preview"
                onError={() => setImageError(true)}
              />
            ) : (
              <div
                className="rounded-circle avatar-xl img-thumbnail d-flex align-items-center justify-content-center"
                style={{ backgroundColor: "#f5f5f5" }}
              >
                <i className="fas fa-users fa-2x text-muted"></i>
              </div>
            )}

            <div className="avatar-xs p-0 rounded-circle profile-photo-edit" style={{ marginTop: "-25px", cursor: "pointer" }}>
              <Label className="profile-photo-edit avatar-xs">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  innerRef={fileInputRef}
                  style={{ display: "none" }}
                />
                <span className="avatar-title rounded-circle bg-light text-body">
                  <i className="bx bxs-camera"></i>
                </span>
              </Label>
            </div>
          </div>
        </FormGroup>

        <FormGroup>
          <Label>Grup Adı</Label>
          <Input
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            disabled={loading}
          />
        </FormGroup>

        <FormGroup>
          <Label>Açıklama</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={loading}
          />
        </FormGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Kaydediliyor..." : "Kaydet"}
        </Button>
        <Button color="secondary" onClick={toggle} disabled={loading}>
          İptal
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default EditGroupModal;
