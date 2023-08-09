import React, { useEffect, useState } from "react";
import { httpClient } from "../../constants/Api";
import Sidebar from "../../layouts/Sidebar";
import DataTable from "react-data-table-component";
import { PRODUCTS } from "../../constants/AppConstant";
import { setPageTitle } from "../../utils/Common";
import { toast } from "react-toastify";
import { useParams, Link } from "react-router-dom";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Doughnut, Bar } from "react-chartjs-2";
import moment from "moment";
import Footer from "../../layouts/Footer";
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const columns = [
  {
    name: "ENTRY DATE",
    selector: "createdAt",
    cell: (row) => <span>{moment(row.createdAt).format("l")}</span>,
    sortable: true,
  },
  {
    name: "USER ID",
    selector: "userId",
    cell: (row) => <span>{row.userId}</span>,
    sortable: true,
  },
  {
    name: "REASON",
    selector: "consuption_reason",
    cell: (row) => (
      <span>{row.consuption_reason ? row.consuption_reason : "-"}</span>
    ),
    sortable: true,
    center: true,
  },
  {
    name: "RATING",
    selector: "average_rating",
    cell: (row) => (
      <div className="entry-rate rating">
        {row.average_rating === "1" ? (
          <>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
          </>
        ) : row.average_rating === "2" ? (
          <>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
          </>
        ) : row.average_rating === "3" ? (
          <>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
          </>
        ) : row.average_rating === "4" ? (
          <>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
          </>
        ) : row.average_rating === "5" ? (
          <>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star.svg" alt="" />
            </span>
          </>
        ) : (
          <>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
            <span>
              <img src="/assets/images/icons/star-black.svg" alt="" />
            </span>
          </>
        )}
      </div>
    ),
    sortable: true,
  },
  {
    name: "BATCH ID",
    selector: "batchId",
    cell: (row) => <span>{row.batchId ? row.batchId : "-"}</span>,
    sortable: true,
    center: true,
  },
];
export const data_chart = {
  datasets: [
    {
      data: [15, 19, 9],
      backgroundColor: [
        "rgba(34, 64, 47, 1)",
        "rgba(44, 99, 66, 1)",
        "rgba(169, 201, 182, 0.57)",
      ],
      borderColor: [
        "rgba(34, 64, 47, 1)",
        "rgba(44, 99, 66, 1)",
        "rgba(169, 201, 182, 0.57)",
      ],
      borderWidth: 1,
    },
  ],
};

