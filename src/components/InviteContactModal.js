import { memo, useState, useCallback } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Input,
} from "reactstrap";
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_URL } from '../config';
import UserList from './UserList';
import './InviteContactModal.css';


const InviteContactModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  const handleAddFriend = async (receiverId) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.post(`${API_URL}/friend-requests/${userId}/friend-request/${receiverId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        title: 'Başarıyla Gönderildi!',
        text: response.data.message,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === receiverId
            ? { ...user, friendshipStatus: 'friend_request_pending' }
            : user
        )
      );

    } catch (err) {
      Swal.fire({
        title: 'Hata!',
        text: err.response?.data?.message || 'Bir hata oluştu.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  const handleRemoveFriendRequest = async (receiverId) => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.delete(`${API_URL}/friend-requests/${userId}/friend-request/${receiverId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      Swal.fire({
        title: 'İstek iptal edildi!',
        text: response.data.message,
        icon: "success",
        timer: 3000,
        position: "top-end",
        toast: true,
        showConfirmButton: false,
      });

      setUsers((prev) =>
        prev.map((user) =>
          user.userId === receiverId
            ? { ...user, friendshipStatus: 'none' }
            : user
        )
      );
    } catch (err) {
      Swal.fire({
        title: 'Hata!',
        text: err.response?.data?.message || 'Bir hata oluştu.',
        icon: 'error',
        confirmButtonText: 'Tamam'
      });
    }
  };

  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError('');

    if (!searchQuery.trim()) {
      setError('Arama terimi boş olamaz.');
      setUsers([]);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/users/search?q=${searchQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      setError(err.response?.status === 404 ? 'Kullanıcı bulunamadı' : 'Bir hata oluştu');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, token]);

  const handleClose = () => {
    setUsers([]); // Clear user list
    onClose(); // Call the original onClose callback
    setSearchQuery(''); // Clear search query
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} centered scrollable>
      <ModalHeader toggle={handleClose} className="bg-primary">
        <div className="modal-title-custom text-white font-size-16">
          Kullanıcı Davet Et & Ara
        </div>
      </ModalHeader>
      <ModalBody className="p-4">
        <Form>
          <div className="input-group mb-3">
            <Input
              id="searchChatUser"
              type="text"
              className="form-control bg-light border-0 pe-0"
              placeholder="Arama yap..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button color="light" type="button" id="searchbtn-addon" onClick={handleSearch}>
              <i className="bx bx-search align-middle"></i>
            </Button>
          </div>
        </Form>

        {loading ? (
          <p>Yükleniyor...</p>
        ) : (
          <>
            {error && <p className="modal-error">{error}</p>}
            <UserList
              users={users}
              onAddFriend={handleAddFriend}
              handleRemoveFriendRequest={handleRemoveFriendRequest}
            />
          </>
        )}

      </ModalBody>
    </Modal>
  );
};

export default memo(InviteContactModal);