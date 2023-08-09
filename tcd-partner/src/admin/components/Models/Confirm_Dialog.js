// import React, { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Modal from 'react-bootstrap/Modal';

// function Confirm_Dialog(show, close){
//  console.log({show});

//  const blockUnblockSubAdmin = async (subAdminId) => {
//   // try{
//   //   setLoading(true);
//   //   await axios
//   //   .patch(`${API_BASE_URL + SUB_ADMIN.BLOCK_UNBLOCK_SUB_ADMIN.replace('{subAdminId}', subAdminId)}`)
//   //   .then((res)=>{
//   //     if(res.data.success){
//   //       getSubAdminList();
//   //       setLoading(false);
//   //       toast.success(res.data.message);
//   //     }else{
//   //       toast.error(res.data.message);
//   //     }
//   //   })
//   //   .catch((err)=>{
//   //     if (err.response) toast.error(err.response.data.message);
//   //     else toast.error("Something went wrong");
//   //   })
//   // }catch(err){
//   //   if (err.response) toast.error(err.response.data.message);
//   //   else toast.error("Something went wrong");
//   // } 
// }

//   return (
//     <>
//       <Modal size="sm" show={show.status} onHide={close} aria-labelledby="example-modal-sizes-title-sm">
//         <Modal.Header>
//           <Modal.Title id="example-modal-sizes-title-sm">Sub Admin Modal</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h6>Are you sure ? you want to do this</h6>
//         </Modal.Body>
//         {/* <div className="modal-footer">
//           <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
//           <button type="button" className="btn btn-primary">Yes</button>
//         </div> */}
//         <Modal.Footer>
//           <Button variant="secondary" onClick={close}>
//             No
//           </Button>
//           <Button variant="primary" onClick={blockUnblockSubAdmin}>
//             Yes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </>
//   );
// };
// export default Confirm_Dialog;





import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../constants/AppConstant";
import { SUB_ADMIN } from "../../../constants/AdminConstant";

function Confirm_Dialog({ show, close }) {
  console.log({show});
  const { subAdminId } = show;
  console.log({subAdminId});
  const [loading, setLoading] = useState(false);

  const blockUnblockSubAdmin = async (subAdminId) => {
    try{
      // setLoading(true);
      await axios
      .patch(`${API_BASE_URL + SUB_ADMIN.BLOCK_UNBLOCK_SUB_ADMIN.replace('{subAdminId}', subAdminId)}`)
      .then((res)=>{
        if(res.data.success){
          getSubAdminList();
          setLoading(false);
          toast.success(res.data.message);
        }else{
          toast.error(res.data.message);
        }
      })
      .catch((err)=>{
        if (err.response) toast.error(err.response.data.message);
        else toast.error("Something went wrong");
      })
    }catch(err){
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }  
  } 

  return (
    <>
      <Modal show={show.status} onHide={close}>
          <Modal.Header>
            <Modal.Title>Sub Admin</Modal.Title>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              onClick={close}
            />
          </Modal.Header>
          <Modal.Body>
            <h6>Are you sure, You want to block this user ?</h6>
          </Modal.Body>
          <Modal.Footer>
            <div className="border-0 modal-footer pt-0">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                // onClick={blockUnblockSubAdmin(subAdminId)}
              >
                Yes
              </button>
              <button type="submit" className="btn btn-primary " onClick={close} >
                No
              </button>
            </div>
          </Modal.Footer>
      </Modal>
    </>
  );
}

export default Confirm_Dialog;
