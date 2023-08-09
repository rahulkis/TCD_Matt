import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { httpClient } from "../../../constants/Api";
import { ADVERTISEMENT } from "../../../constants/AppConstant";

function StartCampaignModal({ show, close, name, id }) {
  const [loading, setLoading] = useState(false);
  const [campaignName, setCampaignName] = useState(name);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const partnerId = localStorage.getItem("partner");
      const isValid = await validateCampaign(campaignName);
      const value = {
        campaign_name: campaignName.trim(),
        id: JSON.parse(partnerId).id,
      };
      if (isValid) {
        setLoading(true);
        if (id) {
          const res = await httpClient.put(
            ADVERTISEMENT.UPDATE_CAMPAIGN.replace("{campaignId}", id),
            { campaign_name: campaignName.trim() }
          );
          if (res.data.success) {
            toast.success(res.data.message);
            close();
          }
        } else {
          const res = await httpClient.post(
            ADVERTISEMENT.START_CAMPAIGN,
            value
          );
          if (res.data.success) {
            toast.success(res.data.message);
            close();
          }
        }
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };

  const validateCampaign = (campaignName) => {
    let isValid = true;
    if (campaignName.trim() === "") {
      toast.error("Please Enter Campaign Name");
      isValid = false;
    }
    return isValid;
  };

  return (
    <>
      <Modal show={show} onHide={close}>
        <form onSubmit={handleSubmit}>
          <Modal.Header>
            <Modal.Title>Campaign</Modal.Title>
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
              <div className="mb-4 col-lg-12">
                <label htmlFor="exampleInputEmail1" className="form-label">
                  Enter Campaign Name
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  required
                  title="Must contain at least one number and one letter, and at least 8 or more characters."
                  className="form-control"
                  placeholder="Enter Campaign Name"
                  aria-describedby="emailHelp"
                />
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <div className="border-0 modal-footer pt-0">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={close}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary ">
                Submit
              </button>
            </div>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

export default StartCampaignModal;
