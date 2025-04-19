import React, { useEffect, useState } from "react";

// components
import Loader from "../../../components/Loader";
import AppSimpleBar from "../../../components/AppSimpleBar";
import LeftbarTitle from "../../../components/LeftbarTitle";
import Call from "./Call";



const Index = (props) => {
  const [callsList, setCallsList] = useState([]);

  return (
    <div className="position-relative">
      {/* {getCallsLoading && <Loader />} */}
      <LeftbarTitle title="Calls" />
      {/* end p-4 */}

      {/* Start contact lists */}
      <AppSimpleBar className="chat-message-list chat-call-list">
        <ul className="list-unstyled chat-list">
          {(callsList || []).map((call, key) => (
            <Call call={call} key={key} />
          ))}
        </ul>
      </AppSimpleBar>
      {/* end contact lists */}
    </div>
  );
};

export default Index;
