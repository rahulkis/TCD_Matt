import React, { useEffect, useState } from "react";
import Sidebar from "../../layouts/Sidebar";
import { setPageTitle } from "../../utils/Common";
import moment from "moment";
import {
  ProfileServices,
  ObjectivesServices,
  CategoryServices,
  RatingReviewsServices,
} from "../../services/consumer/consumer.main.services";
import Footer from "../../layouts/Footer";

function Consumers() {
  const [profileTab, setProfileTabActive] = useState('');
  const [objectivesTab, setObjectivesActive] = useState('');
  const [categoryTab, setCategoryActive] = useState('');
  const [ratingsAndReviewTab, setRatingsAndReviewTabActive] = useState('');
  const [profileContent, setProfileContentActive] = useState('');
  const [objectivesContent, setObjectivesContentActive] = useState('');
  const [categoryContent, setCategoryContentActive] = useState('');
  const [ratingsAndReviewContent, setRatingsAndReviewContentActive] = useState('');
  useEffect(() => {
    setPageTitle("Consumers");
    setActiveTab();
  }, []);
  const handleOnTabChange = (e) =>{
    window.location.hash = e.target.getAttribute('href');
    window.scrollTo(0, 0)
  }
  const setActiveTab = () => {
    var hash = document.location.hash;
    if (hash === '#objective') {
      setObjectivesActive('active ps-0')
      setObjectivesContentActive('show active')
    } else if (hash === '#orders-category') {
      setCategoryActive('active ps-0')
      setCategoryContentActive('show active')
    } else if (hash === '#orders-rating') {
      setRatingsAndReviewTabActive('active ps-0')
      setRatingsAndReviewContentActive('show active')
    } else {
      setProfileTabActive('active ps-0')
      setProfileContentActive('show active')
    }
  }
  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="app-wrapper">
          <div className="app-content">
            <div className="container-xl">
              <div className="row g-4">
                <div className="app_home app_consumer app_header sticky w-100">
                  <h1 className="app-page-title">Consumers</h1>
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
                    className={'nav-link '+ profileTab}
                    id="profile-tab"
                    data-bs-toggle="tab"
                    href="#profile"
                    role="tab"
                    aria-controls="profile"
                    aria-selected="true"
                    onClick={handleOnTabChange}
                  >
                    Profiles
                  </a>
                  <a
                    className={'nav-link '+ objectivesTab}
                    id="objective-tab"
                    data-bs-toggle="tab"
                    href="#objective"
                    role="tab"
                    aria-controls="objective"
                    aria-selected="false"
                    onClick={handleOnTabChange}
                  >
                    Objectives
                  </a>
                  <a
                    className={'nav-link '+ categoryTab}
                    id="orders-category-tab"
                    data-bs-toggle="tab"
                    href="#orders-category"
                    role="tab"
                    aria-controls="orders-category"
                    aria-selected="false"
                    onClick={handleOnTabChange}
                  >
                    Category
                  </a>
                  <a
                    className={'nav-link '+ ratingsAndReviewTab}
                    id="orders-rating-tab"
                    data-bs-toggle="tab"
                    href="#orders-rating"
                    role="tab"
                    aria-controls="orders-rating"
                    aria-selected="false"
                    onClick={handleOnTabChange}
                  >
                    Ratings and Reviews
                  </a>
                </nav>

                <div className="tab-content" id="orders-table-tab-content">
                  <ProfileServices activeContent={profileContent}/>
                  <ObjectivesServices activeContent={objectivesContent} />
                  <CategoryServices activeContent={categoryContent}/>
                  <RatingReviewsServices activeContent={ratingsAndReviewContent}/>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </div>
      </div>
    </>
  );
}

export default Consumers;
