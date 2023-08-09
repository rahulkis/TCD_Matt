import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

function NeedHelpModal({ show, close }) {

  return (
    <>
      <Modal centered show={show} onHide={close}>
        <form className="help_modal">
          <Modal.Header>
            <Modal.Title>Need help with advertising?</Modal.Title>
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
                <p>Advertising with Cannabis Diary is different than most of ad platforms. A brands can
                  purchase an ad package quickly and easily. Need help getting set up?
                </p>
              </div>
              <div>
                <Link to="">Visit our Knowledge Base</Link>
              </div>

              <div className="mt-4">
                <h5>FAQ</h5>
              </div>
              <div className="mt-2 d-flex flex-column">
                <Link to="">Visit our Knowledge Base</Link>
                <Link to="">Visit our Knowledge Base</Link>
                <Link to="">Visit our Knowledge Base</Link>
              </div>
            </div>
          </Modal.Body>
        </form>
      </Modal>
    </>
  );
}

export default NeedHelpModal;