export const options = {
  indexAxis: "y",
  maintainAspectRatio: false,
  elements: {
    bar: {
      borderWidth: 1,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
    title: {
      display: false,
    },
  },
  scales: {
    xAxes: [
      {
        ticks: {
          display: false, //this will remove only the label
        },
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
          drawBorder: false,
          display: false,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          color: "rgba(0, 0, 0, 0)",
          drawBorder: false,
          display: false,
        },
      },
    ],
  },
};
function ProductsInfo() {
  const { productId } = useParams();
  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState("");
  const [graphData, setGraphData] = useState("");
  const [productEntries, setProductEntries] = useState("");
  const [productTypesData, setProductTypesData] = useState("");
  const [dataTableTitle, setDataTableTitle] = useState("All Products");

  useEffect(() => {
    getProductsInfo();
    getProductTypes();
    setPageTitle("Products Info");
  }, []);

  const getProductsInfo = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${PRODUCTS.GET_PRODUCTS_INFO}?id=${productId}`)
        .then((res) => {
          if (res.data.success) {
            setProductData(res.data.data.products[0]);
            setProductEntries(res.data.data.entriesData);
            setGraphData(res.data.data);
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
    }
  };
  const data_chart = {
    datasets: [
      {
        data: [
          graphData.maxActivities,
          graphData.maxCondition,
          graphData.maxEffect,
          graphData.maxCondition,
        ],
        backgroundColor: [
          "rgba(34, 64, 47, 1)",
          "rgba(44, 99, 66, 1)",
          "rgba(169, 201, 182, 0.57)",
        ],
        borderColor: [
          "rgba(34, 64, 47, 1)",
          "rgba(44, 99, 66, 1)",
          "rgba(169, 201, 182, 0.57)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const line_bar_entries = {
    labels: [
      graphData.maxActivities,
      graphData.maxCondition,
      graphData.maxEffect,
      graphData.maxCondition,
    ],
    datasets: [
      {
        label: "Habbit",
        data: [
          graphData.maxActivities,
          graphData.maxCondition,
          graphData.maxEffect,
          graphData.maxCondition,
        ],
        backgroundColor: [
          "rgba(34, 64, 47, 1)",
          "rgba(44, 99, 66, 1)",
          "rgba(169, 201, 182, 0.57)",
        ],
        borderColor: [
          "rgba(34, 64, 47, 1)",
          "rgba(44, 99, 66, 1)",
          "rgba(169, 201, 182, 0.57)",
        ],
        borderWidth: 1,
      },
    ],
  };
  const getProductTypes = async () => {
    try {
      await httpClient
        .get(PRODUCTS.GET_PRODUCT_TYPES)
        .then((res) => {
          if (res.data.success) {
            setProductTypesData(res.data.data.productTypes);
            setLoading(true);
          }
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

  const getAllSearchValue = async (dataTableId, searchValue) => {
    try {
      if (searchValue === "All Products") {
        setDataTableTitle(dataTableTitle);
      } else {
        await httpClient
          .get(
            `${PRODUCTS.GET_PRODUCT_FILTER}?id=${dataTableId}&searchValue=${searchValue}`
          )
          .then((res) => {
            if (res.data.success) {
              setProductData(res.data.data.products);
              setLoading(true);
            }
          })
          .catch((err) => {
            if (err.response) toast.error(err.response.data.message);
            else toast.error("Something went wrong");
          });
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    }
  };

  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content">
            <div className="container-xl">
              <div className="row g-4">
                <div
                  className="app_home app_header sticky w-100"
                  style={{ marginTop: "200px" }}
                >
                  <div className="mb-4">
                    <Link to={-1} className="backto-btn">
                      <span className="lnr lnr-arrow-left mr-2"></span> &nbsp;
                      Back to Previous Page
                    </Link>
                  </div>
                  <h1 className="app-page-title">{productData.productName}</h1>
                  <p className="border-btm"></p>
                </div>
              </div>
              <div className="common_padding">
                <div className="product_info_list" style={{ marginTop: "200px" }}>
                  <div className="infosub_heading">Product Info</div>
                  <p className="border-btm p-t-20 "></p>
                  <div className="row">
                    <div className="col-md-3">
                      <b>NA</b>
                      <div className="p-t-5 primary_color">Product Type</div>
                    </div>
                    <div className="col-md-3">
                      <b>{productData.distributor_name}</b>
                      <div className="p-t-5 primary_color">Distribution</div>
                    </div>
                    <div className="col-md-3">
                      <span className="curl_text">
                        {productData.productType}
                      </span>
                      <div className="p-t-5 primary_color">
                        Product Category
                      </div>
                    </div>
                    <div className="col-md-3">
                      <b>
                        {productData
                          ? productData.tested_at
                            ? moment(productData.tested_at).format("l")
                            : "-"
                          : "-"}
                      </b>
                      <div className="p-t-5 primary_color">
                        Completed Test Date
                      </div>
                    </div>
                  </div>
                  <div className="row p-t-20">
                    <div className="col-md-3">
                      <b>
                        {productData.producer_name
                          ? productData.producer_name
                          : "-"}
                      </b>
                      <div className="p-t-5 primary_color">Producer</div>
                    </div>
                    <div className="col-md-3">
                      <b>{productData.batch_id ? productData.batch_id : "-"}</b>
                      <div className="p-t-5 primary_color">Batch Id</div>
                    </div>
                    <div className="col-md-3">
                      <div className="entry-rate">
                        {productData?.entries ? (
                          productData.entries.average_ratings == 1 ? (
                            <>
                              {" "}
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : productData.entries.average_ratings == 2 ? (
                            <>
                              {" "}
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : productData.entries.average_ratings == 3 ? (
                            <>
                              {" "}
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : productData.entries.average_ratings == 4 ? (
                            <>
                              {" "}
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star-black.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : productData.entries.average_ratings == 5 ? (
                            <>
                              {" "}
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                              <span>
                                <img
                                  src="/assets/images/icons/star.svg"
                                  alt=""
                                />
                              </span>
                            </>
                          ) : (
                            "-"
                          )
                        ) : (
                          "-"
                        )}{" "}
                      </div>
                      <div className="p-t-5 primary_color">Rating</div>
                    </div>
                  </div>
                </div>
                <div className="product_info_list m-t-20">
                  <div className="demopie_chart">
                    <div className="demopie_row">
                      <div className="demopie_title">
                        <h5>Top 5 Objectives</h5>
                      </div>

                      <div className="demopie_drop">
                        <a href="#">
                          {" "}
                          <img
                            src="/assets/images/icons/arrow2.svg"
                            alt=""
                          />{" "}
                          Export
                        </a>
                      </div>
                    </div>

                    <div className="demograph_chart">
                      <div className="demograph_chart_left">
                        <div className="analist_chart">
                          <Doughnut data={data_chart} />
                        </div>

                        <div className="demograph_list">
                          <ul>
                            <li>
                              {" "}
                              <img
                                src="/assets/images/icon11.png"
                                alt=""
                              />{" "}
                              Activities{" "}
                            </li>
                            <li>
                              {" "}
                              <img
                                src="/assets/images/icon12.png"
                                alt=""
                              />{" "}
                              Effect{" "}
                            </li>
                            <li>
                              {" "}
                              <img
                                src="/assets/images/icon20.png"
                                alt=""
                              />{" "}
                              Condition{" "}
                            </li>
                            <li>
                              {" "}
                              <img
                                src="/assets/images/icon21.png"
                                alt=""
                              />{" "}
                              Symptoms{" "}
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="demograph_chart_right">
                        <div className="progress_list">
                          <Bar options={options} data={line_bar_entries} />
                        </div>

                        <div className="progressbtm_list">
                          <ul>
                            <li>
                              {" "}
                              <img
                                src="/assets/images/icon11.png"
                                alt=""
                              />{" "}
                              Laughter{" "}
                            </li>
                            <li>
                              {" "}
                              <img
                                src="/assets/images/icon12.png"
                                alt=""
                              />{" "}
                              Relaxtation{" "}
                            </li>
                            <li>
                              {" "}
                              <img
                                src="/assets/images/icon20.png"
                                alt=""
                              />{" "}
                              Anixety{" "}
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="product_info_list m-t-20">
                  {productEntries && (
                    <DataTable
                      columns={columns}
                      data={productEntries}
                      highlightOnHover
                      pagination
                      paginationServer
                      responsive={true}
                      progressPending={loading}
                      pointerOnHover={true}
                      paginationComponentOptions={{
                        rowsPerPageText: "Records per page:",
                        rangeSeparatorText: "out of",
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
}

export default ProductsInfo;
