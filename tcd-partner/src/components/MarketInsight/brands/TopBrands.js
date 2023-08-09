import React, { useState, useEffect } from "react";
import { httpClient } from "../../../constants/Api";
import { MARKETINSIGHT } from "../../../constants/AppConstant";
import { toast } from "react-toastify";
import ReactStars from "react-rating-stars-component";

function TopBrands() {
  const [isLoading, setLoading] = useState(false);
  const [topBrands, setTopBrands] = useState([]);

  useEffect(() => {
    getTopBrands();
  }, []);

  const getTopBrands = async () => {
    try {
      setLoading(true);
      const brands = await httpClient.get(`${MARKETINSIGHT.GET_TOP_BRANDS}`);
      setTopBrands(brands.data.brands);
    } catch (err) {
      if (err.response) toast.error(err.response.data.message);
      else toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="row g-4 mb-3 purpose_sec px-0">
        <div className="col-12 mt-3">
          <div className="purpose_row mt-31 pb-0">
            <div className="purpose_title">
              <h4> Top Brands </h4>
            </div>
          </div>
          {topBrands.map((brand, index) => (
            <div className="product_info_list mt-2" key={index}>
              <div>
                <strong>{brand.brand_name}</strong>
              </div>
              <p className="border-btm p-t-20 "></p>
              <div className="row">
                <div className="col-md-2">
                  <div className="entry-rate">
                    <ReactStars
                      count={brand.average_rating}
                      size={24}
                      color="#ffd700"
                    />
                  </div>
                  <div className="p-t-5 primary_color">Avg. Rating</div>
                </div>
                <div className="col-md-3">
                  <b>{brand.product_name}</b>
                  <div className="p-t-5 text-uppercase primary_color">
                    Most Popular Products
                  </div>
                </div>
                <div className="col-md-3">
                  <b>{brand.entries}</b>
                  <div className="p-t-5 text-uppercase primary_color">
                    Total Entries
                  </div>
                </div>
                <div className="col-md-2">
                  <b>{brand.objecive}</b>
                  <div className="p-t-5 text-uppercase primary_color">
                    Top Objective
                  </div>
                </div>
                <div className="col-md-2">
                  <b>{brand.reason}</b>
                  <div className="p-t-5 text-uppercase primary_color">
                    Top Reason
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TopBrands;
