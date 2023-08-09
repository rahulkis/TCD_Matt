import React, { useEffect, useState, useCallback } from "react";
import { httpClient } from "../../../constants/Api";
import axios from "axios";
import { toast } from "react-toastify";
import PageHeader from "../../layouts/PageHeader";
import moment from "moment";
import DataTable from "react-data-table-component";
import { setPageTitle } from "../../../utils/Common";
import { SUB_ADMIN } from "../../../constants/AdminConstant";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import Loader from "../../../layouts/Loader";

function AddSubAdmin() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    is_active: true,
  });

  const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Others", label: "Others" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profile_image", values.profile_image);
    formData.append("contact_no", values.contact_no);
    formData.append("email", values.email);
    formData.append("full_name", values.full_name);
    formData.append("gender", values.gender);
    formData.append("is_active", values.is_active);
    try {
      setLoading(true);

      await httpClient
        .post(SUB_ADMIN.ADD_SUB_ADMIN, formData)
        .then((res) => {
          if (res.data.success) {
            toast.success(res.data.message);
            setLoading(false);
            navigate("/admin/subadminlist");
          } else {
            toast.error(res.data.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false);
        });
    } catch (err) {
      if (err.response) {
        console.log(err);
        toast.error(err.response.data.message);
      }
    }
  };

  const handleIsActive = async (e) => {
    if (e.target.checked) IsActive(true);
    else IsActive(false);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="content-wrapper">
        <PageHeader />
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <form className="form-material" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-12">
                      {/* {userData?.profileImg != "" && (
                        <img
                          src={userData.profileImg}
                          alt=""
                          height="150px"
                          weight="150px"
                        />
                      )} */}
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Upload Picture
                        </label>
                        <input
                          type="file"
                          name="profile_image"
                          className="form-control"
                          onChange={(e) =>
                            setValues({
                              ...values,
                              // myfile: e.target.files[0],
                              profile_image: e.target.files[0],
                            })
                          }
                        />
                      </div>
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
                          required
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
                          type="email"
                          placeholder="Email"
                          name="email"
                          required
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
                          required
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
                              <option value={data.label}>{data.value}</option>
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
                        <button className="btn btn-primary">Submit</button>
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

export default AddSubAdmin;
