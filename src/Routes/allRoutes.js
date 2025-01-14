
// Pages > web
import Pages from "../pages/web";

const publicRoutes= [
  { path: "/", exact: true, component: <Pages /> },
  { path: "*", component: <div>404</div> },
];

const publicRoutesLogin = [
// { path: "/login", component: <Login /> },
];


export {  publicRoutes , publicRoutesLogin };
