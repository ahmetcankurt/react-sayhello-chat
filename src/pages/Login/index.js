import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../../config";
import ImageLogoMsg from "../../assets/image/icon1.svg"
import "./style.css"
import { Link } from "react-router-dom";

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        formData
      );
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
        <div className="login-icon-container ">
          <img src={ImageLogoMsg} alt="bg" className="login-icon " />
        </div>

        <div className="login-title my-3">Sign up and get access to the full guide right now</div>
        <div className="form-floating mb-3"></div>
        <input
          type="text"
          name="username"
          placeholder="username"
          className="form-control mb-3"
          onChange={handleChange}
          id="username"
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          className="form-control "
          onChange={handleChange}
          id="password"
        />
        <div className="login-register">Don't have an account yet? 
          <Link to="/register" className="login-route">Sign up</Link>
        </div>
        <button type="submit" className="login-button">
          Log in
        </button>
      </form>
    </div>
  );
};

export default memo(LoginForm)