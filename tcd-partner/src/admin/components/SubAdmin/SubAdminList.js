import React, { useEffect, useState, useCallback } from "react";
import { httpClient } from "../../../constants/Api";
import { toast } from "react-toastify";
import axios from "axios";
import { API_BASE_URL } from "../../../constants/AppConstant";
import PageHeader from "../../layouts/PageHeader";
import moment from "moment";
import DataTable from "react-data-table-component";
import { setPageTitle } from "../../../utils/Common";
import { SUB_ADMIN } from "../../../constants/AdminConstant";
import { Link } from "react-router-dom";
import Select from "react-select";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import  Confirm_Dialog  from '../Models/Confirm_Dialog';

function SubAdminList() {
  
  const [isLoading, setLoading] = useState(false);
  const [subAdminData, setSubAdminData] = useState([]);
  const [showFilters, setShowFilters] = useState();
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
    date: 6,
    dateStart: moment().format('YYYY-MM-DD'),
    dateEnd: moment().format('YYYY-MM-DD'),
  });
  const [selectedRows, setSelectedRows] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSubAdmin, setShowSubAdmin] = useState({
    status:false,
    subAdminId:''
  });

  console.log({subAdminData});

  const options = [
    { value: 6, label: "6 months" },
    { value: 1, label: "This month" },
    { value: 2, label: "Show last 30 days" },
    { value: 4, label: "Last month" },
    { value: 5, label: "3 months" },
    { value: 0, label: "Date Range" },
  ];

  const handleClose = () => {
    setShowSubAdmin({ status:false, subAdminId:'' });
    getSubAdminList();
  };

  console.log({showSubAdmin});

  const columns = [
    {
      name: "Name",
      selector: (row) => row.name,
      // sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      // sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.contact_no,
    },
    {
      name: "Created At",
      selector: (row) => moment(row.created_at).format("l"),
    },
    {
      name: "Image",
      // selector: (row) => (
      //   <span className="avatar-contact avatar-online">
      //     <img src={row.profile_image} alt="avatar" height="50px" weight="50px"/>
      //   </span>
        
      // ),
      selector: (row) => row.profile_image,
    },
    {
      name: "Status",
      selector: (row) =>
        row.is_active ? <span>Active</span> : <span>In Active</span>,
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="yoo-line-1-2 yoo-base-color1">
          <Link
            to={`/admin/subadminlist/edit/${row.id}`}
            className="btn btn-warning btn-sm"
            style={{ color: "#fff" }}
          >
            <i className="fa fa-edit"></i>
          </Link>
          <button className="btn btn-info btn-sm mx-1 "  
            onClick={() => blockUnblockSubAdmin(`${row.id}`)} 
            // onClick={() => setShowSubAdmin({status:true, subAdminId:row.id})}
            >
            <i className="fa fa-ban"></i>
          </button>
          <Link
            to="#"
            title="Delete User Account"
            className="btn btn-danger btn-sm "
            style={{ color: "#fff" }}
            onClick={() => deleteSubAdmin(`${row.id}`)}
          >
            <ion-icon name="trash-outline"></ion-icon>
          </Link>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getSubAdminList();
    setPageTitle("Entries");
  }, []);

  const handleRowSelected = useCallback((state) => {
    let selectedRows = [];
    selectedRows = state.selectedRows.map((row) => {
      return row.id;
    });

    setSelectedRows(selectedRows);
  }, []);

  const onBlock = (id, isActive) => {
    if(isLoading) {
      return;
    }
    const message = isActive ? "Are you sure,\nYou want to block this user?" : "Are you sure,\nYou want to unblock this user?"
    if (confirm(message) == true) {      
      blockSubAdmin(id);
    }
  };

  const onDelete = (id) => {
    if(isLoading) {
      return;
    }
    if (confirm("Are you sure,\nYou want to delete this user?") == true) {      
      deleteSubAdmin(id);
    }    
  };

  const getSubAdminList = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${SUB_ADMIN.GET_SUB_ADMIN_LIST}`, {
          params: {
            'full_name': filters.name,
            'email': filters.email,
            'contact_no': filters.phone,
            'filterDateType': filters.date,
            'startDate': filters.dateStart,
            'endDate': filters.dateEnd,
          }
        })
        .then((res) => {
          if (res.data.status) {
            setSubAdminData(res.data.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        });
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const blockUnblockSubAdmin = async (subAdminId) => {
    try{
      setLoading(true);
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

  const deleteSubAdmin = async (subAdminId) => {
    try{
      setLoading(true);
      const response = await axios
      .patch(`${API_BASE_URL + SUB_ADMIN.DELETE_SUB_ADMIN.replace('{subAdminId}',subAdminId)}`);
      if(response.data.success){
        getSubAdminList();
        setLoading(false);
        toast.success(response.data.message);
      }else toast.error(response.data.message);
    }catch(err){
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }  

  }

  const onInputChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  }

  const onDateSelectChange = (option) => {    
    setFilters({
      ...filters,
      date: option.value
    });
    if(option.value === 0) {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const onUpdateDatePicker = (event, picker) => {    
    setFilters({
      ...filters,
      dateStart: picker.startDate.format('YYYY-MM-DD'),
      dateEnd: picker.endDate.format('YYYY-MM-DD'),
    })
  }

  const onFilter = () => {
    if(!isLoading) {
      getSubAdminList();
    }
  }

  const onResetFilter = () => {}

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
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseExample"
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

                <div className="box-tools me-2">
                  <Link
                    to="/admin/subadminlist/add"
                    className="btn btn-primary"
                  >
                    Add New Sub Admin
                  </Link>
                </div>
              </div>
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
                          value={filters.name}
                          onChange={(e) => onInputChange('name', e.target.value)}
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
                          value={filters.email}
                          onChange={(e) => onInputChange('email', e.target.value)}
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
                          value={filters.phone}
                          onChange={(e) => onInputChange('phone', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Date Range</label>
                        {
                          showDatePicker && 
                          <DateRangePicker onApply={onUpdateDatePicker} startDate={filters.startDate} endDate={filters.endDate}>
                            <input type="text" className="form-control form-control-line mb-2" />
                          </DateRangePicker>
                        }
                        <Select options={options} onChange={onDateSelectChange} defaultValue={options[0]} />
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-group">
                        <label style={{ width: "100%" }}>&nbsp;</label>
                        <button        
                          type="button"
                          className="btn btn-primary"
                          name="filter"
                          value="1"
                          onClick={onFilter}
                        >
                          Filter
                        </button>
                        <button    
                          type="button"
                          className="btn btn-default m-l-5"
                          name="filter"
                          onClick={onResetFilter}
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
              <div className="box-body">
                <DataTable
                  columns={columns}
                  // selectableRows
                  data={subAdminData}
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
      {showSubAdmin && (
        <Confirm_Dialog show ={showSubAdmin} close={handleClose}  />
      )}
    </div>
  );
}

export default SubAdminList;



