import React, { useEffect, useState } from "react";
import { httpClient } from "../../constants/Api";
import Sidebar from "../../layouts/Sidebar";
import DataTable from "react-data-table-component";
import { PRODUCTS } from "../../constants/AppConstant";
import { setPageTitle } from "../../utils/Common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import exportFromJSON from "export-from-json";
import Loader from "../../layouts/Loader";
import Footer from "../../layouts/Footer";
 
function Products() {
  const [checkId, setCheckId] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [productData, setProductData] = useState("");
  const [totalProducts, setTotalProducts] = useState();
  let [searchValue, setSearchValue] = useState("");
  let [dataTableId, setDataTableId] = useState("");
  let [selectedValue, setSelectedValue] = useState("");
  const [productTypesData, setProductTypesData] = useState("");
  const [dataTableTitle, setDataTableTitle] = useState("All Products");
  const [page, setPage] = useState(1);
  const [perPageRecord, setRecordPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    getProducts();
    getProductTypes();
    setPageTitle("Products");
  }, [page, perPageRecord]);

  const columns = [
    {
      name: (
        <span>
          <img
            className="img-fluid"
            src="/assets/images/icons/info-icon.svg"
            alt=""
            title="To Export product details, please select the box next to the product and select Export"
          />
        </span>
      ),
      selector: (row) => (
        <div>
          <input
            type="checkbox"
            defaultValue={row.productId}
            value={checkId}
            onChange={(e) => {
              // add to list
              if (e.target.checked) {
                setCheckId([
                  ...checkId,
                  {
                    id: row.productId,
                  },
                ]);
              } else {
                // remove from list
                let value = checkId.filter(
                  (people) => people.id !== row.productId
                );
                setCheckId(value);
              }
            }}
          />
        </div>
      ),
      id: "checkbox_design",
      center: true,
    },
    {
      name: "PRODUCT NAME",
      selector: "productName",
      cell: (row) => <span>{row.productName}</span>,
      sortable: true,
    },
    {
      name: "CATEGORY",
      selector: "product_type",
      cell: (row) => (
        <span className={row.product_type ? "product_type" : ""}>
          {" "}
          {row.product_type ? row.product_type : "-"}{" "}
        </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "OBJECTIVES",
      selector: (row) => <span> {row.totalObjective} </span>,
      sortable: true,
      center: true,
    },
    {
      name: "ENTRIES",
      selector: (row) => (
        <span> {row.totalEntriesCount ? row.totalEntriesCount : "-"} </span>
      ),
      sortable: true,
      center: true,
    },
    {
      name: "RATING",
      selector: (row) => (
        <div className="entry-rate rating">
          {row.rating && row.rating.average_ratings === "1" ? (
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
          ) : row.rating && row.rating.average_ratings === "2" ? (
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
          ) : row.rating && row.rating.average_ratings === "3" ? (
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
          ) : row.rating && row.rating.average_ratings === "4" ? (
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
          ) : row.rating && row.rating.average_ratings === "5" ? (
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
      center: true,
    },
    {
      name: "BATCH ID",
      selector: (row) => <span> {row.batchId ? row.batchId : "-"} </span>,
    },
  ];

  const getProducts = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(
          `${PRODUCTS.GET_PRODUCTS}?page=${page}&perPageRecord=${perPageRecord}`
        )
        .then((res) => {
          if (res.data.success) {
            setProductData(res.data.data.products);
            setTotalProducts(res.data.data.totalEntries);
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

  const getProductTypes = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(PRODUCTS.GET_PRODUCT_TYPES)
        .then((res) => {
          if (res.data.success) {
            setProductTypesData(res.data.data.productTypes);
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

  const handleSearchValue = (e) => {
    const searchInitValue = e.target.value;
    setSearchValue(searchInitValue);
    getAllSearchValue(dataTableId, searchInitValue, page, perPageRecord);
  };

  const handleTitleChange = async (data) => {
    const searchProduct = data.id;
    setDataTableTitle(data.name);
    if (data.id) {
      setDataTableId(searchProduct);
      getAllSearchValue(searchProduct, searchValue, page, perPageRecord);
    } else {
      getProducts();
      setDataTableId("");
      setDataTableTitle("All Products");
    }
  };

  const getAllSearchValue = async (
    dataTableId,
    searchValue,
    page,
    perPageRecord
  ) => {
    try {
      setLoading(true);
      await httpClient
        .get(
          `${PRODUCTS.GET_PRODUCT_FILTER}?id=${dataTableId}&searchValue=${searchValue}&page=${page}&perPageRecord=${perPageRecord}`
        )
        .then((res) => {
          if (res.data.success) {
            setProductData(res.data.data.products);
            setTotalProducts(res.data.data.totalEntries);
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

  const importData = async (e) => {
    let finalData =
      checkId.length > 0
        ? productData.filter((x) => checkId.some((y) => x.productId === y.id))
        : "";
    finalData = finalData ? finalData : productData;
    const fileType = e.target.value;
    setSelectedValue(fileType);
    if (fileType) {
      const data = finalData.map((productData) => {
        const requiredData = {
          "PRODUCT NAME": productData.productName,
          OBJECTIVES: "",
          ENTRIES: productData.entries,
          RATING: productData.average_rating,
          "BATCH ID": productData.batchId,
        };
        return requiredData;
      });
      const fileName = "products";
      const exportType =
        e.target.value === "xls"
          ? exportFromJSON.types.xls
          : exportFromJSON.types.csv;
      exportFromJSON({ data, fileName, exportType });
    }
  };

  const clickHandler = async (data) => {
    navigate(`${"/products/product-info/"}${data.productId}`);
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content">
            <div className="container-xl">
              <div className="row g-4">
                <div className="app_home app_product app_header sticky w-100">
                  <h1 className="app-page-title">Products</h1>
                  <p>{moment().format("LL")}</p>
                </div>
              </div>
              <div
                className="nav_tabs consumers_tabs common_padding"
                style={{ marginTop: "130px" }}
              >
                <nav
                  id="orders-table-tab"
                  className="orders-table-tab nav_tabs_main nav flex-column flex-sm-row custom_tabs sticky_tabs	"
                >
                  <a
                    className="nav-link active"
                    onClick={(e) => handleTitleChange("All Products")}
                    id="all-tab"
                    data-bs-toggle="tab"
                    href="#all"
                    role="tab"
                    aria-controls="all"
                    aria-selected="true"
                  >
                    All
                  </a>
                  {productTypesData &&
                    productTypesData.map((data) => (
                      <a
                        className="nav-link"
                        onClick={(e) => handleTitleChange(data)}
                        id="all-tab"
                        data-bs-toggle="tab"
                        href="#all"
                        role="tab"
                        aria-controls="all"
                        aria-selected="true"
                      >
                        {data.name}
                      </a>
                    ))}
                </nav>

                <div className="row mb-4 align-items-center mx-1 mt-4">
                  <div className="col-md-10">
                    <div className="search_group">
                      <span className="lnr lnr-magnifier"></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search for products by name"
                        value={searchValue}
                        onChange={handleSearchValue}
                      />
                    </div>
                  </div>
                  <div className="col-md-2 text-end ">
                    <div className="exprot_select ms-2 m-0">
                      <img src="/assets/images/icons/arrow2.svg" alt="" />
                      <select
                        className="form-control"
                        value={selectedValue}
                        onChange={importData}
                      >
                        <option value="" disabled selected hidden>
                          Export
                        </option>
                        <option value="csv">.CSV file</option>
                        <option value="xls">Excel file</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div
                  className="tab-content product-title data-table-view"
                  id="orders-table-tab-content"
                >
                  <div
                    className="tab-pane fade show active"
                    id="all"
                    role="tabpanel"
                    aria-labelledby="all-tab"
                  >
                    {productData && (
                      <DataTable
                        title={dataTableTitle}
                        columns={columns}
                        data={productData}
                        highlightOnHover
                        pagination
                        paginationServer
                        responsive={true}
                        paginationTotalRows={totalProducts}
                        paginationPerPage={perPageRecord}
                        progressPending={isLoading}
                        pointerOnHover={true}
                        paginationComponentOptions={{
                          rowsPerPageText: "Records per page:",
                          rangeSeparatorText: "out of",
                        }}
                        onChangePage={(page) => setPage(page)}
                        onChangeRowsPerPage={(perPage) =>
                          setRecordPerPage(perPage)
                        }
                        onRowClicked={(productData) =>
                          clickHandler(productData)
                        }
                      />
                    )}
                  </div>
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

export default Products;
