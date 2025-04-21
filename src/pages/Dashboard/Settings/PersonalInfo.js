import React, { useEffect, useState } from "react";
import { Button } from "reactstrap";
import { updateUserInfo } from "../../../redux/slices/userInformation";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";


const PersonalInfo = ({ basicDetails }) => {
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
    { label: "İsim", name: "name", type: "text" },
    { label: "Soyisim", name: "surname", type: "text" },
    { label: "Kullanıcı Adı", name: "username", type: "text" },
    { label: "Hakkımda", name: "aboutme", type: "textarea" },
    { label: "Meslek", name: "jobs", type: "text" },
    { label: "E-posta", name: "email", type: "email" },
    { label: "Instagram", name: "instagram", type: "text" },
    { label: "Telefon", name: "phone", type: "text" },
    { label: "LinkedIn", name: "linkedin", type: "text" },
    { label: "GitHub", name: "github", type: "text" },
    { label: "Twitter", name: "twitter", type: "text" },
    { label: "YouTube", name: "youtube", type: "text" },
    { label: "Doğum Günü", name: "birthday", type: "date" }, // 🔥 burası güncellendi
    { label: "Facebook", name: "facebook", type: "text" },
  ];


  return (
    <div className="accordion-body">
      <form className="" onSubmit={handleSubmit}>
        {inputFields.map((field) => (
          <div className="mb-1" key={field.name}>
            <label className="form-label" htmlFor={field.label}>
              {field.label}
            </label>
            {field.type === "textarea" ? (
              <textarea
                className="form-control  form-container-textarea"
                name={field.name}
                value={userInfo[field.name] || ""}
                onChange={handleInputChange}
                style={{ height: "100px" }}
              />
            ) : (
              <input
                id={field.label}
                type={field.type}
                className="form-control"
                autoComplete="current-password"
                name={field.name}
                value={
                  field.name === "birthday" && userInfo[field.name]
                    ? userInfo[field.name].split("T")[0]
                    : userInfo[field.name] || ""
                }

                onChange={handleInputChange}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          className=" w-100 btn btn-primary mt-2"
          disabled={Change}
        >
          Kaydet
        </button>
      </form>
    </div>
  );
};

export default PersonalInfo;
