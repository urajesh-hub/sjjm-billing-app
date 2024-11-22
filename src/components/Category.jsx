import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import CategoryToExcel from "./CategoryToExcel";

const Category = () => {
  const [mealData, setMealData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const [mealResponse, empResponse] = await Promise.all([
          axios.get(import.meta.env.VITE_MEALFORM_API),
          axios.get(import.meta.env.VITE_API_URL),
        ]);

        setMealData(
          Array.isArray(mealResponse.data.meals) ? mealResponse.data.meals : []
        );
        setEmpData(empResponse.data.employees || []);
      } catch (err) {
        console.error("Error fetching meal or employee data", err);
      }
      setLoading(false);
    };

    fetchMealData();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Date in "yyyy-mm-dd" format
  };

  // Filter data based on selected year, month, and date
  const filteredMealData = mealData.filter((meal) => {
    const mealDate = new Date(meal.date);
    const isSameYear = mealDate.getFullYear() === selectedYear;
    const isSameMonth = mealDate.getMonth() + 1 === selectedMonth;
    const isSameDate = selectedDate
      ? mealDate.toISOString().split("T")[0] === selectedDate
      : true; // Check if selected date matches

    return isSameYear && isSameMonth && isSameDate;
  });

  const calculateCategoryWise = () => {
    const categoryCounts = {};

    filteredMealData.forEach((meal) => {
      if (meal.empCode) {
        const category = empData.find(
          (emp) => emp.empCode === meal.empCode
        )?.category;
        if (!category) return;

        if (!categoryCounts[category]) {
          categoryCounts[category] = {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
          };
        }

        if (meal.breakfast) categoryCounts[category].breakfast += 1;
        if (meal.lunch) categoryCounts[category].lunch += 1;
        if (meal.dinner) categoryCounts[category].dinner += 1;
      }
    });

    return categoryCounts;
  };

  const categoryWiseData = calculateCategoryWise();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mt-4">
      <h5 className="mb-3 text-center fw-bold">CATEGORY WISE MEAL REPORT</h5>

      {/* Year, Month, and Date Selectors */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fw-bold">
          <label htmlFor="year" className="mr-2">
            YEAR:
          </label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() + i; // Starts from 2020 and ends at 2024
              return (
                <option key={year} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
        </div>

        <div className="fw-bold">
          <label htmlFor="month" className="mr-2">
            MONTH:
          </label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(0, month - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>

        <div className="fw-bold">
          <label htmlFor="date" className="mr-2">
            DATE:
          </label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div>
          <CategoryToExcel
            totals={categoryWiseData}
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            selectedDate={selectedDate}
          />
        </div>
      </div>

      {/* Category-wise Meal Count Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark text-center">
            <tr>
              <th>CATEGORY</th>
              <th>BREAKFAST</th>
              <th>LUNCH</th>
              <th>DINNER</th>
            </tr>
          </thead>
          {/* <tbody className="text-center">
            {Object.keys(categoryWiseData).map((category) => (
              <tr key={category}>
                <td>{category}</td>
                <td>{categoryWiseData[category].breakfast}</td>
                <td>{categoryWiseData[category].lunch}</td>
                <td>{categoryWiseData[category].dinner}</td>
              </tr>
            ))}
          </tbody> */}
          <tbody className="text-center">
            {Object.keys(categoryWiseData).length > 0 ? (
              Object.keys(categoryWiseData).map((category) => (
                <tr key={category}>
                  <td>{category}</td>
                  <td>{categoryWiseData[category].breakfast}</td>
                  <td>{categoryWiseData[category].lunch}</td>
                  <td>{categoryWiseData[category].dinner}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-danger">
                  No Meals Data Available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Category;
