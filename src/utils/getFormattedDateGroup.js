// utils/messageDateGroup.js
export const getFormattedDateGroup = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday) return "Bugün";
  if (isYesterday) return "Dün";

  return date.toLocaleDateString("tr-TR"); // örnek: 25.06.2025
};
