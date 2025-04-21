export const formatMessageDate = (dateStr) => {
  const messageDate = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1, d2) =>
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear();

  if (isSameDay(messageDate, today)) {
    return "Bugün";
  } else if (isSameDay(messageDate, yesterday)) {
    return "Dün";
  } else {
    return messageDate.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }
};

