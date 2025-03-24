import { memo, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../../config";
import ImageLogoMsg from "../../assets/image/icon1.svg"
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form alanlarını kontrol et
    const { name, surname, username, email, password } = formData;
    if (!name || !surname || !username || !email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Eksik Alanlar",
        text: "Lütfen tüm alanları doldurduğunuzdan emin olun.",
      });
      return; // Eksik alan varsa kayıt işlemini durdur
    }

    try {
      const response = await axios.post(
        `${API_URL}/users`, formData
      );
      Swal.fire({
        icon: "success",
        title: "Kayıt başarılı!",
        text: "Hesabınız başarıyla oluşturuldu.",
        timer: 3000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
      navigate("/login");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Kayıt başarısız",
        text: error.response?.data?.error || "Beklenmeyen bir hata oluştu.",
      });
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-icon-container">
          <img src={ImageLogoMsg} alt="bg" className="login-icon" />
        </div>
        <div className="text-center mt-4 mb-3">
          <p className="login-title">SayHello Sign up to join us.</p>
        </div>
        <div className="d-flex gap-2 mb-2">
          <input
            type="text"
            name="name"
            placeholder="First Name"
            className="form-control"
            onChange={handleChange}
            id="name"
            autoComplete="given-name"
          />

          <input
            type="text"
            name="surname"
            placeholder="Last Name"
            className="form-control"
            onChange={handleChange}
            id="surname"
            autoComplete="family-name"
          />
        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
          className="form-control mb-2"
          onChange={handleChange}
          id="username"
          autoComplete="username"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control mb-2"
          onChange={handleChange}
          id="email"
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control mb-2"
          onChange={handleChange}
          id="password"
          autoComplete="new-password"
        />

        <div className="login-register">
          Already have an account?
          <Link to="/login" className="login-route">Sign in</Link>
        </div>

        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default memo(RegisterForm);
