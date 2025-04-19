import React, { useState } from "react";
import { SETTINGS_COLLAPSES } from "../../../constants";

// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import UserCoverImage from "./UserCoverImage";
import UserProfile from "./UserProfile";
import PersonalInfo from "./PersonalInfo";
import ThemeSettings from "./ThemeSettings";
import AccordianItem from "./AccordianItem";


const Index = () => {
  const [settings, setSettings] = useState({})
  const [selectedMenu, setSelectedMenu] = useState (null);
  const onChangeData = (field, value) => {}

  const collapseItems = [
    {
      value: SETTINGS_COLLAPSES.PROFILE,
      label: "Personal Info",
      icon: "bx bxs-user",
      component: <PersonalInfo basicDetails={settings.basicDetails} />,
    },
    {
      value: SETTINGS_COLLAPSES.THEME,
      label: "Themes",
      icon: "bx bxs-adjust-alt",
      component: (
        <ThemeSettings theme={settings.theme} onChangeData={onChangeData} />
      ),
    },
    // {
    //   value: SETTINGS_COLLAPSES.PRIVACY,
    //   label: "Privacy",
    //   icon: "bx bxs-lock",
    //   component: (
    //     <Privacy privacy={settings.privacy} onChangeSettings={onChangeData} />
    //   ),
    // },
    // {
    //   value: SETTINGS_COLLAPSES.SECURITY,
    //   label: "Security",
    //   icon: "bx bxs-check-shield",
    //   component: (
    //     <Security
    //       security={settings.security}
    //       onChangeSettings={onChangeData}
    //     />
    //   ),
    // },
    // {
    //   value: SETTINGS_COLLAPSES.HELP,
    //   label: "Help",
    //   icon: "bx bxs-help-circle",
    //   component: <Help />,
    // },
  ];

  const onChangeCollapse = (id) => {
    setSelectedMenu(id);
  };

  return (
    <div className="position-relative">
      {/* {getSettingsLoading && <Loader />} */}
      <UserCoverImage basicDetails={settings.basicDetails} />

      <UserProfile
        basicDetails={settings.basicDetails}
        status={settings.status}
      />
      {/* Start User profile description */}
      <AppSimpleBar className="user-setting">
        <div id="settingprofile" className="accordion accordion-flush">
          {(collapseItems || []).map((item, key) => (
            <AccordianItem
              item={item}
              key={key}
              selectedMenu={selectedMenu}
              onChange={onChangeCollapse}
            />
          ))}
        </div>
        {/* end profile-setting-accordion */}
      </AppSimpleBar>
    </div>
  );
};

export default Index;
