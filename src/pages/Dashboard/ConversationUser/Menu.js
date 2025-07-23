import { memo } from "react";
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
} from "reactstrap";
import FormatTime from "./ForTime";

const Menu = ({
  onDelete,
  onReply,
  onForward,
  messageId,
  canDeleteForEveryone,
  Time,
  handleAllDeleteMessage }) => {
  return (
    <UncontrolledDropdown className="align-self-start message-box-drop">
      <DropdownToggle className="btn mb-0 pb-0 btn-toggle" role="button" tag={"a"}>
        <i className="ri-more-2-fill"></i>
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem header className="text-muted small">
          Tarih : {FormatTime(Time)}
        </DropdownItem>
        <DropdownItem onClick={onReply}>
          Reply <i className="bx bx-share ms-2 text-muted"></i>
        </DropdownItem>
        {/* <DropdownItem onClick={onForward}>
          Forward <i className="bx bx-share-alt ms-2 text-muted"></i>
        </DropdownItem>
        <DropdownItem
          onClick={() => {
            navigator.clipboard.writeText(messageId).catch(() => {});
          }}
        >
          Copy <i className="bx bx-copy text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem onClick={() => alert("Bookmark özelliği geliştirilmedi")}>
          Bookmark <i className="bx bx-bookmarks text-muted ms-2"></i>
        </DropdownItem>
        <DropdownItem onClick={() => alert("Mark as Unread özelliği geliştirilmedi")}>
          Mark as Unread <i className="bx bx-message-error text-muted ms-2"></i>
        </DropdownItem> */}

        {/* Herkesten silme sadece izin varsa */}
        {/* {canDeleteForEveryone && ( */}
        <DropdownItem
          className="d-flex align-items-center justify-content-between delete-item"
          onClick={() => {
            if (
              window.confirm("Mesajı herkesten silmek istediğinize emin misiniz?")
            ) {
              if (handleAllDeleteMessage) {
                handleAllDeleteMessage(messageId, true);
              }
            }
          }}
        >
          Herkesten Sil <i className="bx bx-trash text-muted ms-2"></i>
        </DropdownItem>
        {/* )} */}

        {/* Sadece kendinden sil */}
        <DropdownItem
          className="d-flex align-items-center justify-content-between delete-item"
          onClick={() => onDelete(messageId, false)}
        >
          Kendimden Sil <i className="bx bx-trash text-muted ms-2"></i>
        </DropdownItem>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};


export default memo(Menu);
