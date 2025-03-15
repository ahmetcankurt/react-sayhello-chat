import { Routes, Route } from "react-router-dom";
import { AuthProtected } from "./AuthProtected";

// Layouts
import { privateRoutes, publicRoutes } from "./allRoutes";

import { HashRouter } from "react-router-dom";

export default function Index() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}
