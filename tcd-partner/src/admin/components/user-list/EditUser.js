import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";
import PageHeader from "../../layouts/PageHeader";
import { USER } from "../../../constants/AdminConstant";
import { API_BASE_URL } from "../../../constants/AppConstant";
import moment from "moment";

const genderOptions = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Others", label: "Others" },
  { value: "Rather not say", label: "Rather not say" },
];
const heightScales = [
  { value: "cm", label: "cm" },
  { value: "ft", label: "ft" },
];
const weightScales = [
  { value: "kg", label: "kg" },
  { value: "lb", label: "lb" },
];

const activityLevel = [
  { value: "Not Active", label: "Not Active" },
  { value: "Slightly Active", label: "Slightly Active" },
  { value: "Somewhat Active", label: "Somewhat Active" },
  { value: "Quite Active", label: "Quite Active" },
  { value: "Very Active", label: "Very Active" },
];

function EditUser() {
  const { userId } = useParams();
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState("");

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    try {
      setLoading(true);
      const result = await axios.get(
        API_BASE_URL + USER.EDIT_USER.replace("{id}", userId)
      );
      console.log({ result });
      if (result.data.success) {
        setUserData(result.data.data);
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const getOptions = (data) => {
    const options = data?.map((o) => {
      return { label: o.name, value: o.id };
    });
    return options;
  };

  const getSelectValue=()=>{
    const values = data?.map((o) => {
      return { label: o.name, value: o.id };
    });
    return values;
  }
  return (
    <>
      <div className="content-wrapper">
        <PageHeader />
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <form className="form-material">
                  <div className="row">
                    <div className="col-md-12">
                      {userData?.profileImg != "" && (
                        <img
                          src={userData.profileImg}
                          alt=""
                          height="150px"
                          weight="150px"
                        />
                      )}
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Upload Picture
                        </label>
                        <input
                          type="file"
                          name="profile_image"
                          className="form-control"
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
                          value={userData?.details?.full_name}
                          className="form-control form-control-line"
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
                          value={userData?.details?.email}
                          className="form-control form-control-line"
                          disabled
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
                          value={userData?.details?.conatact_no}
                          className="form-control form-control-line us_phone"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">DOB</label>
                        {/* <% 
                                    if(data.details.dob){
                                        var month = data.details.dob.getMonth() + 1;
                                        if(month<10) {
                                            month = "0"+month;
                                        }
                                        var day = data.details.dob.getDate();
                                        if(day < 10) {
                                            day= "0"+day;
                                        }
                                        var year =data.details.dob.getFullYear();
                                        var dob = month + "-" + day + "-" +year;
                                    }
                                    %> */}
                        <input
                          type="date"
                          id="dob"
                          name="dob"
                          value={moment(userData?.details?.dob).format("l")}
                          className="form-control form-control-line"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Gender</label>
                        <Select
                          options={genderOptions}
                          value={{
                            label: userData?.details?.gender,
                            value: userData?.details?.gender,
                          }}
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Activity Level
                        </label>
                        <Select options={activityLevel} />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Height</label>
                        <input
                          type="text"
                          id="height"
                          name="height"
                          value={userData?.details?.height}
                          className="form-control form-control-line"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group mb-2">
                        <label>&nbsp;</label>
                        <Select options={heightScales} />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Weight</label>
                        <input
                          type="text"
                          id="weight"
                          name="weight"
                          value={userData?.details?.weight}
                          className="form-control form-control-line"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group mb-2">
                        <label>&nbsp;</label>
                        <Select options={weightScales} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Cannabis Consumption
                        </label>
                        <Select
                          options={getOptions(userData?.cannabisConsumption)}
                          isMulti
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Symptoms</label>
                        <Select options={getOptions(userData?.symptoms)} isMulti/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Desired Effects
                        </label>
                        <Select options={getOptions(userData?.effects)} value={userData.selectedEffectArr} isMulti/>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Activities
                        </label>
                        <Select options={getOptions(userData?.activities )} value={userData.selectedActivitiesArr} isMulti/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Cannabinoids
                        </label>
                        <Select options={getOptions(userData?.cannabinoids)} value={userData.selectedCannabinoidsArr} isMulti/>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Favorite Strains
                        </label>
                        <Select options={getOptions(userData?.strains)} isMulti/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Conditions
                        </label>
                        <Select options={getOptions(userData?.conditions)} isMulti/>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Country</label>
                        <Select options={getOptions(userData?.country)} />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">State</label>
                        <Select options={getOptions(userData?.states)} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Zipcode</label>
                        <input
                          type="text"
                          id="zipcode"
                          name="zipcode"
                          value={userData?.details?.zipcode}
                          className="form-control form-control-line"
                        />
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
                          checked={userData?.details?.is_active ? true : false}
                        />
                        <label htmlFor="status">Active</label>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <button type="submit" className="btn btn-primary">
                          Update User
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

export default EditUser;
