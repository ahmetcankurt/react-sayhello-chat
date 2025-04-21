export const formatDate = (dateStr) => {
    const today = new Date();
    const messageDate = new Date(dateStr);
  
    if (
      messageDate.getFullYear() === today.getFullYear() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getDate() === today.getDate()
    ) {
      return "Bugün";
    }
  
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
  
    if (
      messageDate.getFullYear() === yesterday.getFullYear() &&
      messageDate.getMonth() === yesterday.getMonth() &&
      messageDate.getDate() === yesterday.getDate()
    ) {
      return "Dün";
    }
  
    return new Intl.DateTimeFormat("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(messageDate);
  };
  