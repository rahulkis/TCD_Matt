import React from "react";
import Sidebar from './Sidebar';

function Header() {
  return (
    <>
      <header className="header fixed-top">
        <div className="header-inner">
          <div className="container-fluid py-2">
            <div className="header-content">
              <div className="row justify-content-between align-items-center">
                <div className="col-auto">
                  <a id="sidepanel-toggler" className="sidepanel-toggler d-inline-block d-xl-none" href="#">
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30" role="img">
                      <path stroke="#334155" stroke-linecap="round" strokeMiterlimit="10" stroke-width="2" d="M4 7h22M4 15h22M4 23h22"></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Sidebar />
      </header>
    </>
  );
}

export default Header;
