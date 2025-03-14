import React, { memo, useEffect, useState } from 'react'
import ProfileBg from "../../assets/image/image_header.jpg";
import NotUserImage from "../../Component/NotUserImage"
import axios from 'axios';
import { API_URL } from '../../config';
import "./index.css"
import { TbCircleArrowLeft } from 'react-icons/tb';
function Index({ selectedUser ,handleProfileClick }) {
    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        if (selectedUser) {
            // Backend'e token ile istek gönderiyoruz
            axios
                .get(`${API_URL}/users/my-friends-profile/${selectedUser}`)
                .then((response) => {
                    setUserInfo(response.data); // Gelen kullanıcı bilgilerini state'e kaydet
                })
                .catch((error) => {
                    console.error("Kullanıcı bilgileri alınırken hata:", error);
                });
        }
    }, [selectedUser]);

    if (!selectedUser) {
        return
    }

    if (!userInfo) {
        return
    }


    return (
        <div className="">
              <TbCircleArrowLeft className="header-close-icon mobile-none" onClick={handleProfileClick} />
            <div className='container-friends' style={{ position: 'relative', display: 'inline-block' }}>
                {
                    userInfo?.profileImage
                        ? <img className='profile-bg-friends' src={`${API_URL}/${userInfo?.profileImage}` || ProfileBg} alt="Example" />
                        : <NotUserImage height={"auto"} width={"auto"} />

                }
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
    )
}

export default memo(Index)