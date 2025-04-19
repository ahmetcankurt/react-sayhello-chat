import { APIClient } from "./apiCore";
import * as url from "./urls";

const api = new APIClient();

const getFavourites = () => {
  return api.get(url.GET_FAVOURITES);
};

const getDirectMessages = () => {
  return api.get(url.GET_DIRECT_MESSAGES);
};
const getChannels = () => {
  return api.get(url.GET_CHANNELS);
};

const addContacts = (contacts) => {
  return api.create(url.ADD_CONTACTS, contacts);
};

const createChannel = (data: object) => {
  return api.create(url.CREATE_CHANNEL, data);
};

const getChatUserDetails = (id | number) => {
  return api.get(url.GET_CHAT_USER_DETAILS + "/" + id, { params: { id } });
};

const getChatUserConversations = (id | number) => {
  return api.get(url.GET_CHAT_USER_CONVERSATIONS + "/" + id, {
    params: { id },
  });
};

const sendMessage = (data: object) => {
  return api.create(url.SEND_MESSAGE, data);
};

const receiveMessage = (id | number) => {
  return api.update(url.RECEIVE_MESSAGE + "/" + id, { params: { id } });
};

const readMessage = (id | number) => {
  return api.update(url.READ_MESSAGE + "/" + id, { params: { id } });
};

const receiveMessageFromUser = (id | number) => {
  return api.get(url.RECEIVE_MESSAGE_FROM_USER + "/" + id, {
    params: { id },
  });
};

const deleteMessage = (userId | string, messageId | string) => {
  return api.delete(url.DELETE_MESSAGE + "/" + userId + "/" + messageId, {
    params: { userId, messageId },
  });
};

const forwardMessage = (data: object) => {
  return api.create(url.FORWARD_MESSAGE, data);
};

const deleteUserMessages = (userId | string) => {
  return api.delete(url.DELETE_USER_MESSAGES + "/" + userId, {
    params: { userId },
  });
};

const getChannelDetails = (id | number) => {
  return api.get(url.GET_CHANNEL_DETAILS + "/" + id, { params: { id } });
};

const toggleFavouriteContact = (id | number) => {
  return api.update(url.TOGGLE_FAVOURITE_CONTACT + "/" + id, {
    params: { id },
  });
};

/*
archive
*/
const getArchiveContact = () => {
  return api.get(url.GET_ARCHIVE_CONTACT);
};

const toggleArchiveContact = (id | number) => {
  return api.update(url.TOGGLE_ARCHIVE_CONTACT + "/" + id, { params: { id } });
};

const readConversation = (id | number) => {
  return api.update(url.READ_CONVERSATION + "/" + id, { params: { id } });
};

const deleteImage = (
  userId | string,
  messageId | string,
  imageId | string
) => {
  return api.delete(url.DELETE_IMAGE + "/" + userId + "/" + messageId, {
    params: { userId, messageId, imageId },
  });
};

export {
  getFavourites,
  getDirectMessages,
  getChannels,
  addContacts,
  createChannel,
  getChatUserDetails,
  getChatUserConversations,
  sendMessage,
  receiveMessage,
  readMessage,
  receiveMessageFromUser,
  deleteMessage,
  forwardMessage,
  deleteUserMessages,
  getChannelDetails,
  toggleFavouriteContact,
  getArchiveContact,
  toggleArchiveContact,
  readConversation,
  deleteImage,
};
