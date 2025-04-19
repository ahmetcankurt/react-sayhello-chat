import React, { useEffect, useState } from "react";



// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import LeftbarTitle from "../../../components/LeftbarTitle";
import BookMark from "./BookMark";


const Index = (props) => {

  const [bookmarks, setBookmarks] = useState([]);
  const onUpdate = () => {
  };

  const onDelete = () => {
  };

 

  return (
    <div className="position-relative">
      {/* {getBookmarksLoading && <Loader />} */}
      <LeftbarTitle title="Bookmark" />
      <AppSimpleBar className="chat-message-list chat-bookmark-list">
        <ul className="list-unstyled chat-list">
          {(bookmarks || []).map((bookmark, key) => (
            <BookMark
              key={key}
              bookmark={bookmark}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </ul>
      </AppSimpleBar>
    </div>
  );
};

export default Index;
