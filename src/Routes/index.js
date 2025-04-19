import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import DefaultLayout from "../layouts/Default/index";

// layouts
import NonAuthLayout from "../layouts/NonAuth/index";
import { AuthProtected } from "./AuthProtected";

import { publicRoutes, privateRoutes } from "./allRoutes";

const Index = () => {

  return (
    <Routes>
      <Route>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <NonAuthLayout>
                {route.component}
              </NonAuthLayout>
            }
            key={idx}
          />
        ))}
      </Route>

      <Route>
        {privateRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <AuthProtected>
                <DefaultLayout>
                  {route.component}
                </DefaultLayout>
              </AuthProtected>
            }
            key={idx}
          exact={true}
          />
        ))}
      </Route>
    </Routes>
  );
};

export default Index;