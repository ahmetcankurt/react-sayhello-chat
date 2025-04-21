import Root from "../pages/Root/index";
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
// import RecoverPassword from "../pages/Authentication/RecoverPassword";
// import ChangePassword from "../pages/Authentication/ChangePassword";
// import LockScreen from "../pages/Authentication/LockScreen";

// dashboard
import Dashboard from "../pages/Dashboard/index";

const publicRoutes = [
  { path: "/auth-login", component: <Login /> },
  { path: "/auth-register", component: <Register /> },
  // { path: "/auth-recoverpw", component: <RecoverPassword /> },
  // { path: "/auth-changepassword", component: <ChangePassword /> },
  // { path: "/auth-lock-screen", component: <LockScreen /> },
  { path: "/logout", component: <Logout /> },
];

const privateRoutes = [
  { path: "/dashboard", component: <Dashboard /> },
  { path: "/",  component: <Root /> },
  { path: "*",  component: <Root/> },
];

export { publicRoutes, privateRoutes };
