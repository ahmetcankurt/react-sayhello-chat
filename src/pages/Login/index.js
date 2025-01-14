import { memo, useState } from "react";
import RegisterForm from "./RegisterForm"
import LoginForm from "./LoginForm"
import "./login.css";

function Login() {
  const [activeTab, setActiveTab] = useState("login"); // 'register' default olarak ayarlanmış

  return (
    <div className="login-bg">
      {activeTab === "login" ? (
        <LoginForm setActiveTab={setActiveTab} activeTab={activeTab} />
      ) : (
        <RegisterForm setActiveTab={setActiveTab} activeTab={activeTab} />
      )}
    </div>
  );
}

export default memo(Login)
