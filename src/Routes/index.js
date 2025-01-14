import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProtected } from "./AuthProtected";
import { publicRoutes, publicRoutesLogin } from "./allRoutes";

// Layouts
import { createHashHistory } from "history";

import EditorEdit from "../pages/editor/index";
import WebPages from "../pages/web";

import { errorSwal } from "..//Editor/Hooks/Sweetalert2";

import pagesApi from "../Editor/Mock/pagesApi";

const hashHistory = createHashHistory();

export default function Index() {
  const [apiRoutes, setApiRoutes] = useState([]);

  useEffect(() => {
    try {
      setApiRoutes(pagesApi);
    } catch (error) {
      errorSwal("Sayfalar alınırken bir hata oluştu!");
    }
  }, []);

  const privateRoutes = apiRoutes.map((routeData) => ({
    path: `${routeData.url}-editor`,
    component: <EditorEdit />,
  }));

  const dynamicpublicRoutesApi = apiRoutes.map((routeData) => ({
    path: `${routeData.url}`,
    component: <WebPages />,
  }));

  const dynamicpublicRoutesApiAll = [
    ...dynamicpublicRoutesApi,
    ...publicRoutes,
  ];

  return (
    <Routes history={hashHistory}>
      {privateRoutes.map((route, idx) => (
        <Route
          path={route.path}
          element={<AuthProtected>{route.component}</AuthProtected>}
          key={idx}
        />
      ))}

      {publicRoutesLogin.map((route, idx) => {
        return (
          <Route path={route.path} element={<>{route.component}</>} key={idx} />
        );
      })}

      {dynamicpublicRoutesApiAll.map((route, idx) => {
        return <Route path={route.path} element={route.component} key={idx} />;
      })}
    </Routes>
  );
}
