import { memo, useState } from "react";

import {
    Dropdown,
    DropdownItem,
    DropdownToggle,
    DropdownMenu,
} from "reactstrap";
import { TABS } from "../../constants/index";
import { useSelector } from "react-redux";
import { API_URL } from "../../config";
import { getShortName } from '../../utils/userHelpers';
import { COLORS } from "../../constants/bgShortColor";
import LightDarkMode from "../../components/LightDarkMode"; // Import et
import { LAYOUT_MODES } from "../../constants/index";

const ProfileDropdownMenu = ({
    onChangeTab,
    isMobile,
    layoutMode,
    onChangeLayoutMode,
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [imageError, setImageError] = useState(false);
    const toggle = () => setDropdownOpen(!dropdownOpen);

    const userInfo = useSelector((state) => state.userInformation.user);

    const shortName = getShortName(userInfo);
    const [color] = useState(Math.floor(Math.random() * COLORS.length));

    const handleImageError = () => {
        setImageError(true);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        window.location.href = "/logout";
    };

    const mode =
        layoutMode === LAYOUT_MODES["DARK"]
            ? LAYOUT_MODES["LIGHT"]
            : LAYOUT_MODES["DARK"];

    return (
        <Dropdown
            nav
            isOpen={dropdownOpen}
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
            toggle={toggle}
        >
            <DropdownToggle nav className="bg-transparent">
                {userInfo?.profileImage && !imageError ? (
                    <img
                        src={`${API_URL}/${userInfo.profileImage}`}
                        alt={userInfo.name ? `${userInfo.name} ${userInfo.surname}` : 'Profile'}
                        className="profile-user rounded-circle"
                        onError={handleImageError}
                    />
                ) : (
                    <span className={`p-2 rounded-circle ${COLORS[color]} text-white font-size-22`}>
                        {shortName}
                    </span>
                )}
            </DropdownToggle>

            <DropdownMenu>
                <DropdownItem
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => onChangeTab(TABS.USERS)}
                >
                    Profil
                    <i className="bx bx-user-circle text-muted ms-1"></i>
                </DropdownItem>
                <DropdownItem
                    className="d-flex align-items-center justify-content-between"
                    onClick={() => onChangeTab(TABS.SETTINGS)}
                >
                    Ayarlar
                    <i className="bx bx-cog text-muted ms-1"></i>
                </DropdownItem>

                {/* Mobilde LightDarkMode buraya eklenir */}
                {isMobile && (
                    <DropdownItem
                        className="d-flex align-items-center justify-content-between"
                        onClick={() => onChangeLayoutMode(mode)}
                    >
                        {layoutMode === LAYOUT_MODES.DARK ? "Aydınlık" : "Karanlık"}
                        <i className={`bx ms-1 ${layoutMode === LAYOUT_MODES.DARK ? "bx-sun" : "bx-moon"}`} />
                    </DropdownItem>
                )}


                <DropdownItem
                    className="d-flex align-items-center justify-content-between"
                    onClick={handleLogout}
                >
                    Çıkış Yap
                    <i className="bx bx-log-out-circle text-muted ms-1"></i>
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
};

export default memo(ProfileDropdownMenu);
