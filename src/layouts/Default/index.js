
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import SideMenu from "./SideMenu";
import { memo } from "react";
const Index = ({children}) => {

  return (
    <div className="layout-wrapper d-lg-flex">
      <SideMenu  />

      {children}
      <ToastContainer autoClose={2000} />
    </div>
  );
};

export default memo(Index)
