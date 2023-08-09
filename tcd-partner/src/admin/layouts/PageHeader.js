import React from "react";

function PageHeader() {
  return (
    <>
      <section className="content-header">
        {/* <h1><%=data.pageTitle%></h1> */}
        <h1>Dashboard</h1>

        <ol className="breadcrumb">
          <li>
            <a href="/admin/dashboard">
              <i className="fa fa-dashboard"></i> Home
            </a>
          </li>
          {/* <li className="active"><%=data.pageTitle%></li> */}
          <li className="active">Dashboard</li>
        </ol>
      </section>
    </>
  );
}

export default PageHeader;
