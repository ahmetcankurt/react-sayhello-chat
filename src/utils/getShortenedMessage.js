export const getShortenedMessage = (message, maxLength = 20) =>
    message?.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
  
export const getShortenedNotification = (message, maxLength = 70) =>
    message?.length > maxLength ? `${message.slice(0, maxLength)}...` : message;
  