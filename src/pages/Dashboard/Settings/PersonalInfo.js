import React, { useEffect, useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { updateUserInfo } from "../../../redux/slices/userInformation";
import { socialMediaFields, inputFields } from "../../../utils/socialMediaLinks"; // Sosyal medya bağlantılarını içe aktar
import FormField from "./FormField";
import SocialMediaField from "./SocialMediaField";

const PersonalInfo = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userInformation.user);

  const [userInfo, setUserInfo] = useState({});
  const [socials, setSocials] = useState({});

  useEffect(() => {
    if (!user) return;

    const initialUserInfo = {
      name: user.name || "",
      surname: user.surname || "",
      username: user.username || "",
      aboutme: user.aboutme || "",
      jobs: user.jobs || "",
      email: user.email || "",
      phone: user.phone || "",
      birthday: user.birthday || "",
    };

    const initialSocials = {};

    socialMediaFields.forEach(({ name }) => {
      const social = user.socials?.find(s => s.name.toLowerCase() === name);
      initialUserInfo[name] = social?.url || "";
      initialSocials[name] = social?.isPublic || false;
    });

    setUserInfo(initialUserInfo);
    setSocials(initialSocials);
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialToggle = (name) => {
    setSocials((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const getSocialMediaData = () =>
    socialMediaFields
      .filter(({ name }) => userInfo[name])
      .map(({ label, name }) => ({
        name: label,
        url: userInfo[name],
        isPublic: socials[name] || false,
      }));

  const isUnchanged = JSON.stringify(user) === JSON.stringify({
    ...userInfo,
    socials: getSocialMediaData(),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user?.userId) return;

    const formattedData = {
      ...userInfo,
      name: userInfo.name?.charAt(0).toUpperCase() + userInfo.name?.slice(1).toLowerCase(),
      surname: userInfo.surname?.toUpperCase(),
      username: userInfo.username?.toLowerCase(),
      email: userInfo.email?.toLowerCase(),
      socials: getSocialMediaData(),
    };

    dispatch(updateUserInfo({ userId: user.userId, updatedData: formattedData }))
      .unwrap()
      .then(() =>
        Swal.fire({
          icon: "success",
          title: "Başarılı",
          text: "Bilgiler başarıyla güncellendi.",
          timer: 3000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        })
      )
      .catch((error) =>
        Swal.fire({
          icon: "error",
          title: "Hata",
          text: error?.error || "Bilgiler güncellenirken hata oluştu.",
        })
      );
  };

  return (
    <div className="accordion-body">
      <form onSubmit={handleSubmit}>
        {inputFields.map((field) => (
          <FormField
            key={field.name}
            field={field}
            value={userInfo[field.name]}
            onChange={handleInputChange}
          />
        ))}

        <hr />
        <h6 className="mt-3">Sosyal Medya Hesapları</h6>

        {socialMediaFields.map((social) => (
          <SocialMediaField
            key={social.name}
            social={social}
            value={userInfo[social.name]}
            isPublic={socials[social.name]}
            onChange={handleInputChange}
            onToggle={handleSocialToggle}
          />
        ))}

        <button type="submit" className="w-100 btn btn-primary mt-3" disabled={isUnchanged}>
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default memo(PersonalInfo);