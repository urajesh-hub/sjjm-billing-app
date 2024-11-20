import React, { useState, useEffect } from "react";
import axios from "axios";

const MealFormManager = () => {
  const [meals, setMeals] = useState([]);
  const [filteredMeals, setFilteredMeals] = useState([]);
  const [formData, setFormData] = useState({
    empCode: "",
    date: "",
    breakfast: false,
    lunch: false,
    dinner: false,
    empName: "",
    department: "",
  });
  const [editingMeal, setEditingMeal] = useState(null);
  const [selectedDate, setSelectedDate] = useState(""); // For date filtering

 
  const API_URL = import.meta.env.VITE_MEALFORM_API_EDIT_DELETE;

  // Fetch meals
  const fetchMeals = async () => {
    try {
      const response = await axios.get(API_URL);
      setMeals(response.data.meals);
      setFilteredMeals(response.data.meals); // Set initial filtered meals
    } catch (err) {
      console.error("Error fetching meals:", err);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  // Convert timestamp to yyyy-mm-dd format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Return in yyyy-mm-dd format
  };

  // Filter meals based on selected date
  useEffect(() => {
    if (selectedDate) {
      // Filter based on the selected date
      const filtered = meals.filter((meal) => {
        const mealDate = formatDate(meal.date); // Format the meal date
        return mealDate === selectedDate; // Compare with selected date
      });
      setFilteredMeals(filtered);
    } else {
      setFilteredMeals([]); // Set empty if no date is selected
    }
  }, [selectedDate, meals]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingMeal) {
        // Update meal
        await axios.put(`${API_URL}/${editingMeal._id}`, formData);
        setEditingMeal(null);
      } else {
        // Create meal
        await axios.post(API_URL, formData);
      }
      fetchMeals();
      setFormData({
        empCode: "",
        date: "",
        breakfast: false,
        lunch: false,
        dinner: false,
        empName: "",
        department: "",
      });
    } catch (err) {
      console.error("Error saving meal:", err);
    }
  };

  // Handle edit
  const handleEdit = (meal) => {
    setEditingMeal(meal);
    setFormData(meal);
  };

  // Handle delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this meal?");
    
    if (confirmDelete) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchMeals(); // Refresh the list after deletion
        alert("Meal deleted successfully!");
      } catch (err) {
        console.error("Error deleting meal:", err);
        alert("Failed to delete the meal. Please try again.");
      }
    } else {
      console.log("Deletion canceled.");
    }
  };
  

  // Handle date selection
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  return (
    <div className="container mt-5">
      <h4 className="mb-4 text-center fw-bold">MEAL ENTRY  DETAILS</h4>

      <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
        <div className="d-flex flex-wrap mb-3">
          <div className="col-3">
            <label htmlFor="empCode">Employee Code</label>
            <input
              type="text"
              id="empCode"
              name="empCode"
              value={formData.empCode}
              onChange={handleChange}
              className="form-control"
              placeholder=" Code"
              required
              disabled
            />
          </div>
          <div className="col-3">
            <label htmlFor="empName">Employee Name</label>
            <input
              type="text"
              id="empName"
              name="empName"
              value={formData.empName}
              onChange={handleChange}
              className="form-control"
              placeholder=" Name"
              required
              
              disabled
            />
          </div>
          <div className="col-3">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-control"
              required
              
            />
          </div>
          <div className="col-3">
            <label htmlFor="department">Department</label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="form-control"
              placeholder="Department"
              required
              disabled
            />
          </div>
        </div>

        <div className="form-group mb-3">
          <label className="mr-3 fw-bold">Meals</label>
          <div className="d-flex">
            <label className="mr-2" style={{ marginRight: "15px" }}>
              Breakfast
              <input
                type="checkbox"
                name="breakfast"
                checked={formData.breakfast}
                onChange={handleChange}
                style={{ marginLeft: "10px" }}
              />
            </label>
            <label className="mr-2" style={{ marginRight: "15px" }}>
              Lunch
              <input
                type="checkbox"
                name="lunch"
                checked={formData.lunch}
                onChange={handleChange}
                style={{ marginLeft: "10px" }}
              />
            </label>
            <label className="mr-2" style={{ marginRight: "15px" }}>
              Dinner
              <input
                type="checkbox"
                name="dinner"
                checked={formData.dinner}
                onChange={handleChange}
                style={{ marginLeft: "10px" }}
              />
            </label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          {editingMeal ? "Update Meal" : "Add Meal"}
        </button>
      </form>

      {/* Date Picker to filter meals */}
      <div className="mt-3 fw-bold d-flex align-items-center">
        <label htmlFor="mealDate" className="mr-3">
          View Report Date : <> - </>
        </label>
        <input
          type="date"
          id="mealDate"
          value={selectedDate}
          onChange={handleDateChange}
          className="form-control"
          style={{ width: "200px" }} // Adjust the width as needed
        />
      </div>

      {/* Show records only when a date is selected */}
      {selectedDate && (
        <>
          <h3 className="mt-4">Meal Entries</h3>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Employee Code</th>
                  <th>Date</th>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Breakfast</th>
                  <th>Lunch</th>
                  <th>Dinner</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMeals.length > 0 ? (
                  filteredMeals.map((meal) => (
                    <tr key={meal._id}>
                      <td>{meal.empCode}</td>
                      <td>{formatDate(meal.date)}</td>
                      <td>{meal.empName}</td>
                      <td>{meal.department}</td>
                      <td>{meal.breakfast ? "Yes" : "No"}</td>
                      <td>{meal.lunch ? "Yes" : "No"}</td>
                      <td>{meal.dinner ? "Yes" : "No"}</td>
                      <td className="d-flex justify-content-around">
                        <button
                          className="btn btn-warning btn-sm ml-2"
                          onClick={() => handleEdit(meal)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm ml-2"
                          onClick={() => handleDelete(meal._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">
                      No records found for this date.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default MealFormManager;
