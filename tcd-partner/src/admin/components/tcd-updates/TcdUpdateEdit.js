import React, { useState, useEffect } from "react";
import { httpClient } from "../../../constants/Api";
import { toast } from "react-toastify";
import PageHeader from "../../layouts/PageHeader";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import Loader from "../../../layouts/Loader";
import { TCD_UPDATES } from "../../../constants/TcdUpdatesConstant";

function TcdUpdateEdit() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [values, setValues] = useState({
    id: '',
    title: '',
    description: '',
    category: null,
    is_published: false,
  });

  const { id } = useParams();

  useEffect(() => {
    getListCategory();
    getCategory();
  }, []);

  const getListCategory = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${TCD_UPDATES.GET_LIST_CATEGORY}`)
        .then((res) => {
            const listCategoryOption = [];
            res.data.forEach((cate) => {
                listCategoryOption.push({
                    value: cate,
                    label: cate
                });
            });
            setListCategory(listCategoryOption);
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

  const getCategory = async () => {
    try {
      setLoading(true);
      await httpClient
        .get(`${TCD_UPDATES.GET_TCD_UPDATES}/${id}`)
        .then((res) => {
            const newValue = {
                id: id,
                title: res.data.title,
                description: res.data.description,
                category: res.data.category,
                is_published: res.data.is_published,
            }
            setValues(newValue);
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

  const handleCheckBox = (e) => {
    setValues({...values, is_published: !values.is_published});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await httpClient
        .put(`${TCD_UPDATES.UPDATE_TCD_UPDATES}`, values)
        .then((res) => {
            setLoading(false);
            navigate("/admin/tcd-updates");
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoading(false);
        });
    } catch (err) {}
  };

  return (
    <>
      {isLoading && <Loader />}
      <div className="content-wrapper">
        <PageHeader />
        <section className="content">
          <div className="row">
            <div className="col-md-12">
              <div className="card card-primary">
                <form className="form-material" onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">
                          Title<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Title"
                          name="title"
                          value={values.title}
                          required
                          className="form-control form-control-line"
                          onChange={(e) =>
                            setValues({ ...values, title: e.target.value })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                        <div className="form-group mb-2">
                            <label className="form-label text-bold">
                            Description<span className="required">*</span>
                            </label>
                            <textarea
                            type="text-area"
                            placeholder="Description"
                            name="description"
                            value={values.description}
                            required
                            className="form-control form-control-line"
                            onChange={(e) =>
                                setValues({ ...values, description: e.target.value })
                            }
                            ></textarea>
                        </div>
                        </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <label className="form-label text-bold">Category</label>
                        <Select options={listCategory} 
                            value={{
                                label: values.category,
                                value: values.category,
                            }} onChange={(e) => setValues({...values, category: e.value})} />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <div className="form-group mb-2">
                        <label style={{ width: "100%" }}>&nbsp;</label>
                        <input
                          type="checkbox"
                          name="is_published"
                          onChange={(e) => handleCheckBox(e)}
                          checked={values.is_published}
                        />
                        <label htmlFor="status">Is Published</label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-2">
                        <button className="btn btn-primary">Submit</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default TcdUpdateEdit;
