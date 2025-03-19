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

  const Change = JSON.stringify(user) === JSON.stringify(userInfo);

  useEffect(() => {
    if (user) {
      setUserInfo(user);
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engelle

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


  const inputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Surname", name: "surname", type: "text" },
    { label: "Username", name: "username", type: "text" },
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
    <ScrollContainer paddingBottom="80px">
      <form className="form-container" onSubmit={handleSubmit}>
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
                autoComplete="current-password"
                name={field.name}
                value={userInfo[field.name] || ""}
                onChange={handleInputChange}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className="form-container-button w-100"
          disabled={Change}
        >
          Kaydet
        </button>
      </form>
    </ScrollContainer>
  );
}

export default memo(Form);
