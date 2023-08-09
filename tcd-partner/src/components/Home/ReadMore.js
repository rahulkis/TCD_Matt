import React, { useEffect, useState } from 'react';
import Sidebar from '../../layouts/Sidebar';
import { setPageTitle } from '../../utils/Common';
import { toast } from 'react-toastify';
import moment from 'moment';
import Loader from '../../layouts/Loader';
import { httpClient } from '../../constants/Api';
import { TCD_UPDATES } from '../../constants/AppConstant';
import { useParams, Link } from 'react-router-dom';

function ReadMore() {
  const { getTcdUpdateId } = useParams();
  const [updates, setUpdates] = useState([]);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    setPageTitle('Read More');
    getUpdates();
  }, []);

  const getUpdates = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get(TCD_UPDATES.GET_UPDATE_BY_ID.replace('{id}', getTcdUpdateId));
      if (response.data.success) {
        setUpdates(response.data.data);
        setLoading(false);
      }
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error('Something went wrong');
    }
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
                <div className="app_home app_header header sticky w-100">
                  <div className="mb-4">
                    <Link to="/home" className="backto-btn">
                      <span className="lnr lnr-arrow-left mr-2"></span> &nbsp; Back to Dashboard
                    </Link>
                  </div>
                  <h1 className="app-page-title">{updates.title}</h1>
                  <p>{moment().format('LL')}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="row g-4 mb-3 total_list total_list_boxes" style={{ marginTop: '100px' }}>
            <div className="row g-4 mb-4 btm_row">
              <div className="col-12">
                <div className="update_sec h-100">
                  <p>{updates.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReadMore;
