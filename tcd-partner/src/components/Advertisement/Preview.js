import React from 'react';
function Preview({ values }) {
  return (
    <>
      <div>
        <p>Preview</p>
        <section className="main-data-section-wrapper">
          <div className="container">
            <div className="upper-data-section-info ptb-1">
              <div className="row">
                <div className="col-4 col-md-4 col-xl-4">
                  <div className="data-info"></div>
                </div>
                <div className="col-4 col-md-4 col-xl-4">
                  <div className="data-info"></div>
                </div>
                <div className="col-4 col-md-4 col-xl-4">
                  <div className="data-info"></div>
                </div>
                <div className="col-4 col-md-4 col-xl-4">
                  <div className="data-info"></div>
                </div>
                <div className="col-4 col-md-4 col-xl-4">
                  <div className="data-info"></div>
                </div>
                <div className="col-4 col-md-4 col-xl-4">
                  <div className="data-info"></div>
                </div>
                <div className="col-4 col-md-4 col-xl-4">
                  <div className="data-info"></div>
                </div>
                <div className="col-4 col-md-4 col-xl-4">
                  <div className="data-info"></div>
                </div>
                <div className="col-4 col-md-4 col-xl-4">
                  <div className="data-info"></div>
                </div>
              </div>
            </div>
            <div className="middle-data-section-info ptb-1">
              <div className="content-description-info">
                <h2 className="content-title-info">{values.headline}</h2>
                <p className="description-info">{values.body}</p>
                <a style={{ color: '#2c6342', pointerEvents: 'none', overflowWrap: 'break-word' }} href="">
                  {values.link}
                </a>
                {/* <img src={values.advertisement_image && URL.createObjectURL(values.advertisement_image)} /> */}
                {typeof values.advertisement_image === 'string' ? (
                  <img src={values.advertisement_image} />
                ) : (
                  <img src={values.advertisement_image && URL.createObjectURL(values.advertisement_image)} />
                )}
              </div>
            </div>
            <div className="bottom-data-section-info ptb-1">
              <div className="cus-row">
                <div className="cus-col-5">
                  <div className="data-info"></div>
                </div>
                <div className="cus-col-5">
                  <div className="data-info"></div>
                </div>
                <div className="cus-col-5">
                  <div className="data-info"></div>
                </div>
                <div className="cus-col-5">
                  <div className="data-info"></div>
                </div>
                <div className="cus-col-5">
                  <div className="data-info"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Preview;
