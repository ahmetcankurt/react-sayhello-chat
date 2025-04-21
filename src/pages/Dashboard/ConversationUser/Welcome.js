import React from "react";
import { Button, Col, Row } from "reactstrap";

const Welcome = () => {
  return (
    <div className="chat-welcome-section">
      <Row className="w-100 justify-content-center">
        <Col xxl={5} md={7}>
          <div className="p-4 text-center">
            <div className="avatar-xl mx-auto ">
              <div className="avatar-title bg-soft-primary rounded-circle">
                <i className="bx bxs-message-alt-detail display-4 text-primary m-0"></i>
              </div>
            </div>
            <h4 className="text-primary my-3">Hoş geldiniz!</h4>
            <p className="text-muted ">
              Hoş geldiniz! Burada anlık mesajlaşmalar yapabilir, sevdiklerinizle hızlı ve kolay iletişim kurabilirsiniz.
            </p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Welcome;
