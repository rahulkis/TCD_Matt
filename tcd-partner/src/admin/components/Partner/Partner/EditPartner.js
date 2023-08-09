import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../.../../../../layouts/PageHeader';
import Loader from '../../../../layouts/Loader';
import { API_BASE_URL } from '../../../../constants/AppConstant';
import { PARTNER } from '../../../../constants/AdminConstant';
import { httpClient } from '../../../../constants/Api';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setPageTitle } from '../../../../utils/Common';

function EditPartner() {
  const { partnerId } = useParams();
  console.log({ partnerId });
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [values, setValues] = useState({
    full_name: '',
    email: '',
    contact_no: '',
    gender: '',
    password: '',
    confirm_password: '',
    partnerAdmin: '',
    is_active: '',
  });

  const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Others', label: 'Others' },
  ];

  useEffect(() => {
    editPartner();
    setPageTitle('Edit Partner List By Id');
  }, []);

  const editPartner = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${PARTNER.EDIT_PARTNER.replace('{partnerId}', partnerId)}`)
        .then((res) => {
          console.log({ res });
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
  console.log({ values });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profile_image', values.profile_image);
    formData.append('contact_no', values.contact_no);
    formData.append('email', values.email);
    formData.append('full_name', values.full_name);
    formData.append('gender', values.gender);
    formData.append('password', values.password);
    formData.append('confirm_password', values.confirm_password);
    formData.append("partnerAdmin", values.partnerAdmin);
    formData.append('is_active', values.is_active);
    try {
      if (partnerAdminId) {
        await httpClient
          .patch(`${PARTNER.EDIT_PARTNER.replace('{partnerId}', partnerId)}`, formData)
          .then((res) => {
            if (res) {
              toast.success('Updated Successfully');
              navigate('/admin/partner');
            } else toast.error(res.data.message);
          })
          .catch((err) => {
            if (err.response) toast.error(err.response.data.message);
            else toast.error('Something went wrong');
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
                <form className="form-material" onSubmit={handleOnSubmit}>
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
                        <label className="form-label text-bold">Upload Picture</label>
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
                      {typeof values.profile_image === 'string' ? (
                        <img src={values.profile_image} style={{ height: '55%', width: '20%' }} />
                      ) : (
                        ''
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
                          required
                          className="form-control form-control-line"
                          onChange={(e) => setValues({ ...values, full_name: e.target.value })}
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
                          value={values.email}
                          required
                          className="form-control form-control-line"
                          onChange={(e) => setValues({ ...values, email: e.target.value })}
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
                          value={values.contact_no ? values.contact_no : ''}
                          autoComplete="username"
                          className="form-control form-control-line us_phone"
                          onChange={(e) => setValues({ ...values, contact_no: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Gender</label>
                        <select className="form-select" value={values.gender} onChange={(e) => setValues({ ...values, gender: e.target.value })}>
                          <option value="">Select gender</option>
                          {genderOptions &&
                            genderOptions.map((data, i) => (
                              <option value={data.label} key={i}>
                                {data.value}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Password</label>
                        <input
                          type="password"
                          placeholder="Password"
                          name="password"
                          value={values.password}
                          // required
                          minLength="8"
                          autoComplete="new-password"
                          className="form-control form-control-line"
                          onChange={(e) => setValues({ ...values, password: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Confirm Password</label>
                        <input
                          type="password"
                          placeholder="Conform Password"
                          name="confirm_password"
                          value={values.confirm_password}
                          // required
                          minLength="8"
                          autoComplete="new-password"
                          className="form-control form-control-line"
                          onChange={(e) => setValues({ ...values, confirm_password: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Partner Admin<span className="required">*</span></label>
                        <select
                          className="form-select"
                          value={values.partnerAdmin}
                          onChange={(e) =>
                            setValues({ ...values, partnerAdmin: e.target.value })
                          }
                        >
                          <option value="">Select Partner Admin</option>
                          <option value="vikas rana">Vikas Rana</option>
                          <option value="kulwinder">Kulwinder Singh</option>
                        </select>
                      </div>
                  </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group mb-2">
                        <label style={{ width: '100%' }}>&nbsp;</label>
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
  )
}

export default EditPartner