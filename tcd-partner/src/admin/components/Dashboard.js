import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PageHeader from "../layouts/PageHeader";
import {  DASHBOARD } from "../../constants/AdminConstant";
import { API_BASE_URL } from "../../constants/AppConstant";

function Dashboard() {
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(async () => {
    await getDashboardData();
  }, []);

  const getDashboardData = async () => {
    try {
      setLoading(true);
      const result = await axios.get(API_BASE_URL + DASHBOARD.GET_DASHBOARD);
      if (result.data.status) {
        setData(result.data.data);
        toast.success(result.data.message);
      } else toast.error(result.data.message);
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="content-wrapper">
        <PageHeader />
        <section className="content">
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-3 col-6">
                <div className="small-box bg-success">
                  <div className="inner">
                    <h3>{data.totalUserDiaryRecords}</h3>
                    <p>Diary Entries</p>
                  </div>
                  <div className="icon">
                    <ion-icon name="stats-chart-outline"></ion-icon>
                  </div>
                  <a href="/admin/userdiarylist" className="small-box-footer">More info</a>
                </div>
              </div>
              <div className="col-lg-3 col-6">
                <div className="small-box bg-warning">
                  <div className="inner">
                    <h3>{data.totalUserRecords}</h3>

                    <p>Registered Users</p>
                  </div>
                  <div className="icon">
                    <ion-icon name="person-add-outline"></ion-icon>
                  </div>
                  <a href="/admin/userlist" className="small-box-footer">More info</a>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-danger">
                  <div className="inner">
                    <h3>{data.totalVideoRecords}</h3>
                    <p>Videos</p>
                  </div>
                  <div className="icon">
                    <ion-icon name="pie-chart-outline"></ion-icon>
                  </div>
                  <a href="/admin/video" className="small-box-footer">More info</a>
                </div>
              </div>

              <div className="col-lg-3 col-6">
                <div className="small-box bg-blue">
                  <div className="inner">
                    <h3>{data.totalCommunityQuestionsRecords}</h3>
                    <p>Community Questions</p>
                  </div>
                  <div className="icon">
                    <ion-icon name="pie-chart-outline"></ion-icon>
                  </div>
                  <a href="/admin/community-questions" className="small-box-footer">
                    More info <i className="fas fa-arrow-circle-right"></i>
                  </a>
                </div>
              </div>
            </div>

            <div className="row"></div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Dashboard;
