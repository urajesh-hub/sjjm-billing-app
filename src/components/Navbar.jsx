import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css"; // Import the CSS file

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark ">
      <div className="container">
        {/* Logo */}
        <NavLink to="/" className="navbar-brand ">
          <img src="/images/sjjmlogo.jpg" alt="Logo" />
        </NavLink>
        {/* Toggle Button */}
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
        {/* Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink
                to="/emp-list"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Employee Master
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/meal-form"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Meals Entry Form
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/Entry-meals"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Meals Data
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/category-meals"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Category Report
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/calculated-meals"
                className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
              >
                Reports
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
