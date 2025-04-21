import React, { useState, useEffect, memo } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";


const UpdateDeleteBookmark = ({
  isOpen,
  onClose,
  onUpdate,
  bookmark,
}) => {
  /*
   data input handeling
   */
  const [data, setData] = useState({
    bookmarkTitle: bookmark.title,
  });

  const onChangeData = (field, value) => {
    let modifiedData = { ...data };
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
  const [valid, setValid] = useState(false);
  useEffect(() => {
    if (data.bookmarkTitle !== null) {
      setValid(true);
    } else {
      setValid(false);
    }
  }, [data]);

  /*
    submit data
    */
  const onSubmit = () => {
    onUpdate(data);
  };
  return (
    <Modal isOpen={isOpen} toggle={onClose}>
      <ModalHeader className="modal-title-custom text-white font-size-16" toggle={onClose}>
        Update Bookmark
      </ModalHeader>
      <ModalBody>
        <Form>
          <FormGroup>
            <Label htmlFor="update-bookmark" className="mb-2">
              Bookmark Title
            </Label>
            <Input
              type="text"
              name="email"
              id="update-bookmark"
              placeholder="add bookmark title"
              value={data.bookmarkTitle || ""}
              onChange={(e) => {
                onChangeData("bookmarkTitle", e.target.value);
              }}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button type="button" color="none" onClick={onClose}>
          Close
        </Button>
        <Button color="primary" disabled={!valid} onClick={onSubmit}>
          Update
        </Button>{" "}
      </ModalFooter>
    </Modal>
  );
};

export default memo(UpdateDeleteBookmark);
