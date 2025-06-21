import React, { memo, useEffect, useState } from "react";
import {
  Alert,
  Row,
  Col,
  Form,
  Label,
  Button,
} from "reactstrap";


// router
import { Link, useNavigate } from "react-router-dom";


// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";
import Swal from "sweetalert2";
import axios from "axios";

import { API_URL } from "../../config";

const Login = () => {
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
          navigate("/dashboard"); // Token geçerliyse ana sayfaya yönlendir
        }
      } catch (error) {
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
        // text: error.response?.data?.error || "Lütfen tekrar deneyin.",
      });
    }
  };

  return (
    <NonAuthLayoutWrapper>
      <Row className="justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader
              title="Hoşgeldiniz !"
              subtitle="Chat App hesabınıza giriş yapın."
            />

            <Form onSubmit={handleSubmit} className="position-relative">
              <div className="mb-3">
                <FormInput
                  label="Kullanıcı Adı"
                  type="text"
                  name="username"
                  onChange={handleChange}
                  labelClassName="form-label"
                  placeholder="Username"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <FormInput
                  label="Şifre"
                  type="password"
                  name="password"
                  onChange={handleChange}
                  labelClassName="form-label"
                  className="form-control pe-5"
                  placeholder="Password"
                />

              </div>

              <div className="text-center my-4">
                <Button color="primary" className="w-100" type="submit">
                  Giriş Yap
                </Button>
              </div>

              {/* <div className="mt-4 text-center">
                <div className="signin-other-title">
                  <h5 className="font-size-14 mb-4 title">Şununla Oturum Açın</h5>
                </div>
              </div> */}
            </Form>

            <div className="text-center text-muted">
              <p>
                Henüz bir hesabınız yok mu?{" "}
                <Link
                  to="/auth-register"
                  className="fw-medium text-decoration-underline"
                >
                  {" "}Kayıt Olun
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default memo(Login)


