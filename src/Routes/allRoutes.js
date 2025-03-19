
// Pages > web
import Login from "../pages/Login";
import Home from "../pages/Home";
import Register from "../pages/Register";

const privateRoutes = [
  { path: "/", component: <Home /> },
  { path: "*", component: <div>404</div> },
];

const publicRoutes = [
  { path: "/login",  exact: true, component: <Login /> },
  { path: "/register", component: <Register /> },
];


export { privateRoutes, publicRoutes };
