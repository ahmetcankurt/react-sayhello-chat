import { useState, useCallback, memo } from 'react';
import { FaSearch } from "react-icons/fa";
import { MdAdd } from "react-icons/md";
import { FaUserCheck } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import { IoCloseCircleOutline } from "react-icons/io5";
import Swal from 'sweetalert2';
import axios from 'axios';
import { API_URL } from '../../config';
import './Modal.css';
import UserImage from '../../Component/UserImage';
import SearchInput from "../../Component/input/searchInput"

const UserList = ({ users, onAddFriend, handleRemoveFriendRequest }) => {
    if (users.length === 0) return <p></p>;

    return (
        <ul className="modal-user-list">
            {users.map(user => (
                <li key={user.userId} className="modal-user-item">
                    <div className='modal-user-item-div'>
                        <UserImage src={user?.profileImage} isActive={user.isActive} alt={`${user.name} ${user.surname}`} />
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

        // Arama sorgusu boşsa hata mesajı göster
        if (!searchQuery.trim()) {
            setError('Arama terimi boş olamaz. Lütfen bir terim girin.');
            setLoading(false);
            setUsers([])
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/users/search?q=${searchQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (err) {
            // 400 hatası alındığında özel mesaj göster
            if (err.response?.status === 400) {
                setError('Arama terimi boş olamaz. Lütfen bir terim girin.');
                setUsers([])
            } else {
                setError(err.response?.status === 404 ? 'Arama sonucu bulunamadı' : 'Bir hata oluştu');
                setUsers([])
            }
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


    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          handleSearch();
        }
      };


    return (
        <div className="modal-overlay" >
            <div className={`modal-container ${isClosing ? 'closing' : ''}`} >
                <label htmlFor="Email" className="modal-title text-center d-block">Kullanıcı Ara</label>
                <IoCloseCircleOutline onClick={handleClose} className="modal-friends-close-button" />
                    <SearchInput searchTerm={searchQuery} handleSearchChange={(e) => setSearchQuery(e.target.value)} handleSearch={handleSearch}  handleKeyDown={handleKeyDown}  />
                {loading ? (
                    <p></p>
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