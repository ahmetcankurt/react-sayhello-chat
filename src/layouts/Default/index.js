import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

// components
import SideMenu from "./SideMenu";
import { memo } from "react";

const Index = ({ children }) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="layout-wrapper d-lg-flex"
        style={{ overflow: "hidden", width: "100%" }}
    >
      <SideMenu />
      {children}
      <ToastContainer autoClose={2000} />
    </motion.div>
  );
};

export default memo(Index);
