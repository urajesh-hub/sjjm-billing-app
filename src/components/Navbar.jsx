import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      style={{ height: "40px", paddingTop: "5px", paddingBottom: "5px" }}
    >
      <div className="container">
        {/* Logo link */}
        <Link to="/" className="navbar-brand">
          <img
            src="/images/sjjmlogo.jpg"
            alt="Logo"
            className="navbar-logo"
            style={{ height: "30px", width: "auto" }}
          />
        </Link>
        {/* Toggle button for mobile screens */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link to="/emp-list" className="nav-link text-white">
                Employee Master
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/meal-form" className="nav-link text-white">
                Meals Entry Form
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/Entry-meals" className="nav-link text-white">
                Meals Data
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/calculated-meals" className="nav-link text-white">
                Reports
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;