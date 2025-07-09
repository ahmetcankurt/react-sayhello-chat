export const getFormattedDateGroup = (isoDate) => {
  const date = new Date(isoDate);
  const now = new Date();

  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);
  const startOf7DaysAgo = new Date(startOfToday);
  startOf7DaysAgo.setDate(startOfToday.getDate() - 7);
  const startOf30DaysAgo = new Date(startOfToday);
  startOf30DaysAgo.setDate(startOfToday.getDate() - 30);

  if (date >= startOfToday) return "Bugün";
  if (date >= startOfYesterday) return "Dün";
  if (date >= startOf7DaysAgo) return "Son 7 Gün";
  if (date >= startOf30DaysAgo) return "Son 30 Gün";
  return "30 Günden Önce";
};
