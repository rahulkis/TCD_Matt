import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../.../../../../layouts/PageHeader';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants/AppConstant';
import { PARTNER } from '../../../../constants/AdminConstant';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';

function PartnerList() {
  const [showFilters, setShowFilters] = useState();
  const [partnerData, setPartnerData] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [selectedRows, setSelectedRows] = useState(false);

  const columns = [
    {
      name: 'Name',
      selector: (row) => row && row.full_name,
      // sortable: true,
    },
    {
      name: 'Email',
      selector: (row) => row.email,
      // sortable: true,
    },

    {
      name: 'Phone',
      selector: (row) => row.contact_no,
    },
    {
      name: 'Image',
      selector: (row) => row.profile_image,
    },
    {
      name: 'Status',
      selector: (row) => (row.is_active ? <span>Active</span> : <span>In Active</span>),
    },
    {
      name: 'Action',
      selector: (row) => (
        <div className="yoo-line-1-2 yoo-base-color1">
          <Link to={`/admin/partner/edit/${row.id}`} className="btn btn-warning btn-sm" style={{ color: '#fff' }}>
            <i className="fa fa-edit"></i>
          </Link>
          <button className="btn btn-info btn-sm mx-1 " onClick={() => blockUnblockPartner(`${row.id}`)}>
            <i className="fa fa-ban"></i>
          </button>
          <Link to="#" title="Delete User Account" className="btn btn-danger btn-sm " style={{ color: '#fff' }} onClick={() => deletePartner(`${row.id}`)}>
            <ion-icon name="trash-outline"></ion-icon>
          </Link>
        </div>
      ),
    },
  ];

  const handleRowSelected = useCallback((state) => {
    let selectedRows = [];
    selectedRows = state.selectedRows.map((row) => {
      return row.id;
    });

    setSelectedRows(selectedRows);
  }, []);

  useEffect(() => {
    getPartnerList();
  }, []);

  const getPartnerList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE_URL + PARTNER.GET_PARTNER_LIST);
      if (response.data.status) {
        setPartnerData(response.data.data);
        setLoading(false);
        toast.success(response.data.message);
      } else toast.error(response.data.message);
    } catch (err) {
      toast.error('Something went wrong');
    }
  };
  console.log({ partnerData });

  const blockUnblockPartner= async (partnerId) => {
    try{
      setLoading(true);
      await axios
      .patch(`${API_BASE_URL + PARTNER.BLOCK_UNBLOCK_PARTNER.replace('{partnerId}', partnerId)}`)
      .then((res)=>{
        if(res.data.success){
          getPartnerList();
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

  const deletePartner = async (partnerId) => {
    try{
      setLoading(true);
      const response = await axios
      .patch(`${API_BASE_URL + PARTNER.DELETE_PARTNER.replace('{partnerId}', partnerId)}`);
      if(response.data.success){
        getPartnerList();
        setLoading(false);
        toast.success(response.data.message);
      }else toast.error(response.data.message);
    }catch(err){
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }  
  }

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
                    {showFilters ? <ion-icon name="remove-outline"></ion-icon> : <ion-icon name="add-outline"></ion-icon>}
                  </button>
                </div>

                <div className="box-tools me-2">
                  <Link to="/admin/partner/add" className="btn btn-primary">
                    Add New Partner
                  </Link>
                </div>
              </div>
              <div className="box-body collapse show" id="collapseExample">
                <form className="form-material">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Name</label>
                        <input type="text" name="full_name" placeholder="Name" className="form-control form-control-line" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Email</label>
                        <input type="text" name="email" placeholder="Email" className="form-control form-control-line" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label>Phone</label>
                        <input type="text" name="contact_no" placeholder="Phone" className="form-control form-control-line" />
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="form-group">
                        <label style={{ width: '100%' }}>&nbsp;</label>
                        <button type="submit" className="btn btn-primary" name="filter" value="1">
                          Filter
                        </button>
                        <button type="submit" className="btn btn-default m-l-5" name="filter" value="2">
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="box">
              <div className="box-body">
                {partnerData.length && (
                  <DataTable
                    columns={columns}
                    data={partnerData}
                    highlightOnHover
                    responsive={true}
                    progressPending={isLoading}
                    onSelectedRowsChange={handleRowSelected}
                    pagination
                    pointerOnHover={true}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default PartnerList;
