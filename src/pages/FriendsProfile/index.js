import React, { useEffect, useState } from 'react'
import ImageMe from "../../assest/image/imageAdmin.jpeg";
import ProfileBg from "../../assest/image/image_header.jpg";
import axios from 'axios';
import "./index.css"
function Index({ selectedUser }) {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (selectedUser) {
            // Backend'e token ile istek gönderiyoruz
            axios
                .get(`http://localhost:3000/users/my-friends-profile/${selectedUser}`)
                .then((response) => {
                    setUserInfo(response.data); // Gelen kullanıcı bilgilerini state'e kaydet
                })
                .catch((error) => {
                    console.error("Kullanıcı bilgileri alınırken hata:", error);
                });
        }
    }, [selectedUser]);

    if (!selectedUser) {
        return <div>Kullanıcı seçilmedi.</div>;
    }

    if (!userInfo) {
        return <div>Yükleniyor...</div>; // userInfo yüklenene kadar bir yükleme durumu göster
    }


    return (
        <>
            <div className="shadow-left">
                <div className='container-friends' style={{ position: 'relative', display: 'inline-block' }}>
                    <img className='profile-bg-friends' src={`http://localhost:3000/${userInfo.profileImage}` || ProfileBg} alt="Example" />
                    <span className='profile-friends-name'>
                        <span >{userInfo.name} {userInfo.surname}</span>
                        <span className='friend-status-box '>
                            <span
                                className={`friend-status ${userInfo.isActive ? "isActive" : "inactive"}`}
                            />
                            <span className={`friends-status ${userInfo.isActive ? "Online" : "Offline"}`}>
                                {userInfo.isActive ? "Online" : "Offline"}
                            </span>
                        </span>
                    </span>
                </div>
            </div>
        </>
    )
}

export default Index