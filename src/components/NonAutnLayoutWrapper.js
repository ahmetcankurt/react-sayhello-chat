import React, { memo } from "react";
import { Container, Row, Col } from "reactstrap";

import { Link } from "react-router-dom";

// images
import authImage from "../assets/images/auth-img.png";


const NonAuthLayoutWrapper = ({ children }) => {
  return (
    <>
      <div className="auth-bg">
        <Container fluid className="p-0">
          <Row className=" g-0">
            <Col xl={3} lg={4}>
              <div className="p-4 pb-0 p-lg-5 pb-lg-0 auth-logo-section">
                <div className="text-white-50">
                  <h3>
                    <Link to="/" className="text-white">
                      <i className="bx bxs-message-alt-detail align-middle text-white h3 mb-1 me-2"></i>
                      Chat App
                    </Link>
                  </h3>
                </div>
                <div className="mt-auto">
                  <img src={authImage} alt="auth" className="auth-img" />
                </div>
              </div>
            </Col>

            <Col xl={9} lg={8}>
              <div className="authentication-page-content">
                <div className="d-flex flex-column h-100 px-4 pt-4">
                  {children}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default memo(NonAuthLayoutWrapper);
