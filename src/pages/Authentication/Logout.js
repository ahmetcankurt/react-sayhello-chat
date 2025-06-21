import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";

import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import withRouter from "../../components/withRouter";

const Logout = () => {

  return (
    <NonAuthLayoutWrapper>
      <Row className="justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4 text-center">
            <div className="avatar-xl mx-auto">
              <div className="avatar-title bg-soft-primary text-primary h1 rounded-circle">
                <i className="bx bxs-user"></i>
              </div>
            </div>
            <div className="mt-4 pt-2">
              <h5>Oturumunuz kapatıldı</h5>
              <p className="text-muted font-size-15">
              Uygulamamızı kullandığınız için teşekkür ederiz
                <span className="fw-semibold text-dark ms-2">Chat App</span>
              </p>
              <div className="mt-4">
                <Link
                  to="/auth-login"
                  className="btn btn-primary w-100 waves-effect waves-light"
                >
                  Giriş Yap
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default withRouter(Logout);
