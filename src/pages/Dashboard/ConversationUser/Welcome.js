import { TABS } from "../../../constants";
import { motion, AnimatePresence } from "framer-motion";
import COLORS from "../../../constants/menuColors";

const Welcome = ({ activeTab }) => {
  const getWelcomeContent = () => {
    switch (activeTab) {
      case TABS.CHAT:
        return {
          title: "Sohbete Başla",
          message: "Mesajlaşmak için bir kişi seç veya yeni bir sohbet başlat.",
          icon: "ri-message-2-line",
          color: COLORS.chat,
        };
      case TABS.CONTACTS:
        return {
          title: "Kişi Listesi",
          message: "Tüm kişilerini buradan görüntüleyebilir ve yönetebilirsin.",
          icon: "ri-contacts-line",
          color: COLORS.contacts,
        };
      case TABS.SETTINGS:
        return {
          title: "Ayarlar",
          message: "Uygulama tercihlerini ve profil bilgilerini buradan düzenleyebilirsin.",
          icon: "ri-settings-3-line",
          color: COLORS.settings,
        };
      case TABS.FriendRequest:
        return {
          title: "Arkadaşlık İstekleri",
          message: "Yeni arkadaşlık isteklerini burada görebilir ve onaylayabilirsin.",
          icon: "ri-user-add-line",
          color: COLORS.friendRequest,
        };
      default:
        return {
          title: "Profilim",
          message: "Bu senin profilin. Bilgilerini görüntüleyebilir veya düzenleyebilirsin.",
          icon: "ri-user-line",
          color: COLORS.profile,
        };
    }
  };

  const { title, message, icon, color } = getWelcomeContent();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.4 }}
        className="d-flex flex-column align-items-center justify-content-center h-100 text-center p-4"
      >
        <motion.div
          className="welcome-icon"
          initial={{ y: -30, opacity: 0, scale: 0.8 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <i className={`${icon} display-4`} style={{ color }} />
        </motion.div>

        <motion.h4
          className="mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h4>
        <motion.p
          className="text-muted"
          style={{ color: COLORS.textDark }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default Welcome;
