import React, { memo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SplashScreen = ({ isPageLoaded }) => {
  return (
    <AnimatePresence>
      {!isPageLoaded && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="splash-screen"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "#fff",
            zIndex: 100000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1>Yükleniyor</h1>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "5px",
                marginTop: "1rem",
              }}
            >
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: 0,
                }}
                style={{ fontSize: "2rem" }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: 0.2,
                }}
                style={{ fontSize: "2rem" }}
              >
                .
              </motion.span>
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 0.6,
                  ease: "easeInOut",
                  delay: 0.4,
                }}
                style={{ fontSize: "2rem" }}
              >
                .
              </motion.span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(SplashScreen)