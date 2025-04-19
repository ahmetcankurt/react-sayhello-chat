import React, { useState } from "react";
import classnames from "classnames";

import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
  Collapse,
  Form,
} from "reactstrap";


// components
import AppSimpleBar from "./AppSimpleBar";

const ContactItem = ({
  contact,
  selected,
  onSelectContact,
}) => {
  const fullName = `${contact.firstName} ${contact.lastName}`;
  const onCheck = (checked) => {
    onSelectContact(contact.id, checked);
  };

  return (
    <li>
      <div className="form-check">
        <Input
          type="checkbox"
          className="form-check-input"
          id={`contact-${contact.id}`}
          onChange={(e) => {
            onCheck(e.target.checked)
          }}
          value={fullName}
        />
        <Label className="form-check-label" htmlFor={`contact-${contact.id}`}>
          {fullName}
        </Label>
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
    <div>
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

const AddGroupModal = ({
  isOpen,
  onClose,
  onCreateChannel,
}) => {
  /*
    collapse handeling
    */
  const [isOpenCollapse, setIsOpenCollapse] = useState(false);
  const toggleCollapse = () => {
    setIsOpenCollapse(!isOpenCollapse);
  };

  /*
    contacts hook
    */

  const totalContacts =  2;

  const categorizedContacts = [
    {
      letter: "A",
      data: [
        { id: 1, firstName: "John", lastName: "Doe" },
        { id: 2, firstName: "Jane", lastName: "Smith" },
      ],
    },
    {
      letter: "B",
      data: [
        { id: 3, firstName: "Bob", lastName: "Brown" },
        { id: 4, firstName: "Alice", lastName: "Johnson" },
      ],
    },
  ];
  /*
  select contacts
  */
  const [selectedContacts, setSelectedContacts] = useState([]);
  const onSelectContact = (id, selected) => {
    let modifiedList = [...selectedContacts];
    if (selected) {
      modifiedList = [...modifiedList, id];
    } else {
      modifiedList = modifiedList.filter(m => m + "" !== id + "");
    }
    setSelectedContacts(modifiedList);
  };

  /*
    data
    */
  const [data, setData] = useState({
    id : "",
    channelName: "",
    description: "",
  });
  const onDataChange = (field, value) => {
    let modifiedData = { ...data };
    modifiedData[field] = value;
    setData(modifiedData);
  };

  /*
    disale button
    */
  // const [valid, setValid] = useState(false);
  // useEffect(() => {
  //   if (
  //     selectedContacts.length === 0 &&
  //     !data.description &&
  //     data.description === ""
  //   ) {
  //     setValid(false);
  //   } else {
  //     setValid(true);
  //   }
  // }, [selectedContacts, data]);

  /*
    submit data
    */
  const onSubmit = () => {
    const params = {
      id : data.id,
      name: data.channelName,
      members: selectedContacts,
      description: data.description,
    };
    onCreateChannel(params);
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={onClose}
      tabIndex={-1}
      centered
      scrollable
      color="white"
      id="addgroup-exampleModal"
      role="dialog">
      {/* <ModalHeader className="modal-title-custom bg-primary " toggle={onClose} >
      Create New Group
     </ModalHeader> */}
     <ModalHeader toggle={onClose} className="bg-primary">
      <div className="modal-title modal-title-custom text-white bg-primary font-size-16">
      Create New Group
      </div>
     </ModalHeader>
      {/* <div className="modal-title text-white font-size-16 bg-primary text-white">
        creact new grop
      </div> */}

      <ModalBody className="p-4">
        <Form>
          <div className="mb-4">
            <Label htmlFor="addgroupname-input" className="form-label">
              Group Name
            </Label>
            <Input
              type="text"
              className="form-control"
              id="addgroupname-input"
              placeholder="Enter Group Name"
              value={data.channelName || ""}
              onChange={(e) => {
                onDataChange("channelName", e.target.value);
              }}
            />
          </div>
          <div className="mb-4">
            <label className="form-label">Group Members</label>
            <div className="mb-3">
              <Button
                color="light"
                size="sm"
                type="button"
                onClick={toggleCollapse}
              >
                Select Members
              </Button>
            </div>

            <Collapse isOpen={isOpenCollapse} id="groupmembercollapse">
              <div className="card border">
                <div className="card-header">
                  <h5 className="font-size-15 mb-0">Contacts</h5>
                </div>
                <div className="card-body p-2">
                  <AppSimpleBar style={{ maxHeight: "150px" }}>
                    {(categorizedContacts || []).map(
                      (letterContacts, key) => (
                        <CharacterItem
                          letterContacts={letterContacts}
                          key={key}
                          index={key}
                          totalContacts={totalContacts}
                          selectedContacts={selectedContacts}
                          onSelectContact={onSelectContact}
                        />
                      )
                    )}
                  </AppSimpleBar>
                </div>
              </div>
            </Collapse>
          </div>
          <div className="mb-3">
            <Label htmlFor="addgroupdescription-input" className="form-label">
              Description
            </Label>
            <textarea
              className="form-control"
              id="addgroupdescription-input"
              rows={3}
              placeholder="Enter Description"
              value={data.description || ""}
              onChange={(e) => {
                onDataChange("description", e.target.value);
              }}
            />
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="link" type="button" onClick={onClose}>
          Close
        </Button>
        <Button
          type="button"
          color="primary"
          onClick={onSubmit}
          // disabled={!valid}
        >
          Create Groups
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddGroupModal;