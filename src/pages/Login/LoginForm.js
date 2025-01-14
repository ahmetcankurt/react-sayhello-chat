import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaGooglePlusG } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const LoginForm = ({ setActiveTab, activeTab }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
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
  

  const handleGoogleLogin = () => {
    // Google OAuth işlemine backend yönlendirmesi
    window.location.href = "http://localhost:3000/auth/google"; // Backend URL
  };

  return (
    <div className="login-container">
      <div className="text-center">
        <h2>Welcome Back!</h2>
        <p className="mb-0 login-sayHello">SayHello sign in to continue.</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-floating mb-3"></div>
        <label className="login-label" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          name="username"
          placeholder="username"
          className="form-control"
          onChange={handleChange}
          id="username"
        />
        <div className="password-forgot-div">
          <label className="login-label" htmlFor="password">
            Password
          </label>
          <span className="login-forgot">Forgot password?</span>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          className="form-control"
          onChange={handleChange}
          id="password"
        />
        <button type="submit" className="login-button">
          Log in
        </button>
      </form>

      <span className="login-signup">Sign in with Google</span>
      <div className="login-google-box" onClick={handleGoogleLogin}>
        <FaGooglePlusG className="login-google-button" />
      </div>
      <div className="mt-3 register-login-route-text">
        Don't have an account ?
        <span
         className="login-route"
          onClick={() =>
            setActiveTab(activeTab === "login" ? "register" : "login")
          }
        >
          Register
        </span>
      </div>
    </div>
  );
};

export default memo(LoginForm)
