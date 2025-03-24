import { Routes, Route, BrowserRouter } from "react-router-dom"; // BrowserRouter da kullanılabilir

import { privateRoutes, publicRoutes } from "./allRoutes";
import { AuthProtected } from "./AuthProtected";

export default function Index() {
  return (
    <BrowserRouter> 
      <Routes>
        {privateRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<AuthProtected>{route.component}</AuthProtected>}
            key={idx}
          />
        ))}
        {publicRoutes.map((route, idx) => (
          <Route path={route.path} element={<>{route.component}</>} key={idx} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
