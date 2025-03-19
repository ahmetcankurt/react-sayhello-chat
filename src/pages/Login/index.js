import { memo, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../../config";
import ImageLogoMsg from "../../assets/image/icon1.svg";
import "./style.css";

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  // Kullanıcı zaten giriş yapmışsa ana sayfaya yönlendir
  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.post(`${API_URL}/validate-token`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data.isValid) {
          navigate("/"); // Token geçerliyse ana sayfaya yönlendir
        }
      } catch (error) {
        console.error("Token doğrulama hatası:", error);
        localStorage.removeItem("token"); // Geçersiz token'ı temizle
      }
    };

    checkTokenValidity();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/login`, formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user?.userId);
      localStorage.setItem("username", response.data.user?.username);

      Swal.fire({
        icon: "success",
        title: "Giriş başarılı!",
        text: "Hoş geldiniz!",
        timer: 3000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });

      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Giriş başarısız",
        text: error.response?.data?.error || "Lütfen tekrar deneyin.",
      });
      console.error("Giriş hatası:", error.message);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="login-icon-container">
          <img src={ImageLogoMsg} alt="bg" className="login-icon" />
        </div>

        <div className="login-title mt-4 mb-3">
          Sign up and get access to the full guide right now
        </div>

        <input
          type="text"
          name="username"
          placeholder="username"
          className="form-control mb-3"
          onChange={handleChange}
          id="username"
          autoComplete="username" // ✅ Tarayıcıya kullanıcı adı alanı olduğunu bildirir
        />

        <input
          type="password"
          name="password"
          placeholder="Şifre"
          className="form-control"
          onChange={handleChange}
          id="password"
          autoComplete="current-password" // ✅ Tarayıcıya parola alanı olduğunu bildirir
        />

        <div className="login-register">
          Don't have an account yet?
          <Link to="/register" className="login-route">
            Sign up
          </Link>
        </div>

        <button type="submit" className="login-button">
          Log in
        </button>
      </form>

    </div>
  );
};

export default memo(LoginForm);