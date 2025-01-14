import { useState, useEffect, useCallback, memo } from 'react';
import { FaSearch } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { MdAdd } from "react-icons/md";
import { FaUserCheck } from 'react-icons/fa';
import { BsThreeDots } from "react-icons/bs";
import Swal from 'sweetalert2';  // SweetAlert2'yi import ettik
import axios from 'axios';
import './Modal.css';

// Debounce Hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => setDebouncedValue(value), delay);
        return () => clearTimeout(handler);
    }, [value, delay]);
    return debouncedValue;
};

const UserList = ({ users, onAddFriend, handleRemoveFriendRequest }) => {
    if (users.length === 0) return <p>Hiç kullanıcı bulunamadı.</p>;

    return (
        <ul className="modal-user-list">
            {users.map(user => (
                <li key={user.userId} className="modal-user-item">
                    <div className='modal-user-item-div'>
                        <img
                            src={`http://localhost:3000/${user.profileImage}` || 'default-avatar.png'}
                            alt={`${user.name} ${user.surname}`}
                            className="modal-profile-image"
                        />
                        <p>{user.name} {user.surname} (@{user.username})</p>
                    </div>
                    <span >
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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const token = localStorage.getItem('token');
    const debouncedQuery = useDebounce(searchQuery, 500);

    // Arkadaşlık isteği gönderme
    const handleAddFriend = async (receiverId) => {
        try {
            const userId = localStorage.getItem('userId'); // Kullanıcının kendi id'sini alıyoruz
            const response = await axios.post(`http://localhost:3000/friend-requests/${userId}/friend-request/${receiverId}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // SweetAlert2 ile başarı mesajı gösterme
            Swal.fire({
                title: 'Başarıyla Gönderildi!',
                text: response.data.message,
                icon: 'success', // Başarı ikonu
                timer: 3000,
                showConfirmButton: false,
                position: "top-end",
                toast: true,
            });

            // Kullanıcılar listesini güncelleme
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === receiverId
                        ? { ...user, friendshipStatus: 'friend_request_pending' }
                        : user
                )
            );

        } catch (err) {
            // SweetAlert2 ile hata mesajı gösterme
            Swal.fire({
                title: 'Hata!',
                text: err.response?.data?.message || 'Bir hata oluştu.',
                icon: 'error', // Hata ikonu
                confirmButtonText: 'Tamam'
            });
        }
    };

    // Her harf için arama isteği
    const handleSearch = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get(`http://localhost:3000/users/search?q=${debouncedQuery}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (err) {
            setError(err.response?.status === 404 ? 'Arama sonucu bulunamadı' : 'Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }, [debouncedQuery, token]);

    useEffect(() => {
        if (debouncedQuery) {
            handleSearch(); // Debounced sorgu ile her harf için istek atılıyor
        } else {
            setUsers([]); // Eğer arama boşsa, sonuçları temizle
        }
    }, [debouncedQuery, handleSearch]);

    const handleRemoveFriendRequest = async (receiverId) => {
        try {
            const userId = localStorage.getItem('userId');
            const response = await axios.delete(`http://localhost:3000/friend-requests/${userId}/friend-request/${receiverId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // SweetAlert2 ile başarı mesajı gösterme
            Swal.fire({
                title: 'Başarıyla İstek iptal Edildi!',
                icon: "success",
                text: response.data.message,
                timer: 3000,
                position: "top-end",
                toast: true,
                showConfirmButton: false,
            });

            // Kullanıcılar listesini güncelleme
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.userId === receiverId
                        ? { ...user, friendshipStatus: 'none' } // İsteği iptal et
                        : user
                )
            );

        } catch (err) {
            // SweetAlert2 ile hata mesajı gösterme
            Swal.fire({
                title: 'Hata!',
                text: err.response?.data?.message || 'Bir hata oluştu.',
                icon: 'error',
                confirmButtonText: 'Tamam'
            });
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button onClick={onClose} className="modal-close-button">
                    <MdClose />
                </button>
                <label htmlFor="Email" className="form-label">Kullanıcı Ara</label>
                <div className="modal-search-container mb-3">
                    <input
                        autoComplete="off"
                        id="Email"
                        type="text"
                        placeholder="Search..."
                        className="search-input "
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)} // Her harf değişiminde searchQuery'yi güncelle
                    />
                    <FaSearch className="search-icon" />
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

export default memo(Modal)
