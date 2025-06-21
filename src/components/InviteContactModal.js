import React, { memo, useState, useCallback } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Input,
} from "reactstrap";
import { MdAdd } from "react-icons/md";
import { FaUserCheck } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_URL } from '../config';

import classnames from "classnames";
import './InviteContactModal.css';
import { getShortName } from '../utils/userHelpers';
import { COLORS } from "../constants/bgShortColor";

const UserList = ({ users, onAddFriend, handleRemoveFriendRequest }) => {
  
  const [imageError, setImageError] = useState(false);
  const [color] = useState(Math.floor(Math.random() * COLORS.length));

  return (
    <ul className="modal-user-list">
      {users.map((user, index) => {
        const fullName = `${user.name} ${user.surname}`;
        const shortName = getShortName(user);

        return (
          <li key={index} className="modal-user-item">
            <div className="modal-user-item-div">
              <div className="avatar-sm me-2">
                {user?.profileImage && !imageError ? (
                  <img
                    src={`${API_URL}/${user.profileImage}`}
                    alt={fullName}
                    className={classnames("img-fluid rounded-circle", user.isActive ? 'active-user' : '')}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span
                    className={classnames(
                      "avatar-title",
                      "rounded-circle",
                      "text-uppercase",
                      "text-white",
                      COLORS[color]
                    )}
                    style={{ width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {shortName}
                  </span>
                )}
              </div>
              <p>{fullName} (@{user.username})</p>
            </div>
            <span>
              {user.friendshipStatus === 'friend_request_pending' ? (
                <BsThreeDots title='bekliyor' className='modal-friends-add-button' onClick={() => handleRemoveFriendRequest(user.userId)} />
              ) : user.friendshipStatus === 'friend_request_received' ? (
                <FaUserCheck className='modal-friends-add-button' />
              ) : (
                <MdAdd
                  className='modal-friends-add-button'
                  onClick={() => onAddFriend(user.userId)}
                />
              )}

            </span>
          </li>
        );
      })}
    </ul>
  );
};

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