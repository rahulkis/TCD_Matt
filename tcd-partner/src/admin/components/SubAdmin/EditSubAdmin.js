import React, { useEffect, useState, useCallback } from "react";
import { httpClient } from "../../../constants/Api";
import { toast } from "react-toastify";
import PageHeader from "../../layouts/PageHeader";
import { setPageTitle } from "../../../utils/Common";
import { SUB_ADMIN } from "../../../constants/AdminConstant";
import { Link, useParams, useNavigate } from "react-router-dom";

function EditSubAdmin() {
  const { id : subAdminId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({});

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
  ];

  useEffect(() => {
    editSubAdmin();
    setPageTitle('edit subadmin list  List By Id');
  }, []);

  const editSubAdmin = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${SUB_ADMIN.EDIT_SUB_ADMIN.replace('{subAdminId}', subAdminId)}`)
        .then((res) => {
          if (res.data.success) {
            setValues(res.data.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error('Something went wrong');
        });
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
    }
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_image", values.profile_image);
    formData.append("contact_no", values.contact_no);
    formData.append("email", values.email);
    formData.append("full_name", values.full_name);
    formData.append("gender", values.gender);
    formData.append("is_active", values.is_active);
    try {
      if (subAdminId) {
        await httpClient
          .patch(
            `${SUB_ADMIN.UPDATE_SUB_ADMIN.replace(
              "{subAdminId}", subAdminId )}`, formData )
          .then((res) => {
            if(res){
              toast.success("Updated Successfully");
              navigate("/admin/subadminlist");
            } else toast.error(res.data.message);
          })
          .catch((err) => {
            if (err.response) toast.error(err.response.data.message);
            else toast.error("Something went wrong");
          });
      }
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.message);
      }
    }
  };


  return (
    <>
      <div className="content-wrapper">
        <PageHeader />
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <form className="form-material" onSubmit={handleOnSubmit} >
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Upload Picture
                        </label>
                        <input
                          type="file"
                          name="profile_image"
                          className="form-control"
                          // value={values.profile_image}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              // myfile: e.target.files[0],
                              profile_image: e.target.files[0],
                            })
                          }
                        />
                      </div>
                      {typeof values.profile_image === 'string' ? (
                          <img src={values.profile_image}  style={{height: "55%", width:"20%"}} />
                        ) : (
                          ""
                          // <img src={values.profile_image && URL.createObjectURL(values.profile_image)} style={{height: "55%", width:"20%"}} />
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Name<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Name"
                          name="full_name"
                          value={values.full_name}
                          className="form-control form-control-line"
                          onChange={(e) =>
                            setValues({ ...values, full_name: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Email<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Email"
                          name="email"
                          value = {values.email}
                          className="form-control form-control-line"
                          onChange={(e) =>
                            setValues({ ...values, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Phone</label>
                        <input
                          type="text"
                          placeholder="Phone"
                          name="contact_no"
                          value={values.contact_no}
                          className="form-control form-control-line us_phone"
                          onChange={(e) =>
                            setValues({ ...values, contact_no: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Gender</label>
                        <select
                          className="form-select"
                          value={values.gender}
                          onChange={(e) =>
                            setValues({ ...values, gender: e.target.value })
                          }
                        >
                          <option value="">Select gender</option>
                          {genderOptions &&
                            genderOptions.map((data, i) => (
                              <option value={data.label} key={i}>{data.value}</option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group mb-2">
                        <label style={{ width: "100%" }}>&nbsp;</label>
                        <input
                          type="checkbox"
                          name="is_active"
                          checked={values.is_active}
                          onChange={(e) =>
                            setValues({
                              ...values,
                              is_active: e.target.checked,
                            })
                          }
                        />
                        <label htmlFor="status">Active</label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <button  className="btn btn-primary">
                          Update Sub Admin
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default EditSubAdmin;
