import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-dark bg-dark"
      style={{ height: "40px", paddingTop: "5px", paddingBottom: "5px" }}
    >
      <div className="container d-flex justify-content-around align-items-center">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img
            src="/images/sjjmlogo.jpg"
            alt="Logo"
            style={{ height: "30px", width: "auto", marginRight: "5px" }}
          />
          <span style={{ color: "white", fontSize: "18px" }}>Company Name</span>
        </Link>

        {/* Navbar links */}
        <div className="d-flex justify-content-around" style={{ width: "100%" }}>
          <Link to="/emp-list" className="nav-link text-white">
            Employee Master
          </Link>
          <Link to="/meal-form" className="nav-link text-white">
            Meals Entry Form
          </Link>
          <Link to="/Entry-meals" className="nav-link text-white">
            Meals Data
          </Link>
          <Link to="/calculated-meals" className="nav-link text-white">
            Reports
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;