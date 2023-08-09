import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../layouts/PageHeader';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { setPageTitle } from '../../utils/Common';
import { httpClient } from '../../constants/Api';
import { USER_DIARY_LIST } from '../../constants/AdminConstant';
import { Link, useNavigate, useParams } from 'react-router-dom';

function UserDiaryList() {
  const [userDiaryList, setUserDiaryList] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [perPageRecord, setRecordPerPage] = useState(10);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isPublic, setIsPublic] = useState('');
  const [filter, setFilter] = useState({
    full_name: '',
    email: '',
    is_public: '',
  });

  const columns = [
    {
      name: 'User Name',
      selector: (row) => row.user_name,
      // sortable: true,
    },
    {
      name: 'User Email',
      selector: (row) => row.user_email,
      // sortable: true,
    },
    {
      name: 'Day of Week',
      selector: (row) => row.day_of_week,
      // sortable: true,
    },
    {
      name: 'Name & Type of Product',
      selector: (row) => row.product_name,
    },
    {
      name: 'Public Entry',
      // selector: (row) => moment(row.created_at).format("l"),
      selector: (row) => row.is_public,
    },
    {
      name: 'Cannabinoid Profile',
      selector: (row) => row.cannabinoid_profile,
    },
    {
      name: 'Terpenses',
      selector: (row) => row.terpenes,
    },
    {
      name: 'Symptoms',
      selector: (row) => row.pre_symptoms,
    },
    {
      name: 'Action',
      selector: (row) => (
        <div className="yoo-line-1-2 yoo-base-color1">
          <Link to={`view/${row.id}`} className="btn btn-danger btn-sm" style={{ color: '#fff' }}>
            <i className="fa fa-eye"></i>
          </Link>
          {/* <button className="btn btn-info btn-sm mx-1 ">
            <i className="fa fa-ban"></i>
          </button>
          <Link
            to="#"
            title="Delete User Account"
            className="btn btn-danger btn-sm "
            style={{ color: "#fff" }}
          >
            <ion-icon name="trash-outline"></ion-icon>
          </Link> */}
          {/* <button
            title="Export User Information"
            className="btn btn-info btn-sm mx-1 "
            style={{ color: "#fff" }}
          >
            <ion-icon name="download-outline"></ion-icon>
          </button> */}
        </div>
      ),
    },
  ];

  useEffect(() => {
    getUserDiaryList();
    setPageTitle('User Diary List');
  }, [page, perPageRecord]);

  const handleRowSelected = useCallback((state) => {
    let selectedRows = [];
    selectedRows = state.selectedRows.map((row) => {
      return row.id;
    });

    setSelectedRows(selectedRows);
  }, []);

  const handleFilter = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      await httpClient
        .get(`${USER_DIARY_LIST.GET_USER_DIARY_LIST}?page=${page}&full_name=${filter.full_name}&email=${filter.email}&is_public=${filter.is_public}`)
        .then((res) => {
          if (res.data.status) {
            setUserDiaryList(res.data.data);
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

  const getUserDiaryList = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${USER_DIARY_LIST.GET_USER_DIARY_LIST}?page=${page}&perPageRecord=${perPageRecord}&full_name=${fullName}`)
        .then((res) => {
          if (res.data.status) {
            setUserDiaryList(res.data.data);
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

  return (
    <div>
      <div className="content-wrapper">
        <PageHeader />
        <section className="content">
          <div className="row">
            <div className="col-xs-12">
              <div className="box">
                <div className="box-header with-border">
                  <h3 className="box-title">Filter</h3>
                  <div className="box-tools pull-right">
                    <button type="button" className="btn btn-box-tool" data-widget="collapse">
                      <i className="fa fa-minus"></i>
                    </button>
                  </div>
                  <div className="box-body">
                    <form className="form-material" onSubmit={handleFilter}>
                      <div className="row">
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>User Name</label>
                            <input
                              type="text"
                              name="full_name"
                              placeholder="User Name"
                              className="form-control form-control-line"
                              value={filter.full_name}
                              onChange={(event) => setFilter({ ...filter, full_name: event.target.value })}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>User Email</label>
                            <input
                              type="text"
                              name="email"
                              placeholder="User Email"
                              className="form-control form-control-line"
                              value={filter.email}
                              onChange={(event) => setFilter({ ...filter, email: event.target.value })}
                            />
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label>Public Entry</label>
                            <select
                              id="selectOption"
                              className="form-control form-control-line"
                              name="filterDateType"
                              onChange={(event) => setFilter({ ...filter, is_public: event.target.value })}
                            >
                              <option value="" selected>
                                Please Select
                              </option>
                              <option value="1">Yes</option>
                              <option value="0">No</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-md-3">
                          <div className="form-group">
                            <label style={{ width: '100%' }}>&nbsp;</label>
                            <button type="submit" className="btn btn-primary" name="filter" value="1" onClick={handleFilter}>
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
                    {userDiaryList && (
                      <DataTable
                        columns={columns}
                        // selectableRows
                        data={userDiaryList}
                        highlightOnHover
                        responsive={true}
                        progressPending={isLoading}
                        onSelectedRowsChange={handleRowSelected}
                        pagination
                        pointerOnHover={true}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(perPage) => setRecordPerPage(perPage)}
                      />
                    )}
                    {/* <table id="example2" className="table table-bordered table-striped">
                      <thead>
                        <tr>
                          <th>User Name</th>
                          <th>User Email</th>
                          <th>Day of Week</th>
                          <th>Name & Type of Product</th>
                          <th>Public Entry</th>
                          <th>Cannabinoid Profile</th>
                          <th>Terpenses</th>
                          <th>Symptoms</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {userDiaryList &&
                          userDiaryList.map((user) => (
                            <tr>
                              <td>{user.user_name}</td>
                              <td>{user.user_email}</td>
                              <td>{user.day_of_week}</td>
                              <td>{user.product_name}</td>
                              <td>{user.is_public}</td>
                              <td>{user.cannabinoid_profile}</td>
                              <td>{user.terpenes}</td>
                              <td>{user.pre_symptoms}</td>
                              <td><button className="btn btn-outline-dark mt-2" 
                              onClick={() =>
                                  navigate(
                                    `/admin/userdiarylist/${id}`
                                  )
                              }
                                >View</button></td>
                            </tr>
                          ))}
                      </tbody>

                      <tfoot>
                        <tr>
                          <th>User Name</th>
                          <th>User Email</th>
                          <th>Day of Week</th>
                          <th>Name & Type of Product</th>
                          <th>Public Entry</th>
                          <th>Cannabinoid Profile</th>
                          <th>Terpenses</th>
                          <th>Symptoms</th>
                          <th>Action</th>
                        </tr>
                      </tfoot>
                    </table> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default UserDiaryList;
