import React, { useState } from "react";
import { Alert, Row, Col, Form, Button } from "reactstrap";
import { Link } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { API_URL } from "../../config";

// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";

const Register = () => {
  const [registrationError, setRegistrationError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  const resolver = yupResolver(
    yup.object().shape({
      name: yup.string().required("Ad girmeniz gerekiyor."),
      surname: yup.string().required("Soyad girmeniz gerekiyor."),
      username: yup.string().required("Kullanıcı adı girmeniz gerekiyor."),
      email: yup
        .string()
        .email("Geçerli bir e-posta adresi girin.")
        .required("E-posta girmeniz gerekiyor."),
      password: yup.string().required("Şifre girmeniz gerekiyor."),
    })
  );

  const defaultValues = {};
  const methods = useForm({ defaultValues, resolver });
  const { handleSubmit, register, control, formState: { errors } } = methods;

  const onSubmitForm = async (values) => {
    setRegLoading(true);
    try {
      const response = await axios.post(`${API_URL}/users`, values);
      Swal.fire({
        icon: "success",
        title: "Kayıt başarılı!",
        text: "Hesabınız başarıyla oluşturuldu.",
        timer: 3000,
        showConfirmButton: false,
        position: "top-end",
        toast: true,
      });
      window.location.href = "/auth-login";
    } catch (error) {
      setRegistrationError("Kayıt sırasında bir hata oluştu.");
      Swal.fire({
        icon: "error",
        title: "Kayıt Başarısız",
        text: error.response?.data?.error || "Lütfen tekrar deneyin.",
      });
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <NonAuthLayoutWrapper>
      <Row className="justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-5">
          <div className="py-md-5 py-4">
            <AuthHeader
              title="Kayıt Ol"
              subtitle="Ücretsiz Chat App hesabınızı hemen edinin."
            />
            {registrationError && (
              <Alert color="danger">{registrationError}</Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmitForm)} className="position-relative">
              {regLoading && <Loader />}

              {/* Name and Surname Inputs */}
              <div className="mb-2 d-flex gap-2 ">
                <div className="w-100"> 

                  <FormInput
                    label="Ad"
                    type="text"
                    name="name"
                    register={register}
                    errors={errors}
                    control={control}
                    placeholder="Ad"
                    className="form-control"
                  />
                </div>
                <div className="w-100">
                  <FormInput
                    label="Soyad"
                    type="text"
                    name="surname"
                    register={register}
                    errors={errors}
                    control={control}
                    placeholder="Soyad"
                    className="form-control"
                  />
                </div>
              </div>

              {/* Username Input */}
              <div className="mb-2">
                <FormInput
                  label="Kullanıcı Adı"
                  type="text"
                  name="username"
                  register={register}
                  errors={errors}
                  control={control}
                  placeholder="Kullanıcı adı"
                  className="form-control"
                />
              </div>

              {/* Email Input */}
              <div className="mb-2">
                <FormInput
                  label="E-posta"
                  type="text"
                  name="email"
                  register={register}
                  errors={errors}
                  control={control}
                  placeholder="E-posta adresi"
                  className="form-control"
                />
              </div>

              {/* Password Input */}
              <div className="mb-2">
                <FormInput
                  label="Şifre"
                  type="password"
                  name="password"
                  register={register}
                  errors={errors}
                  control={control}
                  placeholder="Şifre"
                  className="form-control pe-5"
                />
              </div>

              {/* Terms & Conditions */}
              <div className="mb-4">
                <p className="mb-0">
                  Kayıt olarak Chat App Kullanım Şartları'nı kabul etmiş olursunuz{" "}
                  <Link to="#" className="text-primary ms-2">
                    Kullanım Koşulları
                  </Link>
                </p>
              </div>

              {/* Submit Button */}
              <div className="text-center mb-2">
                <Button color="primary" className="w-100  waves-effect waves-light" type="submit">
                  Kayıt Ol
                </Button>
              </div>
            </Form>

            {/* Link to Login Page */}
            <div className="mt-5 text-center text-muted">
              <p>
                Zaten hesabınız var mı?{" "}
                <Link to="/auth-login" className="fw-medium text-decoration-underline">
                  Giriş Yap
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default Register;
