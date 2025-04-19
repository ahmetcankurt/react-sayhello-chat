import React, { memo, useEffect, useState } from "react";
import {
  Form,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Input,
} from "reactstrap";

const InviteContactModal = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  /*
  data input handeling
  */
  const [data, setData] = useState({
    email: null,
    name: null,
    message: null,
  });
  useEffect(() => {
    setData({
      email: null,
      name: null,
      message: null,
    });
  }, []);

  const onChangeData = (field, value) => {
    let modifiedData= { ...data };
    if (value === "") {
      modifiedData[field] = null;
    } else {
      modifiedData[field] = value;
    }
    setData(modifiedData);
  };

  /*
  validation
  */
  // const [valid, setValid] = useState(false);
  // useEffect(() => {
  //   if (data.email !== null && data.message !== null && data.name !== null) {
  //     setValid(true);
  //   } else {
  //     setValid(false);
  //   }
  // }, [data]);
  return (
    <Modal isOpen={isOpen} toggle={onClose} tabIndex={-1} centered scrollable >
      <ModalHeader  toggle={onClose} className="bg-primary">
      <div className="modal-title-custom text-white font-size-16 ">
      Create Contact
      </div>
      </ModalHeader>
      <ModalBody className="p-4">
        <Form>
          <div className="mb-3">
            <Label htmlFor="AddContactModalemail-input" className="form-label">
              Email
            </Label>
            <Input
              type="email"
              className="form-control"
              id="AddContactModalemail-input"
              placeholder="Enter Email"
              value={data["email"] || ""}
              onChange={(e) => {
                onChangeData("email", e.target.value);
              }}
            />
          </div>
          <div className="mb-3">
            <Label htmlFor="AddContactModalname-input" className="form-label">
              Name
            </Label>
            <Input
              type="text"
              className="form-control"
              id="AddContactModalname-input"
              placeholder="Enter Name"
              value={data["name"] || ""}
              onChange={(e) => {
                onChangeData("name", e.target.value);
              }}
            />
          </div>
          <div className="">
            <Label
              htmlFor="AddContactModal-invitemessage-input"
              className="form-label"
            >
              Invatation Message
            </Label>
            <textarea
              value={data["message"] || ""}
              onChange={(e) => {
                onChangeData("message", e.target.value);
              }}
              className="form-control"
              id="AddContactModal-invitemessage-input"
              rows={3}
              placeholder="Enter Message"
            ></textarea>
          </div>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="link" className="btn" onClick={onClose}>
          Close
        </Button>
        <Button
          type="button"
          color="primary"
          // disabled={!valid}
          onClick={() => onInvite(data)}
        >
          Invite
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default memo(InviteContactModal)