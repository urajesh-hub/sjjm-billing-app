import React from "react";
import { NavLink } from "react-router-dom";

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-body text-center">
          {/* Main Heading */}
          <h3 className="card-title text-uppercase text-muted fw-bold">
            Sri Jayajothi and Company Private Limited
          </h3>
          {/* Image with styling */}
          <div className="my-4">
            <NavLink to="/" className="navbar-brand">
              <img
                src="/images/Entrance1.jpg"
                alt="Entrance"
                className="img-fluid rounded shadow-sm border"
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  maxHeight: "400px",
                  border: "5px solid #ddd",
                  borderRadius: "15px",
                }}
              />
            </NavLink>
          </div>
          {/* Subheading */}
          <h4 className="card-subtitle text-muted mt-3">
           MESS BILLING SYSTEM
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Home;
