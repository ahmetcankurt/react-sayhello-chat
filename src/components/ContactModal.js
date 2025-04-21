import { useEffect, useState } from "react";
import classnames from "classnames";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  InputGroup,
} from "reactstrap";

// components
import AppSimpleBar from "./AppSimpleBar";
import EmptyStateResult from "./EmptyStateResult";

//utils
import { divideByKey } from "../utils";


const ContactItem = ({
  contact,
  selected,
  onSelectContact,
}) => {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const onClick = () => {
    onSelectContact(contact.id, !selected);
  };

  return (
    <li className={classnames({ selected: selected })} onClick={onClick}>
      <div>
        <h5 className="font-size-14 m-0">{fullName}</h5>
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
            />
          );
        })}
      </ul>
    </div>
  );
};

const ContactModal = ({ isOpen, onClose, onAddContact }) => {

  const categorizedContacts = [
    {
      letter: "A",
      data: [
        {
          id: 1,
          firstName: "Alice",
          lastName: "Anderson",
        },
        {
          id: 2,
          firstName: "Aaron",
          lastName: "Adams",
        },
      ],
    },
    {
      letter: "B",
      data: [
        {
          id: 3,
          firstName: "Bob",
          lastName: "Brown",
        },
        {
          id: 4,
          firstName: "Bill",
          lastName: "Baker",
        },
      ],

    }
  ]



  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    setContacts(categorizedContacts);
  }, [categorizedContacts]);

  const contactsList = {
  }

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

  const onSubmit = () => {
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      tabIndex={-1}
      centered
      className="contactModal"
    >
      <ModalHeader toggle={onClose} className="bg-primary">
        <div className="modal-title modal-title-custom text-white font-size-16 bg-primary ">
          Contacts
        </div>
      </ModalHeader>
      <ModalBody className="p-4">
        <InputGroup className="mb-4">
          <Input
            type="text"
            className="form-control bg-light border-0 pe-0"
            placeholder="Search here.."
            aria-label="Example text with button addon"
            aria-describedby="contactSearchbtn-addon"
            value={search || ""}
            onChange={(e) => {
              onChangeSearch(e.target.value);
            }}
          />
          <Button color="light" type="button" id="contactSearchbtn-addon">
            <i className="bx bx-search align-middle"></i>
          </Button>
        </InputGroup>

        {totalC === 0 ? (
          <EmptyStateResult searchedText={search} />
        ) : (
          <>
            <div className="d-flex align-items-center px-1">
              <div className="flex-grow-1">
                <h4 className=" font-size-11 text-muted text-uppercase">
                  Contacts
                </h4>
              </div>
            </div>
            <AppSimpleBar
              className="contact-modal-list mx-n4 px-1"
              style={{ maxHeight: "200px" }}
            >
              {(contacts || []).map(
                (letterContacts, key) => (
                  <CharacterItem
                    letterContacts={letterContacts}
                    key={key}
                    index={key}
                    // totalContacts={totalContacts}
                    // selectedContacts={selectedContacts}
                    // onSelectContact={onSelectContact}
                  />
                )
              )}
            </AppSimpleBar>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="link" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          color="primary"
          // disabled={disabled}
          onClick={onSubmit}
        >
          <i className="bx bxs-send align-middle"></i>
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default ContactModal;
