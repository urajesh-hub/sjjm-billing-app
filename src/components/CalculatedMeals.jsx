
import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import ExportToExcel from './ExportToExcel';
import ExportToPDF from './ExportToPDF';

const CalculatedMeals = () => {
  const [mealData, setMealData] = useState([]);
  const [empData, setEmpData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState(""); // Initialize as an empty string

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const [mealResponse, empResponse] = await Promise.all([
          axios.get(import.meta.env.VITE_MEALFORM_API),
          axios.get(import.meta.env.VITE_API_URL),
        ]);

        setMealData(Array.isArray(mealResponse.data.meals) ? mealResponse.data.meals : []);
        setEmpData(empResponse.data.employees || []);
      } catch (err) {
        console.error("Error fetching meal or employee data", err);
      }
      setLoading(false);
    };

    fetchMealData();
  }, []);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value); // Update selectedDate when user picks a date
  };

  const calculateTotals = () => {
    return empData.map((emp) => {
      const employeeMeals = mealData.filter((meal) => {
        const mealDate = new Date(meal.date);
        const isSameMonthAndYear =
          mealDate.getFullYear() === selectedYear &&
          mealDate.getMonth() + 1 === selectedMonth;
        
        // If selectedDate is set, filter meals for that specific date
        if (selectedDate) {
          return (
            meal.empCode === emp.empCode &&
            mealDate.toISOString().slice(0, 10) === selectedDate // Match date only (yyyy-mm-dd)
          );
        }

        return meal.empCode === emp.empCode && isSameMonthAndYear;
      });

      const breakfastDays = employeeMeals.filter((meal) => meal.breakfast).length;
      const lunchDays = employeeMeals.filter((meal) => meal.lunch).length;
      const dinnerDays = employeeMeals.filter((meal) => meal.dinner).length;

      const breakfastTotal = breakfastDays * emp.breakfastRate;
      const lunchTotal = lunchDays * emp.lunchRate;
      const dinnerTotal = dinnerDays * emp.dinnerRate;

      return {
        empCode: emp.empCode,
        empName: emp.empName,
        department: emp.department,
        breakfastDays,
        lunchDays,
        dinnerDays,
        breakfastTotal,
        lunchTotal,
        dinnerTotal,
        totalAmount: breakfastTotal + lunchTotal + dinnerTotal,
      };
    });
  };

  const handleSort = (column) => {
    const direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key: column, direction });
  };

  const sortedData = () => {
    const data = calculateTotals();
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return data;
  };

  if (loading) return <div>Loading...</div>;

  const totals = sortedData();

  return (
    <div className="container mt-4">
      <h5 className="mb-3 text-center fw-bold">MONTHLY CALCULATED LIST</h5>

      {/* Year, Month, and Date Selectors */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="fw-bold">
          <label htmlFor="year" className="mr-2">YEAR:</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          >
            {[...Array(5)].map((_, i) => {
              const year = new Date().getFullYear() - i;
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>

        <div className="fw-bold">
          <label htmlFor="month" className="mr-2">MONTH:</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(0, month - 1).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>

        <div className="fw-bold">
          <label htmlFor="date" className="mr-2">DATE:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={handleDateChange}
          />
        </div>

        <div>
          {/* Export buttons */}
          <ExportToExcel totals={totals} selectedYear={selectedYear} selectedMonth={selectedMonth} selectedDate={selectedDate} />
          <ExportToPDF totals={totals} selectedYear={selectedYear} selectedMonth={selectedMonth} selectedDate={selectedDate} />
        </div>
      </div>

      {/* Meal Data Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-sm">
          <thead className="thead-dark text-center">
            <tr>
              {['empCode', 'empName', 'department', 'breakfastDays', 'lunchDays', 'dinnerDays', 'breakfastTotal', 'lunchTotal', 'dinnerTotal', 'grandAmount'].map((col) => (
                <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                  {col.charAt(0).toUpperCase() + col.slice(1).replace(/([A-Z])/g, ' $1').toUpperCase()}
                  {sortConfig.key === col ? (sortConfig.direction === 'asc' ? ' ↑' : ' ↓') : ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-center">
            {totals.map((emp) => (
              <tr key={emp.empCode}>
                <td>{emp.empCode}</td>
                <td className="text-start">{emp.empName}</td>
                <td>{emp.department}</td>
                <td>{emp.breakfastDays}</td>
                <td>{emp.lunchDays}</td>
                <td>{emp.dinnerDays}</td>
                <td>{`₹ ${emp.breakfastTotal.toFixed()}`}</td>
                <td>{`₹ ${emp.lunchTotal.toFixed()}`}</td>
                <td>{`₹ ${emp.dinnerTotal.toFixed()}`}</td>
                <td className="fw-bold">₹ {emp.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CalculatedMeals;
