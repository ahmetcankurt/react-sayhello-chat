import { APIClient } from "./apiCore";
import * as url from "./urls";

const api = new APIClient();

const getBookmarks = () => {
  return api.get(url.GET_BOOKMARKS_LIST);
};

const deleteBookmark = (id) => {
  return api.delete(url.DELETE_BOOKMARK + "/" + id, { params: { id } });
};

const updateBookmark = (id, data: object) => {
  return api.update(url.UPDATE_BOOKMARK + "/" + id, data);
};

export { getBookmarks, deleteBookmark, updateBookmark };
