import React from "react";
import { Input, Label } from "reactstrap";
import { motion, AnimatePresence } from "framer-motion";

const dropdownVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, x: 20, transition: { duration: 0.2, ease: "easeIn" } },
};

const MoreMenuDropdown = ({ onSelectImages, onSelectFiles, isOpen ,onToggle }) => {
  const handleSelect = (e, type) => {
    const files = [...e.target.files];
    if (files.length) {
      if (type === "image") onSelectImages(files);
      else onSelectFiles(files);
      onToggle(false); // menüyü kapat
    }
  };


  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={dropdownVariants}
          className="p-3"
          style={{
            minWidth: "200px",
            zIndex: 10000,
            backgroundColor: "white",
            borderRadius: "0.25rem",
            boxShadow: "0 0.5rem 1rem rgba(0,0,0,0.15)",
            position: "absolute",       // mutlaka position verilmeli
            bottom: "110%",             // yukarı açılması için
            left: 10,                   // uygun konum için
          }}
        >

          <ul className="list-unstyled m-0 p-0">
            <li className="d-flex align-items-center gap-2 mb-3 position-relative">
              <Input
                id="attached-image-input"
                type="file"
                className="d-none"
                accept="image/*"
                onChange={(e) => handleSelect(e, "image")}
                multiple
              />
              <Label
                htmlFor="attached-image-input"
                className="avatar-xs stretched-link cursor-pointer"
              >
                <span className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                  <i className="bx bx-images"></i>
                </span>
              </Label>
              <h5 className="font-size-11 text-uppercase mb-0 text-body text-truncate">
                Gallery
              </h5>
            </li>

            <li className="d-flex align-items-center gap-2 mb-3 position-relative">
              <Input
                id="attached-audio-input"
                type="file"
                className="d-none"
                accept="audio/*"
                onChange={(e) => handleSelect(e, "audio")}
              />
              <Label
                htmlFor="attached-audio-input"
                className="avatar-xs stretched-link cursor-pointer"
              >
                <span className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                  <i className="bx bx-headphone"></i>
                </span>
              </Label>
              <h5 className="font-size-11 text-uppercase mb-0 text-body text-truncate">
                Audio
              </h5>
            </li>

            <li className="d-flex align-items-center gap-2 position-relative">
              <Input
                id="attached-video-input"
                type="file"
                className="d-none"
                accept="video/*"
                onChange={(e) => handleSelect(e, "video")}
              />
              <Label
                htmlFor="attached-video-input"
                className="avatar-xs stretched-link cursor-pointer"
              >
                <span className="avatar-title font-size-18 bg-soft-primary text-primary rounded-circle">
                  <i className="bx bx-video"></i>
                </span>
              </Label>
              <h5 className="font-size-11 text-uppercase mb-0 text-body text-truncate">
                Video
              </h5>
            </li>
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoreMenuDropdown;
