import React from "react";
import { Alert, Row, Col, Form, Button, UncontrolledTooltip } from "reactstrap";

// router
import { Link, Navigate } from "react-router-dom";

// validations
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";


// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";

const Register = () => {
  // Inside your component

  const user = ""
  const registrationError = ""
  const regLoading = ""
  const resolver = yupResolver(
    yup.object().shape({
      email: yup
        .string()
        .email("This value should be a valid email.")
        .required("Please Enter E-mail."),
      username: yup.string().required("Please Enter E-mail."),
      password: yup.string().required("Please Enter Password."),
    })
  );

  const defaultValues = {};

  const methods = useForm({ defaultValues, resolver });
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = methods;

  const onSubmitForm = (values) => {
  };

  const userProfile = "";
  const loading = "";

  if (userProfile && !loading) {
    return <Navigate to={{ pathname: "/dashboard" }} />;
  }

  return (
    <NonAuthLayoutWrapper>
      <Row className=" justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader
              title="Kayıt Ol"
              subtitle="Ücretsiz Chat App hesabınızı hemen edinin."
            />

            {user && user ? (
              <Alert color="success">Kullanıcıyı Başarıyla Kaydedin</Alert>
            ) : null}

            {registrationError && registrationError ? (
              <Alert color="danger">{registrationError}</Alert>
            ) : null}

            <Form
              onSubmit={handleSubmit(onSubmitForm)}
              className="position-relative"
            >
              {regLoading && <Loader />}
              <div className="mb-3">
                <FormInput
                  label="Email"
                  type="text"
                  name="email"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter Email"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <FormInput
                  label="Username"
                  type="text"
                  name="username"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  placeholder="Enter username"
                  className="form-control"
                />
              </div>

              <div className="mb-3">
                <FormInput
                  label="Şifre"
                  type="password"
                  name="password"
                  register={register}
                  errors={errors}
                  control={control}
                  labelClassName="form-label"
                  className="form-control pe-5"
                  placeholder="Enter Password"
                />
              </div>

              <div className="mb-4">
                <p className="mb-0">
                  Kayıt olarak Chat App Kullanım Şartları'nı kabul etmiş olursunuz
                  <Link to="#" className="text-primary ms-2">
                    Kullanım Koşulları
                  </Link>
                </p>
              </div>

              <div className="text-center mb-3">
                <Button
                  color="primary"
                  className="w-100  waves-effect waves-light"
                  type="submit"
                >
                  Kayıt Ol
                </Button>
              </div>
              <div className="mt-4 text-center">
                <div className="signin-other-title">
                  <h5 className="font-size-14 mb-4 title">Kullanarak kaydolun</h5>
                </div>
                <Row className="">
                  <div className="col-4">
                    <div>
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        id="facebook"
                      >
                        <i className="mdi mdi-facebook text-indigo"></i>
                      </button>
                    </div>
                    <UncontrolledTooltip placement="top" target="facebook">
                      Facebook
                    </UncontrolledTooltip>
                  </div>
                  <div className="col-4">
                    <div>
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        id="twitter"
                      >
                        <i className="mdi mdi-twitter text-info"></i>
                      </button>
                    </div>
                    <UncontrolledTooltip placement="top" target="twitter">
                      Twitter
                    </UncontrolledTooltip>
                  </div>
                  <div className="col-4">
                    <div>
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        id="google"
                      >
                        <i className="mdi mdi-google text-danger"></i>
                      </button>
                    </div>
                    <UncontrolledTooltip placement="top" target="google">
                      Google
                    </UncontrolledTooltip>
                  </div>
                </Row>
              </div>
            </Form>

            <div className="mt-5 text-center text-muted">
              <p>
                Zaten hesabınız var mı?{" "}
                <Link
                  to="/auth-login"
                  className="fw-medium text-decoration-underline"
                >
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
