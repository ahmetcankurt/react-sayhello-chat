import { memo, useState } from "react";
import { FaGooglePlusG } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

const RegisterForm = ({ setActiveTab, activeTab }) => {
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
    try {
      const response = await axios.post(
        "http://localhost:3000/users",
        formData
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
      setActiveTab(activeTab === "login" ? "register" : "login")
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Kayıt başarısız",
        text: error.response?.data?.error || "Beklenmeyen bir hata oluştu.",
      });
    }
  };
  

  const handleGoogleSignup = () => {
    // Google OAuth işlemine yönlendirme
    window.location.href = "http://localhost:3000/auth/google";
  };

  

  return (
    <div className="login-container">
      <div className="text-center">
        <h2>Welcome!</h2>
        <p className="mb-0 login-sayHello">SayHello Sign up to join us.</p>
      </div>

      <form onSubmit={handleSubmit} className="login-form">
        <div className="d-flex gap-2">
          <div>
            <label className="login-label" htmlFor="name">
              First Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="First Name"
              className="form-control"
              onChange={handleChange}
              id="name"
            />
          </div>
          <div>
            <label className="login-label" htmlFor="surname">
              Last Name
            </label>
            <input
              type="text"
              name="surname"
              placeholder="Last Name"
              className="form-control"
              onChange={handleChange}
              id="surname"
            />
          </div>
        </div>

        <label className="login-label" htmlFor="username">
          Username
        </label>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="form-control"
          onChange={handleChange}
          id="username"
        />

        <label className="login-label" htmlFor="email">
          Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="form-control"
          onChange={handleChange}
          id="email"
        />

        <label className="login-label" htmlFor="password">
          Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control"
          onChange={handleChange}
          id="password"
        />

        <button type="submit" className="login-button">
          Sign Up
        </button>
      </form>

      <span className="login-signup">Or sign up with Google</span>
      <div className="login-google-box" onClick={handleGoogleSignup}>
        <FaGooglePlusG className="login-google-button" />
      </div>

      <div className="mt-2 register-login-route-text">
        Already have an account?
        <span
        className="login-route"
          onClick={() =>
            setActiveTab(activeTab === "login" ? "register" : "login")
          }
        >
          Log in
        </span>{" "}
      </div>
    </div>
  );
};

export default memo(RegisterForm);
