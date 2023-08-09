import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PageHeader from "../../layouts/PageHeader";
import { USER } from "../../../constants/AdminConstant";
import { API_BASE_URL } from "../../../constants/AppConstant";
import Select from "react-select";
import DataTable from "react-data-table-component";
import moment from "moment";
import { Link } from "react-router-dom";

const options = [
  { value: 6, label: "6 months" },
  { value: 1, label: "This month" },
  { value: 2, label: "Show last 30 days" },
  { value: 4, label: "Last month" },
  { value: 5, label: "3 months" },
  { value: 0, label: "Date Range" },
];

const columns = [
  {
    name: "Name",
    selector: (row) => row.full_name,
    // sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    // sortable: true,
  },
  {
    name: "Created At",
    selector: (row) => moment(row.created_at).format("l"),
  },
  {
    name: "Phone",
    selector: (row) => row.contact_no,
  },
  {
    name: "Image",
    selector: (row) => row.profile_image,
  },
  {
    name: "Status",
    selector: (row) => row.is_active,
  },
  {
    name: "Action",
    selector: (row) => (
      <div className="yoo-line-1-2 yoo-base-color1">
        <Link
          to={`update/${row.id}`}
          className="btn btn-warning btn-sm"
          style={{ color: "#fff" }}
        >
          <i className="fa fa-edit"></i>
        </Link>
        <button className="btn btn-info btn-sm mx-1 ">
          <i className="fa fa-ban"></i>
        </button>
        <Link
          to="#"
          title="Delete User Account"
          className="btn btn-danger btn-sm "
          style={{ color: "#fff" }}
        >
          <ion-icon name="trash-outline"></ion-icon>
        </Link>
        <button
          title="Export User Information"
          className="btn btn-info btn-sm mx-1 "
          style={{ color: "#fff" }}
        >
          <ion-icon name="download-outline"></ion-icon>
        </button>
      </div>
    ),
  },
];

function UserList() {
  const [showFilters, setShowFilters] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(false);

  useEffect(() => {
    getUserList();
  }, []);

  const getUserList = async () => {
    try {
      setLoading(true);
      const result = await axios.get(API_BASE_URL + USER.GET_USERS);
      if (result.data.status) {
        setUserData(result.data.data);
        toast.success(result.data.message);
      } else toast.error(result.data.message);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleRowSelected = useCallback((state) => {
    let selectedRows = [];
    selectedRows = state.selectedRows.map((row) => {
      return row.id;
    });

    setSelectedRows(selectedRows);
  }, []);

  return (
    <div className="content-wrapper">
      <PageHeader />
      <section className="content">
        <div className="row">
          <div className="col-xs-12">
            <div className="box">
              <div className="box-header with-border">
                <h3 className="box-title">Filter</h3>

                <div className="box-tools pull-right">
                  <button
                    type="button"
                    className="btn btn-box-tool"
                    //   data-widget="collapse"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
                    //   aria-expanded="false"
                    aria-controls="collapseExample"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    {showFilters ? (
                      <ion-icon name="remove-outline"></ion-icon>
                    ) : (
                      <ion-icon name="add-outline"></ion-icon>
                    )}
                  </button>
                </div>
              </div>
              {/* <!-- /.box-header --> */}
              <div className="box-body collapse show" id="collapseExample">
                <form className="form-material">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Name</label>
                        <input
                          type="text"
                          name="full_name"
                          placeholder="Name"
                          className="form-control form-control-line"
                          // value="<%=data.filterDatas.full_name%>"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="text"
                          name="email"
                          placeholder="Email"
                          className="form-control form-control-line"
                          // value="<%=data.filterDatas.email%>"
                        />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="text"
                          name="contact_no"
                          placeholder="Phone"
                          className="form-control form-control-line"
                          // value="<%=data.filterDatas.contact_no%>"
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Date Range</label>
                        {/* <input
                          type="text"
                          id="dateRangeInput"
                          className="form-control form-control-line"
                          name="daterange"
                          // value="<%=data.filterDatas.daterange%>"
                        /> */}
                        <Select options={options} />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label style={{ width: "100%" }}>&nbsp;</label>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          name="filter"
                          value="1"
                        >
                          Filter
                        </button>
                        <button
                          type="submit"
                          className="btn btn-default m-l-5"
                          name="filter"
                          value="2"
                        >
                          Reset
                        </button>
                        {/* <!-- <a href="/admin/userlist/export-all-user-info" title="Export User Information">Export</a> --> */}
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="box">
              <div className="box-header with-border">
                <div className="">
                  <button type="button" className="btn btn-primary removeusers">
                    Delete Selected Users
                  </button>
                </div>
              </div>
              <div className="box-body">
                <DataTable
                  columns={columns}
                  selectableRows
                  data={userData}
                  highlightOnHover
                  responsive={true}
                  progressPending={isLoading}
                  onSelectedRowsChange={handleRowSelected}
                  pagination
                  pointerOnHover={true}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default UserList;
