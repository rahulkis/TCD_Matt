import React, { useEffect, useState } from "react";
import { httpClient } from "../../constants/Api";
import DataTable from "react-data-table-component";
import { PRODUCTS } from "../../constants/AppConstant";
import { setPageTitle } from "../../utils/Common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { CONSUMERS } from "../../constants/AppConstant";
import { starAveRatings } from '../../utils/Common';
const RatingReviewsServicesLayout = (activeContentTab) => { 

  const [loading, setLoading] = useState(false);
  const [productData, setProductData] = useState("");
  const [ratingAndCommentsData, setRatingAndCommentsData] = useState();
  const [totalProducts, setTotalProducts] = useState();
  const [page, setPage] = useState(1);
  const [perPageRecord, setRecordPerPage] = useState(10);
  const navigate = useNavigate();
  const [next, setNext] = useState(3);
  const commentPerPage = 3;
  const [commentsToShow, setCommentsToShow] = useState([]);
  useEffect(() => {
    getProducts();
    setPageTitle("Products");
    getRatingsAndCommentsData();
  // eslint-disable-next-line
  }, [page, perPageRecord]);
  const getRatingsAndCommentsData = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(CONSUMERS.GET_RATING_AND_REVIEWS_COMMENTS);
      setRatingAndCommentsData(response.data.data);
      const dataResponse = response.data.data;
      setCommentsToShow(dataResponse.slice(0, 3));
      setLoading(false);
    } catch (err) {
        return 'Something went wrong';
    }
  };
  const loopWithSlice = () => {
    const toShow = ratingAndCommentsData.slice(
      commentsToShow.length,
      commentsToShow.length + commentPerPage
    );
    setCommentsToShow([...commentsToShow, ...toShow]);
  };
  const loadMoreRatingsAndReviews = () => {
    let loadedMore = next + commentPerPage;
    loopWithSlice(next, loadedMore);
    setNext(next + commentPerPage);
  }
  const paginateArray = (array, page_size, page_number) => {
    // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }
  const columns = [
    {
      name: "PRODUCT NAME",
      selector: "productName",
      cell: (row) => <span>{row.productName}</span>,
      sortable: true,
      center: true,
    },
    {
      name: "OBJECTIVES",
      selector: (row) => <span> {row.totalObjective} </span>,
      center: true,
    },
    {
      name: "ENTRIES",
      selector: (row) => <span> {row.totalEntriesCount ? row.totalEntriesCount : "-"} </span>,
      center: true,
    },
    {
      name: "RATING",
      selector: (row) => (
        <div className="entry-rate rating" dangerouslySetInnerHTML={{__html: starAveRatings(row.rating)}}></div>
      ),
      center: true,
    }
  ];
  const getProducts = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(
          `${PRODUCTS.GET_PRODUCTS}`
        )
        .then((res) => {
          if (res.data.success) {
            res.data.data.products.sort((a, b) => b.totalEntriesCount - a.totalEntriesCount)
            let dataProduct = paginateArray(res.data.data.products, perPageRecord, page)
            setProductData(dataProduct);
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

      const clickHandler = async (data) => {
        navigate(`${"/products/product-info/"}${data.productId}`);
      };

    return (
      <>
      {loading &&
      <div className="loader" style={{display: 'block', left: '50%'}}>
        <img className="img-fluid loader-style" src="../../assets/images/loader-cannabis.gif" alt="" />
    </div>
      }
        <div
        className={'tab-pane fade '+activeContentTab.activeContentTab.activeContent}
        id="orders-rating"
        role="tabpanel"
        aria-labelledby="orders-rating-tab"
      >
        <div className="app-card app-card-orders-table mb-5">
          <div className="app-card-body">
            <div className="row g-4 mb-3 total_list total_list_boxes p-0">
              <div className="col-6 col-lg-4 col-md-4">
                <div className="total_list_card h-100">
                  <div className="app-card-body p-lg-4 p-md-4">
                    <h5>Top Rated Category</h5>
                    <span>Preroll</span>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-4 col-md-4">
                <div className="total_list_card h-100">
                  <div className="app-card-body p-lg-4 p-md-4">
                    <h5>Top Rated Product</h5>
                    <span>hexo</span>
                  </div>
                </div>
              </div>

              <div className="col-6 col-lg-4 col-md-4">
                <div className="total_list_card h-100">
                  <div className="app-card-body p-lg-4 p-md-4">
                    <h5>Lowest rated product</h5>
                    <span>Telluride Greenroom</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4 table_row">
              <div className="table-responsive">
              <div
                    className="tab-pane fade show active"
                    id="all"
                    role="tabpanel"
                    aria-labelledby="all-tab"
                  >
                    {productData && (
                      <DataTable
                        title='All Products'
                        columns={columns}
                        data={productData}
                        highlightOnHover
                        pagination
                        paginationServer
                        responsive={true}
                        paginationTotalRows={totalProducts}
                        paginationPerPage={perPageRecord}
                        progressPending={loading}
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

            <div className="row g-4 mb-4 btm_row p-0">
              <div className="col-12 col-lg-12 col-md-12">
                <div className="comment_sec h-100">
                  <div className="comment_card">
                    <div className="comment_title">
                      <h3>User Comments</h3>
                    </div>

                    <div className="app-comment">
                       {commentsToShow.length > 0 && commentsToShow.map(function(object, i){
                              return <div className="user_list"> 
                              <div className="user_title">
                                <h5>{ratingAndCommentsData[i].product_name}</h5>
                                <span>{ratingAndCommentsData[i].created_at}</span>
                              </div>
      
                              <div className="user_rate" dangerouslySetInnerHTML={{__html: starAveRatings(ratingAndCommentsData[i].average_ratings)}}></div>
      
                              <div className="user_para">
                                <p>{ratingAndCommentsData[i].comments}</p>
                              </div>
                            </div>
                            })
                          }

                       <div className="user_view">
                        <button style={{color: '#2c6342'}} href="#" onClick={loadMoreRatingsAndReviews}>
                          {" "}
                          Load more{" "}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
}
export default RatingReviewsServicesLayout;