import React, { useEffect, useState } from "react";
import { httpClient } from "../../constants/Api";
import Footer from "../../layouts/Footer";
import Sidebar from "../../layouts/Sidebar";
import DataTable from "react-data-table-component";
import { setPageTitle } from "../../utils/Common";
import { useParams, Link } from "react-router-dom";
import { CONSUMERS } from "../../constants/AppConstant";
import moment from "moment";
import { starAveRatings } from '../../utils/Common'; 
import { useNavigate } from "react-router-dom";
const columns = [
  {
    name: "ENTRY ID",
    selector: "_id",
    cell: (row) => <span>{row.id}</span>,
    sortable: true,
    // center: true,
  },
  {
    name: "ENTRY DATE",
    selector: "created_at",
    cell: (row) => <span>{moment(row.createdAt).format("l")}</span>,
    sortable: true,
  },
  {
    name: "USER ID",
    selector: "user",
    cell: (row) => <span>{row.user.id}</span>,
    sortable: true,
  },
  {
    name: "RATING",
    selector: "average_ratings",
    cell: (row) => (
      <div className="entry-rate rating" dangerouslySetInnerHTML={{__html: starAveRatings(row.average_ratings)}}></div>
    ),
    sortable: true,
  }
];
function PurposeInfo() {
  const { purposeId } = useParams();
  const [loading, setLoading] = useState(false);
  const [entriesData, setPurposeData] = useState("");
  const [purposeTitle, setPurposeTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getPurposeData();
    setPageTitle("Purpose Entries");
  }, []);

  const clickHandler = async (data) => {
    navigate(`${"/consumers/entry-info/"}${data.id}`);
  };

  const getPurposeData = async ( ) => {
    try {
        setLoading(true);
        const response = await httpClient.get(CONSUMERS.GET_PROFILES_PURPOSE+'?purposeId='+purposeId);
        setPurposeData(response.data.data.user.consumption_reasons[0].all_entries)
        setPurposeTitle(response.data.data.user.consumption_reasons[0].consumption_reason)
        setLoading(false);
      } catch (err) {
          return 'Something went wrong';
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
                    <Link to="/consumers" className="backto-btn">
                      <span className="lnr lnr-arrow-left mr-2"></span> &nbsp;
                      Back to Consumers
                    </Link>
                  </div>
                  <h1 className="app-page-title">{purposeTitle}</h1>
                  <p className="border-btm"></p>
                </div>
              </div>
              <div className="common_padding" style={{ marginTop: '200px' }}>
                <div className="product_info_list m-t-20">
                  {entriesData && (
                    <DataTable
                      columns={columns}
                      data={entriesData}
                      highlightOnHover
                      responsive={true}
                      progressPending={loading}
                      pointerOnHover={true}
                      onRowClicked={(productData) =>
                        clickHandler(productData)
                      }
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

export default PurposeInfo;
