import React, { useEffect, useState, useCallback } from "react";
import { httpClient } from "../../../constants/Api";
import { toast } from "react-toastify";
import PageHeader from "../../layouts/PageHeader";
import moment from "moment";
import DataTable from "react-data-table-component";
import { setPageTitle } from "../../../utils/Common";
import { Link } from "react-router-dom";
import { TCD_UPDATES } from "../../../constants/TcdUpdatesConstant";

function TcdUpdateList() {
  const [isLoading, setLoading] = useState(false);
  const [tcdUpdateListData, setTcdUpdateListData] = useState([]);


  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      // sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      // sortable: true,
    },
    {
      name: "Category",
      selector: (row) => row.category,
    },
    {
        name: "Status",
        selector: (row) => row.is_published === true? 'Published' : 'Draft',
    },
    {
        name: "Created At",
        selector: (row) => moment(row.created_at).format("l"),
    },
    {
      name: "Published At",
      selector: (row) => row.published_at === null? '' : moment(row.published_at).format("l"),
    },
    {
      name: "Action",
      selector: (row) => (
        <div className="yoo-line-1-2 yoo-base-color1">
          <Link
            to={`/admin/tcd-updates/edit/${row.id}`}
            className="btn btn-warning btn-sm mx-1"
            style={{ color: "#fff" }}
          >
            <i className="fa fa-edit"></i>
          </Link>
          <button
            onClick={() => handleDelete(row.id)}
            title="Delete User Account"
            className="btn btn-danger btn-sm "
            style={{ color: "#fff" }}
          >
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    getTcdUpdatesList();
    setPageTitle("TCD Update List")
  }, []);

  const getTcdUpdatesList = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${TCD_UPDATES.GET_TCD_UPDATES_LIST}`)
        .then((res) => {
            setTcdUpdateListData(res.data);
            setLoading(false);
        })
        .catch((err) => {
          if (err.response) toast.error(err.response.data.message);
          else toast.error("Something went wrong");
        });
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id) => {
    try {
        setLoading(true);
        await httpClient
          .put(`${TCD_UPDATES.DELETE_TCD_UPDATES}/${id}`)
          .then((res) => {
              setLoading(false);
              getTcdUpdatesList();
          })
          .catch((err) => {
            if (err.response) toast.error(err.response.data.message);
            else toast.error("Something went wrong");
          });
      } catch (err) {
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
                <div className="box-tools me-2">
                  <Link
                    to="/admin/tcd-updates/add"
                    className="btn btn-primary"
                  >
                    Add New
                  </Link>
                </div>
              </div>
            </div>
            <div className="box">
              <div className="box-body">
                <DataTable
                  columns={columns}
                  data={tcdUpdateListData}
                  responsive={true}
                  progressPending={isLoading}
                  pointerOnHover={false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TcdUpdateList;
