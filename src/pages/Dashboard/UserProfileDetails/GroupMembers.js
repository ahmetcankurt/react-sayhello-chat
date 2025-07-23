import { memo, useState } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import DelayedImage from '../../../components/DelayedImage';
import { removeGroupMember } from "../../../redux/slices/selectedUser";
import { useDispatch } from 'react-redux';
import axios from 'axios';
import classNames from 'classnames';
import { STATUS_TYPES } from '../../../constants';

function GroupMembers({ userInfo, imageErrorMap, handleImageError, API_URL }) {

    const members = Array.isArray(userInfo?.members) ? userInfo.members : [];

    const [openDropdownId, setOpenDropdownId] = useState(null);

    const toggle = (userId) => {
        setOpenDropdownId((prevId) => (prevId === userId ? null : userId));
    };

    const currentUser = members.find(m => m.role === "you");
    const isCurrentUserAdmin = currentUser?.isAdmin === true;

    const dispatch = useDispatch();
    const handleRemove = async (userId) => {
        try {
            await axios.delete(`${API_URL}/groups/${userInfo?.groupId}/member/${userId}`);
            dispatch(removeGroupMember(userId)); // Redux'tan çıkar
        } catch (error) {
            console.error("Kullanıcı gruptan çıkarılamadı:", error);
            alert("Bir hata oluştu.");
        }
    };

    return (
        <div className="px-3 py-2">
            <h6 className="text-muted">Grup Üyeleri</h6>
            <ul className="list-unstyled">
                {members.map((m) => (
                    <li key={m.userId} className="p-2 mb-2 border rounded-3">
                        <div className="d-flex">
                            {m.member.profileImage && !imageErrorMap[m.userId] ? (
                                <div className='position-relative'>
                                    <DelayedImage
                                        src={`${API_URL}/${m.member.profileImage}`}
                                        alt={m.member.name}
                                        className="rounded-circle me-2"
                                        onError={() => handleImageError(m.userId)}
                                        style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                    />
                                    <span className={classNames("user-status", {
                                        "bg-success": m?.member?.status === STATUS_TYPES.ACTIVE,
                                        "bg-warning": m?.member?.status === STATUS_TYPES.AWAY,
                                        "bg-danger": m?.member?.status === STATUS_TYPES.DO_NOT_DISTURB,
                                    })}
                                    />

                                </div>
                            ) : (
                                <div className="avatar-sm bg-light rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: 40, height: 40 }}>
                                    <i className="bx bx-user text-muted"></i>
                                </div>
                            )}

                            <div className="flex-grow-1">
                                <div className="d-flex gap-1 justify-content-between">
                                    <span className="d-flex gap-1 text-muted">
                                        {m.member.name} {m.member.surname}
                                        {m.role !== "you" && (
                                            <span className="font-size-11">(@{m?.member?.username})</span>
                                        )}
                                    </span>

                                    <div className="flex-column d-flex align-items-md-end">
                                        {m?.isAdmin === true && (
                                            <span className="font-size-10 bg-primary p-1 rounded-1 text-white">
                                                Grup Yöneticisi
                                            </span>
                                        )}
                                        {isCurrentUserAdmin && m.role !== "you" && (
                                            <Dropdown isOpen={openDropdownId === m.userId} toggle={() => toggle(m.userId)}>
                                                <DropdownToggle tag="a" className="text-muted p-0 cursor-pointer">
                                                    <i className="bx bx-chevron-down align-middle font-size-18 text-primary" />
                                                </DropdownToggle>
                                                <DropdownMenu container="body">

                                                    <DropdownItem
                                                        className="d-flex align-items-center gap-2 text-danger"
                                                        onClick={() => handleRemove(m.userId)}
                                                    >
                                                        <i className="bx bx-user-x"></i>
                                                        <span>Gruptan Çıkar</span>
                                                    </DropdownItem>

                                                    <DropdownItem
                                                        className="d-flex align-items-center gap-2 text-primary"
                                                        onClick={() => console.log('Yönetici Yap')}
                                                    >
                                                        <i className="bx bx-shield-quarter"></i>
                                                        <span>Yönetici Yap</span>
                                                    </DropdownItem>
                                                </DropdownMenu>
                                            </Dropdown>
                                        )
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default memo(GroupMembers)