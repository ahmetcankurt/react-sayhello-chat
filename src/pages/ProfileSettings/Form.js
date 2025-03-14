// Form.js
import { useEffect, memo, useState } from "react";
import Swal from "sweetalert2";
import ScrollContainer from "../../Component/ScrollContainer";
import { useDispatch, useSelector } from "react-redux";
import { updateUserInfo } from "../../redux/slices/userInformation";
import "./ProfileSettings.css";

function Form() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.userInformation.user);
  const [userInfo, setUserInfo] = useState({});
  const [initialUserInfo, setInitialUserInfo] = useState({});

  useEffect(() => {
    if (user) {
      setUserInfo(user);
      setInitialUserInfo(user);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!user.userId) return;

    dispatch(updateUserInfo({ userId: user.userId, updatedData: userInfo }))
      .then(() => {
        Swal.fire({
          icon: "success",
          title: "Başarılı",
          text: "Bilgiler başarıyla güncellendi.",
          timer: 3000,
          showConfirmButton: false,
          position: "top-end",
          toast: true,
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Hata",
          text: error.message || "Bilgiler güncellenirken hata oluştu.",
        });
      });
  };

  const isFormChanged = JSON.stringify(userInfo) !== JSON.stringify(initialUserInfo);

  const inputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Surname", name: "surname", type: "text" },
    { label: "Username", name: "username", type: "text" },
    { label: "Password", name: "password", type: "password" },
    { label: "About Me", name: "aboutme", type: "textarea" },
    { label: "Jobs", name: "jobs", type: "text" },
    { label: "is Active", name: "isActive", type: "text" },
    { label: "status", name: "status", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Instagram", name: "instagram", type: "text" },
    { label: "Phone", name: "phone", type: "text" },
    { label: "Linkedin", name: "linkedin", type: "text" },
    { label: "Github", name: "github", type: "text" },
    { label: "Twitter", name: "twitter", type: "text" },
    { label: "Youtube", name: "youtube", type: "text" },
    { label: "Birthday", name: "birthday", type: "text" },
    { label: "Facebook", name: "facebook", type: "text" },
  ];

  return (
    <>
      <ScrollContainer className="form-container">
        {inputFields.map((field) => (
          <div className="mb-1" key={field.name}>
            <label className="form-label" htmlFor={field.label}>
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                className="form-control form-container-textarea"
                name={field.name}
                value={userInfo[field.name] || ""}
                onChange={handleInputChange}
              />
            ) : (
              <input
                id={field.label}
                type={field.type}
                className="form-control"
                name={field.name}
                value={userInfo[field.name] || ""}
                onChange={handleInputChange}
              />
            )}
          </div>
        ))}
      </ScrollContainer>

      <button
        className="form-container-button w-100"
        onClick={handleSave}
        disabled={!isFormChanged}
      >
        Kaydet
      </button>
    </>
  );
}

export default memo(Form);
