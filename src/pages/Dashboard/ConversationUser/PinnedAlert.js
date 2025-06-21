import { useState } from "react";
import {
  Alert,
  UncontrolledTooltip,
} from "reactstrap";
import { Link } from "react-router-dom";


const PinnedAlert = ({ onOpenPinnedTab }) => {
  const [visible, setVisible] = useState(true);

  const onDismiss = () => setVisible(false);

  return (
    <Alert
      color="warning"
      isOpen={visible}
      toggle={onDismiss}
      className="topbar-bookmark p-1 px-3 px-lg-4 pe-lg-5 pe-5 alert-dismiss-custom"
      role="alert"
    >
      <div className="d-flex align-items-start bookmark-tabs">
        <div className="tab-list-link">
          <Link to="#" className="tab-links" onClick={onOpenPinnedTab}>
            <i className="ri-pushpin-fill align-middle me-1"></i> 10 Pinned
          </Link>
        </div>
        <div id="add-bookmark">
          <Link to="#" className="tab-links border-0 px-3">
            <i className="ri-add-fill align-middle"></i>
          </Link>
        </div>
        {/* <UncontrolledTooltip target="add-bookmark" placement="bottom">
          Add Bookmark
        </UncontrolledTooltip> */}
      </div>
    </Alert>
  );
};