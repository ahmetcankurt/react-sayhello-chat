// Form.js
import {  useEffect, memo } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import "./ProfileSettings.css";

function Form({ userInfo, setUserInfo }) {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");

  // Kullanıcı bilgilerini al
  useEffect(() => {
    if (userId && token) {
      axios
        .get("http://localhost:3000/users/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserInfo(response.data);
        })
        .catch((error) => {
          console.error("Kullanıcı bilgileri alınırken hata:", error);
          Swal.fire({
            icon: "error",
            title: "Hata",
            text: "Kullanıcı bilgileri alınırken bir hata oluştu.",
          });
        });
    }
  }, [userId, token]);

  // Metin verisi değişikliklerini güncelle
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [name]: value || "" }));
  };

  // Metin verilerini kaydet
  // handleSave fonksiyonu
const handleSave = () => {
  const updatedData = {
    name: userInfo.name,
    surname: userInfo.surname,
    username: userInfo.username,
    email: userInfo.email,
    password: userInfo.password,
    aboutme: userInfo.aboutme,
    jobs: userInfo.jobs,
  };

  // API'ye JSON verisi gönder
  axios
    .put(`http://localhost:3000/users/${userId}`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
    .then(() => {
      Swal.fire({
        icon: "success",
        title: "Başarılı",
        text: "Metin bilgileri başarıyla güncellendi.",
        timer: 3000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
    })
    .catch((error) => {
      console.error("Metin bilgileri güncellenirken hata:", error);
      Swal.fire({
        icon: "error",
        title: "Hata",
        text: "Metin bilgileri güncellenirken bir hata oluştu.",
      });
    });
};


  const inputFields = [
    { label: "Name", name: "name", type: "text" },
    { label: "Surname", name: "surname", type: "text" },
    { label: "Username", name: "username", type: "text" },
    { label: "Email", name: "email", type: "email" },
    { label: "Password", name: "password", type: "password" },
    { label: "Jobs", name: "jobs", type: "text" },
    { label: "About Me", name: "aboutme", type: "textarea" },
  ];

  return (
    <div className="form-container">
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

      <button className="form-container-button w-100" onClick={handleSave}>
        Kaydet
      </button>
    </div>
  );
}

export default memo(Form);
