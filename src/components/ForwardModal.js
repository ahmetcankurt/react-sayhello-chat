import React, { useState, useEffect } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import classnames from "classnames";

import AppSimpleBar from "./AppSimpleBar";
//utils
import {  divideByKey } from "../utils";
import EmptyStateContacts from "./EmptyStateResult";

const ForwardMessage = ({
  forwardData,
  chatUserDetails,
}) => {

  const userProfile = {
    uid: "12345",
    firstName: "John",
    lastName: "Doe",
  };
  const useContacts = {}
  const replyUserName = chatUserDetails.firstName
    ? `${chatUserDetails.firstName} ${chatUserDetails.lastName}`
    : "-";
  const isReplyFromMe =
    forwardData && forwardData.meta.sender + "" === userProfile.uid + "";

  return (
    <div className="replymessage-block mb-2">
      <h5 className="conversation-name">
        {isReplyFromMe ? "You" : replyUserName}
      </h5>
      {forwardData?.text && <p className="mb-0">{forwardData?.text}</p>}

      {(forwardData?.image || forwardData?.attachments) && (
        <p className="mb-0">
          {forwardData?.attachments &&
            !forwardData?.image &&
            `${forwardData?.attachments.length} Files`}
          {forwardData?.image &&
            !forwardData?.attachments &&
            `${forwardData?.image.length} Images`}
          {forwardData?.image &&
            forwardData?.attachments &&
            `${forwardData?.attachments.length} Files & ${forwardData?.image.length} Images`}
        </p>
      )}
    </div>
  );
};


const ContactItem = ({
  contact,
  selected,
  onSelectContact,
  onSend,
}) => {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const onClick = () => {
    onSelectContact(contact.id, !selected);
    if (!selected) {
      onSend([contact.id]);
    }
  };

  return (
    <li>
      <div className="d-flex align-items-center">
        <div className="flex-grow-1">
          <h5 className="font-size-14 m-0">{fullName}</h5>
        </div>
        <div className="flex-shrink-0">
          {!selected ? (
            <Button size="sm" color="primary" type="button" onClick={onClick}>
              Send
            </Button>
          ) : (
            <Button size="sm" color="light" type="button" onClick={onClick}>
              Undo
            </Button>
          )}
        </div>
      </div>
    </li>
  );
};

const CharacterItem = ({
  letterContacts,
  index,
  totalContacts,
  selectedContacts,
  onSelectContact,
  onSend,
}) => {
  return (
    <div className={classnames({ "mt-3": index !== 0 })}>
      <div className="contact-list-title">{letterContacts.letter}</div>

      <ul
        className={classnames("list-unstyled", "contact-list", {
          "mb-0": index + 1 === totalContacts,
        })}
      >
        {(letterContacts.data || []).map((contact, key) => {
          const selected = selectedContacts.includes(contact.id);
          return (
            <ContactItem
              contact={contact}
              key={key}
              selected={selected}
              onSelectContact={onSelectContact}
              onSend={onSend}
            />
          );
        })}
      </ul>
    </div>
  );
};


const ForwardModal = ({
  isOpen,
  onClose,
  forwardData,
  chatUserDetails,
  onForward,
}) => {

  const contactsList = {
    contacts: [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
      },
      {
        id: 3,
        firstName: "Alice",
        lastName: "Johnson",
      },
    ],
  };

  const categorizedContacts = ""
    ? divideByKey("firstName", contactsList.contacts)
    : contactsList.contacts;
  const [totalContacts, setTotalContacts] = useState(totalContacts);
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    setContacts(categorizedContacts);
  }, [categorizedContacts]);

  /*
  contact search
  */
  const [search, setSearch] = useState("");
  const onChangeSearch = (value) => {
    setSearch(value);
    let modifiedContacts = [...contactsList];
    let filteredContacts = (modifiedContacts || []).filter((c) =>
      c["firstName"].toLowerCase().includes(value.toLowerCase())
    );
    const formattedContacts = divideByKey("firstName", filteredContacts);
    setContacts(formattedContacts);
  };

  const totalC = (contacts || []).length;
  
  const [selectedContacts, setSelectedContacts] = useState([]);
  const onShareAll = () => {
    const allIds = (contactsList || []).map((c) => c.id);
    setSelectedContacts(allIds);
    const data = {
      contacts: [...allIds],
      message: message,
    };
    onForward(data);
  };

  /*
  message
  */
  const [message, setMessage] = useState();
  const onChangeMessage = (value) => {
    setMessage(value);
  };

  /*
  submit data
  */
  const onSend = (contacts) => {
    const data = {
      contacts: [...contacts],
      message: message,
    };
    onForward(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      centered
      className="forwardModal"
      tabIndex={-1}
    >
      <ModalHeader className="modal-title-custom text-white font-size-16" toggle={onClose}>
      Share this Message
      </ModalHeader>
      <ModalBody className="p-4">
        <div>
          <ForwardMessage
            forwardData={forwardData}
            chatUserDetails={chatUserDetails}
          />
          <textarea
            className="form-control"
            placeholder="Type your message..."
            rows={2}
            value={message || ""}
            onChange={(e) => {
              onChangeMessage(e.target.value);
            }}
          ></textarea>
        </div>
        <hr className="my-4" />
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control bg-light border-0 pe-0"
            placeholder="Search here.."
            aria-label="Example text with button addon"
            aria-describedby="forwardSearchbtn-addon"
            value={search || ""}
            onChange={(e) => {
              onChangeSearch(e.target.value);
            }}
          />
          <button
            className="btn btn-light"
            type="button"
            id="forwardSearchbtn-addon"
          >
            <i className="bx bx-search align-middle"></i>
          </button>
        </div>
        {totalC === 0 ? (
          <EmptyStateContacts searchedText={search} />
        ) : (
          <>
            <div className="d-flex align-items-center px-1">
              <div className="flex-grow-1">
                <h4 className="mb-0 font-size-11 text-muted text-uppercase">
                Kişiler
                </h4>
              </div>
              <div className="flex-shrink-0">
                <Button
                  size="sm"
                  color="primary"
                  type="button"
                  onClick={onShareAll}
                >
                  Share All
                </Button>
              </div>
            </div>
            <AppSimpleBar style={{ maxHeight: "150px" }} className="mx-n4 px-1">
              {(contacts || []).map(
                (letterContacts, key) => (
                  <CharacterItem
                    letterContacts={letterContacts}
                    key={key}
                    index={key}
                    totalContacts={totalContacts}
                    selectedContacts={selectedContacts}
                    // onSelectContact={onSelectContact}
                    onSend={onSend}
                  />
                )
              )}
            </AppSimpleBar>
          </>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ForwardModal;
