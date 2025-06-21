import { memo } from "react";
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
} from "reactstrap";


const ImageMoreMenu = ({ imagelink, onReply, onDelete }) => {
    return (
        <div className="message-img-link">
            <ul className="list-inline mb-0">
                <UncontrolledDropdown
                    tag="li"
                    color="none"
                    className="list-inline-item dropdown"
                >
                    <DropdownToggle tag="a" role="button" className="btn btn-toggle">
                        <i className="bx bx-dots-horizontal-rounded"></i>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem
                            className="dropdown-item d-flex align-items-center justify-content-between"
                            href={imagelink}
                            download
                        >
                            Download <i className="bx bx-download ms-2 text-muted"></i>
                        </DropdownItem>
                        <DropdownItem
                            tag="a"
                            className=" d-flex align-items-center justify-content-between"
                            href="#"
                            onClick={onReply}
                        >
                            Reply <i className="bx bx-share ms-2 text-muted"></i>
                        </DropdownItem>
                        <DropdownItem
                            tag="a"
                            className=" d-flex align-items-center justify-content-between"
                            href="#"
                            data-bs-toggle="modal"
                            data-bs-target=".forwardModal"
                        >
                            Forward <i className="bx bx-share-alt ms-2 text-muted"></i>
                        </DropdownItem>
                        <DropdownItem
                            tag="a"
                            className=" d-flex align-items-center justify-content-between"
                            href="#"
                        >
                            Bookmark <i className="bx bx-bookmarks text-muted ms-2"></i>
                        </DropdownItem>
                        <DropdownItem
                            tag="a"
                            className=" d-flex align-items-center justify-content-between delete-item"
                            href="#"
                            onClick={onDelete}
                        >
                            Delete <i className="bx bx-trash ms-2 text-muted"></i>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            </ul>
        </div>
    );
};

export default memo(ImageMoreMenu);