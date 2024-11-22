// src/components/MealForm.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

const MealForm = () => {
  const [empData, setEmpData] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [mealSelections, setMealSelections] = useState({});
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const getEmpData = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_API_URL);
        setEmpData(response.data.employees);

        // Extract unique departments dynamically
        const uniqueDepartments = [
          ...new Set(response.data.employees.map((emp) => emp.department)),
        ];
        setDepartments(uniqueDepartments);
      } catch (err) {
        console.error("Error fetching employees data", err);
      }
    };
    getEmpData();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleCheckboxChange = (empCode, empName, category, department, mealType) => {
    setMealSelections((prev) => ({
      ...prev,
      [empCode]: {
        empName,
        category,
        department,
        ...prev[empCode],
        [mealType]: !prev[empCode]?.[mealType] || false,
      },
    }));
  };

  const handleSave = async () => {
    const selectedMeals = empData
      .filter(emp => {
        const meals = mealSelections[emp.empCode];
        return meals && (meals.breakfast || meals.lunch || meals.dinner);
      })
      .map(emp => ({
        empCode: emp.empCode,
        empName: emp.empName,
        category: emp.category,
        department: emp.department,
        date: selectedDate,
        breakfast: mealSelections[emp.empCode]?.breakfast || false,
        lunch: mealSelections[emp.empCode]?.lunch || false,
        dinner: mealSelections[emp.empCode]?.dinner || false,
      }));

    if (selectedMeals.length === 0) {
      alert("Please select at least one meal for an employee to save.");
      return;
    }

    try {
      for (const meal of selectedMeals) {
        await axios.post(import.meta.env.VITE_MEALFORM_API, meal);
      }
      alert("Meals saved successfully!");

      const resetMealSelections = {};
      setMealSelections(resetMealSelections);

    } catch (err) {
      console.error("Error while saving meals", err);
      if (err.response) {
        console.error("Error response", err.response);
        alert(`Error: ${err.response.data.message || err.response.statusText}`);
      } else {
        alert("An error occurred while saving the meals.");
      }
    }
  };

  // Filter employees: check for active status and department
  const filteredEmpData = empData.filter((emp) =>
    emp.status === "Active" && (selectedDepartment ? emp.department === selectedDepartment : true)
  );

  return (
    <div className="container mt-4">
      <div className="card ">
        <div className="card-body">
          <h5 className="card-title mb-3 text-center fw-bold ">MEAL FORM</h5>

          <div className="row mb-3">
            <div className="col-md-6 fw-bold">
              <label htmlFor="date">SELECT DATE:</label>
              <input
                type="date"
                id="date"
                className="form-control form-control-sm"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            <div className="col-md-6 fw-bold">
              <label htmlFor="department">SELECT DEPARTMENT:</label>
              <select
                id="department"
                className="form-control form-control-sm"
                value={selectedDepartment}
                onChange={handleDepartmentChange}
              >
                <option value="">All Departments</option>
                {departments.map((department, index) => (
                  <option key={index} value={department}>
                    {department}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {selectedDate && (
            <div>
              <h6 className="text-center text-danger">SELECT MEAL FOR {selectedDate}</h6>
              <table className="table table-sm table-striped table-bordered">
                <thead>
                  <tr className="text-center">
                    <th>Emp Code</th>
                    <th>Emp Name</th>
                    <th>CATEGORY</th>
                    <th>DEPT</th>
                    <th>BREAKFAST</th>
                    <th>LUNCH</th>
                    <th>DINNER</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmpData.map((emp) => (
                    <tr key={emp.empCode}>
                      <td className="text-center">{emp.empCode}</td>
                      <td>{emp.empName}</td>
                      <td className="text-center">{emp.category}</td>
                      <td className="text-center">{emp.department}</td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={mealSelections[emp.empCode]?.breakfast || false}
                          onChange={() =>
                            handleCheckboxChange(emp.empCode, emp.empName, emp.category, emp.department, "breakfast")
                          }
                        />
                      </td>
                      <td className="text-center">
                        <input
                          type="checkbox"
                          checked={mealSelections[emp.empCode]?.lunch || false}
                          onChange={() =>
                            handleCheckboxChange(emp.empCode, emp.empName, emp.category, emp.department, "lunch")
                          }
                        />
                      </td>
                      <td className="text-center ">
                        <input
                          type="checkbox"
                          checked={mealSelections[emp.empCode]?.dinner || false}
                          onChange={() =>
                            handleCheckboxChange(emp.empCode, emp.empName, emp.category, emp.department, "dinner")
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                Save
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MealForm;
