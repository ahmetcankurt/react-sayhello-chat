import { useState, useEffect, useCallback, memo } from 'react';
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { FaUserCheck } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import Swal from 'sweetalert2';  
import axios from 'axios';
import { API_URL } from '../../config';
import './Modal.css';

const UserList = ({ users, onAddFriend, handleRemoveFriendRequest }) => {
    if (users.length === 0) return <p>Hiç kullanıcı bulunamadı.</p>;

    return (
        <ul className="modal-user-list">
            {users.map(user => (
                <li key={user.userId} className="modal-user-item">
                    <div className='modal-user-item-div'>
                        <img
                            src={`${API_URL}/${user.profileImage}` || 'default-avatar.png'}
                            alt={`${user.name} ${user.surname}`}
                            className="modal-profile-image"
                        />
                        <p>{user.name} {user.surname} (@{user.username})</p>
                    </div>
                    <span>
                        {user.friendshipStatus === 'friend_request_pending' ? (
                            <BsThreeDots title='bekliyor' className='modal-friends-add-button' onClick={() => handleRemoveFriendRequest(user.userId)} />
                        ) : user.friendshipStatus === 'friend_request_accepted' ? (
                            <FaUserCheck className='modal-friends-add-button' />
                        ) : (
                            <MdAdd
                                className='modal-friends-add-button'
                                onClick={() => onAddFriend(user.userId)}
                            />
                        )}
                    </span>
                </li>
            ))}
        </ul>
    );
};

const Modal = ({ onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState('');
    const [isClosing, setIsClosing] = useState(false);
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

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
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

    const handleSearch = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`${API_URL}/users/search?q=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);  // Kullanıcıları sadece yeni arama geldiğinde güncelle
        } catch (err) {
            setError(err.response?.status === 404 ? 'Arama sonucu bulunamadı' : 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [searchQuery, token]);

    const handleRemoveFriendRequest = async (receiverId) => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.delete(`${API_URL}/friend-requests/${userId}/friend-request/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            Swal.fire({
                title: 'Başarıyla İstek iptal Edildi!',
                icon: "success",
                text: response.data.message,
                timer: 3000,
                position: "top-end",
                toast: true,
                showConfirmButton: false,
            });

            setUsers((prevUsers) =>
                prevUsers.map((user) =>
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

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => onClose(), 500);
    };

    useEffect(() => {
        if (isClosing) {
            document.querySelector('.modal-container').classList.add('closing');
        }
    }, [isClosing]);

    return (
        <div className="modal-overlay" onClick={handleClose}>
            <div className={`modal-container ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button onClick={handleClose} className="modal-close-button">
                    <MdClose />
                </button>
                <label htmlFor="Email" className="modal-title">Kullanıcı Ara</label>
                <div className="modal-search-container mb-3">
                    <input
                        autoComplete="off"
                        id="Email"
                        type="text"
                        placeholder="Search..."
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <FaSearch className="search-icon" onClick={handleSearch} />
                </div>
                {loading ? (
                    <p>Yükleniyor...</p>
                ) : (
                    <>
                        {error && <p className="modal-error">{error}</p>}
                        <UserList users={users} onAddFriend={handleAddFriend} handleRemoveFriendRequest={handleRemoveFriendRequest} />
                    </>
                )}
            </div>
        </div>
    );
};

export default memo(Modal);