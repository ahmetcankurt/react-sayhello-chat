import { motion } from 'framer-motion';

const NewMessageAlert = ({ newMessageAlert, handleNewMessageAlertClick }) => {
  return (
    newMessageAlert && (
        <motion.div
          className="new-message-alert"
          onClick={handleNewMessageAlertClick}
          initial={{ opacity: 0, y: 50 }} // Başlangıçta görünmez ve alttan gelir
          animate={{ opacity: 1, y: 0 }}  // Görünür hale gelir ve yerine oturur
          transition={{ type: 'spring', stiffness: 300, damping: 25 }} // Sıçrayarak gelir
        >
          <motion.span
            className="new-message-alert-span"
            initial={{ opacity: 0, scale: 0.5 }} // Başlangıçta küçük ve görünmez
            animate={{ opacity: 1, scale: 1 }} // Büyüyüp görünür hale gelir
            transition={{ type: 'spring', stiffness: 200, damping: 25 }} // Yumuşak bir animasyon
          >
            Yeni Mesaj
          </motion.span>
        </motion.div>
    )
  );
};

export default NewMessageAlert;
