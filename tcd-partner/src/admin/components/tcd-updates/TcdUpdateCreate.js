import React, { useState, useEffect } from "react";
import { httpClient } from "../../../constants/Api";
import { toast } from "react-toastify";
import PageHeader from "../../layouts/PageHeader";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import Loader from "../../../layouts/Loader";
import { TCD_UPDATES } from "../../../constants/TcdUpdatesConstant";

function TcdUpdateCreate() {
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [values, setValues] = useState({
    title: null,
    description: null,
    category: null,
    is_published: false,
  });

  useEffect(() => {
    getListCategory();
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

  const handleCheckBox = (e) => {
    setValues({...values, is_published: !values.is_published});
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await httpClient
        .post(TCD_UPDATES.CREATE_TCD_UPDATES, values)
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
                        <Select options={listCategory} onChange={(e) => setValues({...values, category: e.value})} />
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

export default TcdUpdateCreate;
