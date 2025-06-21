import React, { memo } from "react";
import {
    NavItem,
    NavLink,
    UncontrolledTooltip,
} from "reactstrap";

const MenuNavItem = ({ item, selectedTab, onChangeTab }) => {
    const onClick = () => {
        onChangeTab(item.tabId);
    };

    const defaultTimeout = { enter: 150, exit: 100 };  // Varsayılan timeout değerleri
    const tooltipTimeout = item.timeout || defaultTimeout;

   

    return (
        <>
            <NavItem className={item.className} id={`${item.key}-container`}>
                <NavLink
                    href="#"
                    active={selectedTab === item.tabId}
                    id={item.key}
                    role="tab"
                    onClick={onClick}
                >
                    <i className={item.icon}></i>
                </NavLink>
            </NavItem>
            {/* <UncontrolledTooltip
                target={`${item.key}-container`}
                placement="right"
                timeout={tooltipTimeout}
                delay={tooltipTimeout} // Geçiş için gecikme süresi
                autohide={false} // Tooltip'in otomatik olarak kaybolmaması için
                fade={false} // Fade geçişini devre dışı bırakmak için
        
            >
                {item.tooltipTitle}
            </UncontrolledTooltip> */}
        </>
    );
};

export default memo(MenuNavItem);
