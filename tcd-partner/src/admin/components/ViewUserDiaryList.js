import React, { useEffect, useState, useCallback } from 'react';
import PageHeader from '../layouts/PageHeader';
import { toast } from 'react-toastify';
import DataTable from 'react-data-table-component';
import { setPageTitle } from '../../utils/Common';
import { httpClient } from '../../constants/Api';
import { USER_DIARY_LIST } from '../../constants/AdminConstant';
import { Link, useNavigate, useParams } from 'react-router-dom';

function ViewUserDiaryList() {
  const { id } = useParams();
  console.log({ id });
  const [isLoading, setLoading] = useState(false);
  const [viewUserDiaryList, setviewUserDiaryList] = useState([]);

  useEffect(() => {
    getViewUserDiaryList();
    setPageTitle('View User Diary List By Id');
  }, []);

  const getViewUserDiaryList = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${USER_DIARY_LIST.VIEW_USER_DIARY_LIST.replace('{id}', id)}`)
        .then((res) => {
          console.log({ res });
          if (res.data.status) {
            setviewUserDiaryList(res.data.data);
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
    <div className="content-wrapper">
      <PageHeader />
      <section className="content">
        <div>ViewUserDiaryList</div>
        <div className="row">
          <div className="col-md-12">
            <div className="box box-primary">
              <div className="box-body box-profile">
                <p className="text-muted text-center">User Diary Details</p>
                <ul className="list-group list-group-unbordered">
                  <li className="list-group-item">
                    <b>User Name</b> <a className="pull-right">{viewUserDiaryList.user && viewUserDiaryList.user.full_name}</a>
                  </li>
                  <li className="list-group-item">
                    <b>User Email</b> <a className="pull-right">{viewUserDiaryList.user && viewUserDiaryList.user.email}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Created At</b> <a className="pull-right">{viewUserDiaryList.created_at}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Name & Type of Product</b> <a className="pull-right">{viewUserDiaryList.product && viewUserDiaryList.product.name}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Public Entry</b> <a className="pull-right">{viewUserDiaryList.is_public == 1 ? 'Yes' : 'No'}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Strain</b> <a className="pull-right">{viewUserDiaryList.product && viewUserDiaryList.product.strain ?
                                                             viewUserDiaryList.product.strain.name : '' }</a>
                  </li>
                  <li className="list-group-item">
                    <b>Ratings</b>{' '}
                    <a className="pull-right">
                      {viewUserDiaryList.average_ratings}
                      {/* <i className="fa fa-fw fa-star"></i> */}
                    </a>
                  </li>
                  <li className="list-group-item">
                    <b>Cannabinoid Profile</b>
                    {viewUserDiaryList.cannabinoid_profile &&
                      viewUserDiaryList.cannabinoid_profile.map((cannabinoid_profile) => <a className="pull-right">{cannabinoid_profile.composition.name}</a>)}
                  </li>
                  <li classNames="list-group-item">
                    <b>Terpenses</b> 
                    {viewUserDiaryList.terpenes &&
                      viewUserDiaryList.terpenes.map((terpenes) => <a className="pull-right">{terpenes.composition.name}</a>)}
                  </li>
                  <li className="list-group-item">
                    <b>Symptoms</b> 
                    {viewUserDiaryList.pre_symptoms &&
                      viewUserDiaryList.pre_symptoms.map((pre_symptoms) => <a className="pull-right">{pre_symptoms.symptom.name}</a>)}
                  </li>
                  <li className="list-group-item">
                    <b>Desired Effects</b> 
                    {viewUserDiaryList.desired_effects &&
                      viewUserDiaryList.desired_effects.map((desired_effects) => <a className="pull-right">{desired_effects.effect.name}</a>)}
                  </li>
                  <li className="list-group-item">
                    <b>Actual Effects</b> 
                    {viewUserDiaryList.actual_effects &&
                      viewUserDiaryList.actual_effects.map((actual_effects) => <a className="pull-right">{actual_effects.effect.name}</a>)}
                  </li>
                  <li className="list-group-item">
                    <b>Activities</b> 
                    {viewUserDiaryList.pre_activities &&
                      viewUserDiaryList.pre_activities.map((pre_activities) => <a className="pull-right">{pre_activities.activity.name}</a>)}
                  </li>
                  <li className="list-group-item">
                    <b>Comments</b> <a className="pull-right">{viewUserDiaryList.comments}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Consumption Method</b> <a className="pull-right">{viewUserDiaryList.consumption_method}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Eat Before Consumption</b> <a className="pull-right">{viewUserDiaryList.eat_before_consumption}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Consumption Time</b> <a className="pull-right">{viewUserDiaryList.consumption_time}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Consumption Place</b> <a className="pull-right">{viewUserDiaryList.consumption_place}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Consumption Partner</b> <a className="pull-right">{viewUserDiaryList.consumption_partner}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Consumption Negative</b> <a className="pull-right">{viewUserDiaryList.consumption_negative}</a>
                  </li>
                  <li className="list-group-item">
                    <b>Mood Before Consumption</b> <a className="pull-right">{viewUserDiaryList.mood_before_consumption}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ViewUserDiaryList;
