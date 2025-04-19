import { toast } from "react-toastify";

const showSuccessNotification = (message) => {
  toast.success(message);
};

const showErrorNotification = (error) => {
  toast.error(error);
};

export { showSuccessNotification, showErrorNotification };
