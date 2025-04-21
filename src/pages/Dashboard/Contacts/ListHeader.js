import React from "react";
import { Button, UncontrolledTooltip, Form, Input } from "reactstrap";

const ListHeader = ({ openModal, search, onChangeSearch }) => {
  return (
    <div className="px-3 pt-4">
      <div className="d-flex align-items-start">
        <div className="flex-grow-1">
          <h4 className="mb-4">Contacts</h4>
        </div>
        <div className="flex-shrink-0">
          <div id="add-contact-button">
            {/* Button trigger modal */}
            <Button
              color="primary"
              type="button"
              onClick={openModal}
              className="btn btn-soft-primary btn-sm"
            >
              <i className="bx bx-plus"></i>
            </Button>
          </div>
          <UncontrolledTooltip target="add-contact-button" placement="bottom">
            Add Contact
          </UncontrolledTooltip>
        </div>
      </div>

      <Form>
        <div className="input-group mb-4">
          <Input
            type="text"
            className="form-control bg-light border-0 pe-0"
            placeholder="Search Contacts.."
            value={search || ""}
            onChange={(e) => onChangeSearch(e.target.value)}
          />
          <button
            className="btn btn-light"
            type="button"
            id="button-searchcontactsaddon"
          >
            <i className="bx bx-search align-middle"></i>
          </button>
        </div>
      </Form>
    </div>
  );
};

export default ListHeader;
