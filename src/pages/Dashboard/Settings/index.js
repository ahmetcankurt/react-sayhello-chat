import { memo,useState } from "react";
import { SETTINGS_COLLAPSES } from "../../../constants";
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import UserCoverImage from "./UserCoverImage";
import UserProfile from "./UserProfile";
import PersonalInfo from "./PersonalInfo";
import ThemeSettings from "./ThemeSettings";
import AccordianItem from "./AccordianItem";
import { useDispatch} from "react-redux";
import Swal from "sweetalert2";
import { updateUserImage } from "../../../redux/slices/userInformation";

const Index = () => {
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [tempProfileImage, setTempProfileImage] = useState(null);
  const [tempBackgroundImage, setTempBackgroundImage] = useState(null);
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();
  const onChangeData = (field, value) => { };

  const collapseItems = [
    {
      value: SETTINGS_COLLAPSES.PROFILE,
      label: "Profil Ayarları",
      icon: "bx bxs-user",
      component: <PersonalInfo  />,
    },
    {
      value: SETTINGS_COLLAPSES.THEME,
      label: "Tema Ayarları",
      icon: "bx bxs-adjust-alt",
      component: (
        <ThemeSettings  onChangeData={onChangeData} />
      ),
    },
  ];

  

  const onChangeCollapse = (id) => {
    setSelectedMenu(id);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      Swal.fire({
        icon: "error",
        title: "Dosya Boyutu Hatası",
        text: "Dosya boyutu 50 MB'den büyük olamaz.",
      });
      return;
    }

    // Create temporary URL for instant preview
    const tempUrl = URL.createObjectURL(file);
    if (type === "profileImage") {
      setTempProfileImage(tempUrl);
    } else {
      setTempBackgroundImage(tempUrl);
    }

    const formData = new FormData();
    formData.append(type, file);

    dispatch(updateUserImage({ userId, formData, token }))
      .then(() => {
        Swal.fire({
          icon: "success",
          title: `${type === "profileImage" ? "Profil" : "Arka plan"} resmi başarıyla güncellendi.`,
          timer: 3000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });

        // Clear temp URLs after successful upload
        setTempProfileImage(null);
        setTempBackgroundImage(null);
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Hata",
          text: `${type} güncellenirken bir hata oluştu.`,
        });

        // Clear temp URLs on error
        if (type === "profileImage") {
          setTempProfileImage(null);
        } else {
          setTempBackgroundImage(null);
        }
      });
  };


  return (
    <div className="position-relative">
      <UserCoverImage
        handleFileChange={handleFileChange}
        tempBackgroundImage={tempBackgroundImage}
      />

      <UserProfile
        handleFileChange={handleFileChange}
        tempProfileImage={tempProfileImage}
      />

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
      </AppSimpleBar>
    </div>
  );
};

export default memo(Index);