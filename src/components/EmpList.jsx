import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const EmpList = () => {
  const [empData, setEmpData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    empCode: "",
    empName: "",
    category: "",
    department: "",
    status: "",
    breakfastRate: "",
    lunchRate: "",
    dinnerRate: "",
    Joindate: "",
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      setEmpData(response.data.employees); // Adjust based on API structure
    } catch (error) {
      console.error("Error fetching employees", error);
      alert("Failed to load employee data.");
    }
  };

  // Format the join date to dd-mm-yyyy
  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShowModal = (emp = null) => {
    setIsUpdating(!!emp);
    setFormData(
      emp || {
        empCode: "",
        empName: "",
        category: "",
        department: "",
        status: "",
        breakfastRate: "",
        lunchRate: "",
        dinnerRate: "",
        Joindate: "",
      }
    );
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isUpdating) {
        await axios.put(`${API_URL}/${formData.empCode}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }

      setShowModal(false);
      fetchEmployees(); // Refresh data
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Failed to save data.");
    }
  };

  const handleDelete = async (empCode) => {
    if (
      window.confirm(`Are you sure you want to delete Employee ${empCode}?`)
    ) {
      try {
        await axios.delete(`${API_URL}/${empCode}`);
        fetchEmployees(); // Refresh data
      } catch (error) {
        console.error("Error deleting employee", error);
        alert("Failed to delete employee.");
      }
    }
  };

  return (
    <div className="container">
      <h3 className="text-center">EMPLOYEE LIST</h3>
      <div className="text-end mb-3">
        <button className="btn btn-primary" onClick={() => handleShowModal()}>
          ADD EMPLOYEE
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-sm table-bordered table-striped">
          <thead className="table-light text-center">
            <tr>
              <th>EMP CODE</th>
              <th>EMP NAME</th>
              <th>CATEGORY</th>
              <th>DEPT</th>
              <th>STATUS</th>
              <th>BREAKFAST RATE</th>
              <th>LUNCH RATE</th>
              <th>DINNER RATE</th>
              <th>JOIN DATE</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {empData.map((emp) => (
              <tr key={emp.empCode}>
                <td className="small text-center">{emp.empCode}</td>
                <td className="small">{emp.empName}</td>
                <td className="small text-center">{emp.category}</td>
                <td className="small text-center">{emp.department}</td>
                <td className="small text-center">{emp.status}</td>
                <td className="small text-center">{emp.breakfastRate}</td>
                <td className="small text-center">{emp.lunchRate}</td>
                <td className="small text-center">{emp.dinnerRate}</td>
                <td className="small text-center">
                  {formatDate(emp.Joindate)}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-secondary me-2"
                    onClick={() => handleShowModal(emp)}
                  >
                    UPDATE
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(emp.empCode)}
                  >
                    DELETE
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isUpdating ? "Update Employee" : "Add Employee"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {/* Form Fields */}
                  <div className="mb-3">
                    <label htmlFor="empCode" className="form-label">
                      Emp Code
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="empCode"
                      name="empCode"
                      value={formData.empCode}
                      onChange={handleInputChange}
                      readOnly={isUpdating}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="empName" className="form-label">
                      Emp Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="empName"
                      name="empName"
                      value={formData.empName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                    Category
                    </label>
                    <select
                      className="form-control"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select category</option>
                      <option value="SJJ STAFF">SJJ STAFF</option>
                      <option value="GUEST">GUEST</option>
                      <option value="ERECTOR">ERECTOR</option>
                      <option value="SERVICE ENGINEER">SERVICE ENGINEER</option>
                      <option value="AUDITOR">AUDITOR</option>
                      <option value="OTHERS">OTHERS</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="department" className="form-label">
                      Department
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="status" className="form-label">
                      Status
                    </label>
                    <select
                      className="form-control"
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="breakfastRate" className="form-label">
                      Breakfast Rate
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="breakfastRate"
                      name="breakfastRate"
                      value={formData.breakfastRate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="lunchRate" className="form-label">
                      Lunch Rate
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="lunchRate"
                      name="lunchRate"
                      value={formData.lunchRate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dinnerRate" className="form-label">
                      Dinner Rate
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="dinnerRate"
                      name="dinnerRate"
                      value={formData.dinnerRate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="Joindate" className="form-label">
                      Join Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="Joindate"
                      name="Joindate"
                      value={formData.Joindate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {isUpdating ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmpList;
