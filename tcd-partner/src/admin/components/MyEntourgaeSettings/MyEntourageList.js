import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../.../../../../layouts/PageHeader';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../../../../constants/AppConstant';
import { PARTNER } from '../../../../constants/AdminConstant';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';

function MyEntourageList() {
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
  )
}

export default MyEntourageList