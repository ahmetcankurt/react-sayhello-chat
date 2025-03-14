import { formatDate } from "../../utils/groupMessagesByDate";

export const groupMessagesByDate = (messages) => {
    const grouped = {};
    messages.forEach((message) => {
        const formattedDate = formatDate(message.createdAt);
        if (!grouped[formattedDate]) {
            grouped[formattedDate] = [];
        }
        grouped[formattedDate].push(message);
    });
    return grouped;
};