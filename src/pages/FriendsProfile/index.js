import React, { memo, useEffect, useState, useMemo } from 'react'
import ProfileBg from "../../assets/image/image_header.jpg";
import NotUserImage from "../../Component/NotUserImage"
import axios from 'axios';
import { API_URL } from '../../config';
import { TbCircleArrowLeft } from 'react-icons/tb';
import { capitalize } from "../../utils/stringUtils";
import "./index.css"
import Skeleton from '../../Component/Skeleton';
import ScrollContainer from '../../Component/ScrollContainer';
import SocialLinks from "../../Component/SocialLinks";
import IconsList from "../../constants/profileSocialIcon"


function Index({ selectedUser, handleProfileClick }) {
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

      const icons = useMemo(() => IconsList(), []);
    

    const [imageError, setImageError] = useState(false);

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
                    !imageError && userInfo?.profileImage ? (
                        <img 
                            className='profile-bg-friends' 
                            src={`${API_URL}/${userInfo?.profileImage}`} 
                            alt="Profile Background" 
                            onError={() => setImageError(true)} // Set error state if image fails
                        />
                    ) : (
                        <Skeleton className="profile-bg-friends" height={"250px"} />
                    )
                }
                <span className='profile-friends-name'>
                    <span className='profile-f-name' >{capitalize(userInfo.name)} {capitalize(userInfo.surname)}</span>
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
            <hr className="p-0 my-3 box-shadow-global" />
            <ScrollContainer paddingBottom="80px" >
                <span className="profile-job mt-2 mb-1  px-2" style={{textAlign:"start"}}>
                    {userInfo.jobs ?? <Skeleton className="profile-job" width="150px" height="20px" />}
                </span>
                <p className="profile-about mb-2 px-2">
                    {userInfo.aboutme ?? <Skeleton className="mt-2" width="80%" height="30px" />}
                </p>
                {!userInfo ? (
                    <div className="gap">
                        {icons.map(({ key }) => (
                            <Skeleton className="mb-2" key={key} width="90%" height="20px" />
                        ))}
                    </div>
                ) : (
                    <SocialLinks icons={icons} userInfo={userInfo} />
                )}
            </ScrollContainer>

        </div>
    )
}

export default memo(Index)