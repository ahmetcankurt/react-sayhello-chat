import { memo, useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { API_URL } from "../../config";
import ImageLogoMsg from "../../assets/image/icon1.svg";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordRequirements, setPasswordRequirements] = useState({
    hasUpperCase: false,
    hasNumber: false,
    isLongEnough: false,
    passwordsMatch: false,
  });

  useEffect(() => {
    // Şifre gereksinimlerini kontrol et
    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasNumber = /\d/.test(formData.password);
    const isLongEnough = formData.password.length >= 8;
    const passwordsMatch = formData.password === formData.confirmPassword && formData.password !== "";

    setPasswordRequirements({
      hasUpperCase,
      hasNumber,
      isLongEnough,
      passwordsMatch,
    });
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isPasswordValid = (password) => {
    return (
      passwordRequirements.hasUpperCase &&
      passwordRequirements.hasNumber &&
      passwordRequirements.isLongEnough
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, surname, username, email, password, confirmPassword } = formData;

    if (!name || !surname || !username || !email || !password || !confirmPassword) {
      Swal.fire({
        icon: "warning",
        title: "Eksik Alanlar",
        text: "Lütfen tüm alanları doldurduğunuzdan emin olun.",
      });
      return;
    }

    if (!passwordRequirements.passwordsMatch) {
      Swal.fire({
        icon: "error",
        title: "Şifreler Uyuşmuyor",
        text: "Şifre ve şifre tekrarı aynı olmalıdır.",
      });
      return;
    }

    if (!isPasswordValid(password)) {
      Swal.fire({
        icon: "error",
        title: "Geçersiz Şifre",
        text: "Şifreniz en az 8 karakter uzunluğunda olmalı, en az 1 büyük harf ve 1 rakam içermelidir.",
      });
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users`, {
        name,
        surname,
        username,
        email,
        password,
      });

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
        <div className="login-icon-container" />
        <h2 className="login-title mb-3">SayHello Aramıza katılmak için kaydolun.</h2>

        <div className="d-flex gap-2 mb-2">
          <input
            type="text"
            name="name"
            placeholder="Adınız"
            className="form-control"
            onChange={handleChange}
            autoComplete="given-name"
          />

          <input
            type="text"
            name="surname"
            placeholder="Soyadınız"
            className="form-control"
            onChange={handleChange}
            autoComplete="family-name"
          />
        </div>

        <input
          type="text"
          name="username"
          placeholder="Kullanıcı Adı"
          className="form-control mb-2"
          onChange={handleChange}
          autoComplete="username"
        />

        <input
          type="email"
          name="email"
          placeholder="E-posta"
          className="form-control mb-2"
          onChange={handleChange}
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Şifre"
          className="form-control mb-2"
          onChange={handleChange}
          autoComplete="new-password"
        />



        <input
          type="password"
          name="confirmPassword"
          placeholder="Şifre (Tekrar)"
          className="form-control mb-2"
          onChange={handleChange}
          autoComplete="new-password"
        />

        <div className="password-requirements mb-2">
          <small>Şifre gereksinimleri:</small>
          <ul className="list-unstyled">
            <li className={passwordRequirements.isLongEnough ? "text-success" : "text-danger"}>
              {passwordRequirements.isLongEnough ? "✓" : "✗"} En az 8 karakter
            </li>
            <li className={passwordRequirements.hasUpperCase ? "text-success" : "text-danger"}>
              {passwordRequirements.hasUpperCase ? "✓" : "✗"} En az 1 büyük harf
            </li>
            <li className={passwordRequirements.hasNumber ? "text-success" : "text-danger"}>
              {passwordRequirements.hasNumber ? "✓" : "✗"} En az 1 rakam
            </li>
          </ul>
        </div>

        {formData.confirmPassword && (
          <div className="mb-2">
            <small className={passwordRequirements.passwordsMatch ? "text-success" : "text-danger"}>
              {passwordRequirements.passwordsMatch ? "✓ Şifreler eşleşiyor" : "✗ Şifreler eşleşmiyor"}
            </small>
          </div>
        )}

        <hr className="mb-0" />

        <div className="login-register">
          Zaten bir hesabınız var mı?
          <Link to="/login" className="login-route"> Giriş Yap</Link>
        </div>

        <button type="submit" className="login-button">
          Kayıt Ol
        </button>
      </form>
    </div>
  );
};

export default memo(RegisterForm);