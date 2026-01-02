import React from "react";
import Logo from "../img/logo.png"; 

const Loader = () => {
  return (
    <div className="app-loader">
      <div className="logo-loader">
        <div className="logo-ring"></div>

        <div className="logo-wrapper">
          <img src={Logo} alt="Loading Logo" />
        </div>

        <p className="loader-text">Loading, please wait...</p>
      </div>
    </div>
  );
};

export default Loader;
