// Layouts
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Page404 from "../pages/Page404";

const privateRoutes = [
  { path: "/", component: <Home /> },
];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/register", component: <Register /> },
  { path: "*", component: <Page404 /> }, // 404 sayfası burada
];

export { privateRoutes, publicRoutes };
