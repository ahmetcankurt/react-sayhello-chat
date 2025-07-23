import { memo, useEffect, useState, useRef } from "react";
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
    Spinner,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchFriends } from "../../../redux/slices/friendRequestsSlice";
import axios from "axios";
import { API_URL } from "../../../config";
import { getShortName } from "../../../utils/userHelpers";
import Swal from "sweetalert2";
import AppSimpleBar from "../../../components/AppSimpleBar";

const GroupCreateModal = ({ isOpen, toggle }) => {
    const dispatch = useDispatch();
    const userId = parseInt(localStorage.getItem("userId"));
    const { friends, status } = useSelector((state) => state.friendRequests);

    const [groupName, setGroupName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [loadingCreate, setLoadingCreate] = useState(false);

    // Grup resmi ve önizleme için state
    const [groupImage, setGroupImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [imageError, setImageError] = useState(false);

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

    const handleCheckboxChange = (id) => {
        setSelectedUsers((prev) =>
            prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
        );
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedUsers.length === 0) {
            return Swal.fire({
                icon: "warning",
                title: "Eksik Bilgi",
                text: "Lütfen grup adı girin ve en az bir arkadaş seçin.",
            });
        }

        setLoadingCreate(true);

        const members = [userId, ...selectedUsers.filter((uid) => uid !== userId)];

        try {
            const formData = new FormData();
            formData.append("name", groupName);
            formData.append("members", JSON.stringify(members));
            if (groupImage) {
                formData.append("groupImage", groupImage);
            }

            await axios.post(`${API_URL}/groups`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            Swal.fire({
                icon: "success",
                title: "Grup oluşturuldu",
                text: "Grubunuz başarıyla oluşturuldu.",
                timer: 2000,
                showConfirmButton: false,
            });

            // Temizleme
            setGroupName("");
            setSelectedUsers([]);
            setGroupImage(null);
            setPreviewImage(null);
            setImageError(false);
            toggle();
        } catch (error) {
            console.error("Grup oluşturma hatası:", error);
            Swal.fire({
                icon: "error",
                title: "Hata",
                text: "Grup oluşturulurken bir hata oluştu.",
            });
        } finally {
            setLoadingCreate(false);
        }
    };

    useEffect(() => {
        if (userId && isOpen) {
            dispatch(fetchFriends(userId));
        }
    }, [dispatch, userId, isOpen]);

    const handleImageError = () => setImageError(true);

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader className="bg-primary" toggle={toggle}>
                <div className="modal-title-custom text-white font-size-16">
                    Yeni Grup Oluştur
                </div>
            </ModalHeader>

            <ModalBody>
                <FormGroup className="text-center">
                    <div className=" profile-user">
                        {previewImage && !imageError ? (
                            <img
                                src={previewImage}
                                className="rounded-circle avatar-xl img-thumbnail user-profile-image"
                                alt="group-preview"
                                onError={handleImageError}
                            />
                        ) : (
                            <div
                                className="rounded-circle avatar-xl img-thumbnail bg-light d-flex align-items-center justify-content-center"
                                style={{ backgroundColor: "#f5f5f5", margin: "0 auto" }}
                            >
                                <i className="fas fa-users fa-2x text-muted"></i>
                            </div>
                        )}

                        <div
                            className="avatar-xs p-0 rounded-circle profile-photo-edit"
                            style={{ cursor: "pointer", margin: "0 auto", marginTop: "-25px" }}
                        >
                            <input
                                ref={fileInputRef}
                                id="group-img-file-input"
                                type="file"
                                accept="image/png, image/jpeg"
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                                disabled={loadingCreate}
                            />
                            <Label htmlFor="group-img-file-input" className="profile-photo-edit avatar-xs" style={{ cursor: "pointer" }}>
                                <span className="avatar-title border shadow-lg rounded-circle bg-light text-body">
                                    <i className="bx bxs-camera"></i>
                                </span>
                            </Label>
                        </div>
                    </div>
                    <div className="mt-2 text-muted">Grup resmi (isteğe bağlı)</div>
                </FormGroup>

                <FormGroup>
                    <Label>Grup Adı</Label>
                    <Input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Grup adı girin"
                        disabled={loadingCreate}
                    />
                </FormGroup>

                <hr />

                <Label>Arkadaşlar</Label>
                {status === "loading" && <Spinner color="primary" />}
                {status === "failed" && (
                    <p className="text-danger">Arkadaşlar yüklenirken hata oluştu.</p>
                )}
                {status === "succeeded" && friends.length === 0 && (
                    <p>Hiç arkadaşınız yok.</p>
                )}

                <AppSimpleBar style={{ maxHeight: "400px" }}>
                    {status === "succeeded" &&
                        friends.length > 0 &&
                        friends.map((friend) => {
                            const shortName = getShortName(friend);
                            const fullName = [friend.name, friend.surname]
                                .filter(Boolean)
                                .join(" ");

                            return (
                                <FormGroup check key={friend.userId}>
                                    <Label
                                        check
                                        className="d-flex align-items-center gap-3 mb-2"
                                    >
                                        <Input
                                            type="checkbox"
                                            checked={selectedUsers.includes(friend.userId)}
                                            onChange={() => handleCheckboxChange(friend.userId)}
                                            disabled={loadingCreate}
                                        />
                                        <div className="avatar-sm">
                                            {friend.profileImage && !imageError ? (
                                                <img
                                                    src={`${API_URL}/${friend.profileImage}`}
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
                                                        "text-white"
                                                    )}
                                                    style={{ backgroundColor: friend?.color || "#777" }}
                                                >
                                                    {shortName}
                                                </span>
                                            )}
                                        </div>
                                        {fullName} ({friend.username})
                                    </Label>
                                </FormGroup>
                            );
                        })} 
                </AppSimpleBar>
            </ModalBody>

            <ModalFooter>
                <Button color="primary" onClick={handleCreateGroup} disabled={loadingCreate}>
                    {loadingCreate ? "Oluşturuluyor..." : "Oluştur"}
                </Button>
                <Button color="secondary" onClick={toggle} disabled={loadingCreate}>
                    Vazgeç
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default memo(GroupCreateModal);
