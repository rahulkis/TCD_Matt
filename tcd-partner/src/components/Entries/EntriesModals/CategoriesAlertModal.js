import React from "react";
import { Modal } from "react-bootstrap";

function CategoriesAlertModal({ show, close, message }) {

  return (
    <>
      <Modal centered show={show} onHide={close}>
        <form className="help_modal">
          <Modal.Header>
            <Modal.Title>Alert</Modal.Title>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={close}
            />
          </Modal.Header>
          <Modal.Body>
            <div className="row">
              <div className="col-lg-12">
                <p>{message}</p>
              </div>
            </div>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

export default CategoriesAlertModal;
