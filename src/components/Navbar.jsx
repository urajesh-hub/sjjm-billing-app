import React from "react";
import { Link } from "react-router-dom";
// import "./Navbar.css"; // Assuming the styles are in Navbar.css

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark"  style={{ height: '40px', paddingTop: '5px', paddingBottom: '5px' }}>
      {" "}
      {/* Custom color classes */}
      <div className="container">
        {/* Logo link */}
        <Link to="/" className="navbar-brand">
          <img src="/images/sjjmlogo.jpg" alt="Logo" className="navbar-logo" style={{ height: '30px', width: 'auto' }}/>
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

        {/* Navbar links (collapsed on xs screens) */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {" "}
            {/* ms-auto aligns the links to the right */}
            <li className="nav-item">
              <Link to="/emp-list" className="nav-link text-white">
                Employee Master
              </Link>{" "}
              {/* White text */}
            </li>
            <li className="nav-item">
              <Link to="/meal-form" className="nav-link text-white">
                Meals Entry Form
              </Link>{" "}
              {/* White text */}
            </li>
            
            <li className="nav-item">
              <Link to="/Entry-meals" className="nav-link text-white">
                Meals Data
              </Link>{" "}
              {/* White text */}
            </li>

            <li className="nav-item">
              <Link to="/calculated-meals" className="nav-link text-white">
                Reports
              </Link>{" "}
              {/* White text */}
            </li>
            
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
