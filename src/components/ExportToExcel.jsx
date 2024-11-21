// src/components/ExportToExcel.jsx
import React from 'react';
import * as XLSX from 'xlsx';

const ExportToExcel = ({ totals, selectedYear, selectedMonth }) => {
  const exportToExcel = () => {
    const dataWithHeader = [
      { A: "Sri Jayajothi and Company Private Limited" },
      { A: `Monthly Meals Report: ${new Date(selectedYear, selectedMonth - 1).toLocaleString("default", { month: "short", year: "numeric" })}` },
      {},
      { A: "EMP CODE", B: "EMP NAME", C: "DEPARTMENT", D: "BREAKFAST DAYS", E: "LUNCH DAYS", F: "DINNER DAYS", G: "BREAKFAST TOTAL", H: "LUNCH TOTAL", I: "DINNER TOTAL", J: "GRAND TOTAL" },
      ...totals.map((emp) => ({
        A: emp.empCode,
        B: emp.empName,
        C: emp.department,
        D: emp.breakfastDays,
        E: emp.lunchDays,
        F: emp.dinnerDays,
        G: `₹ ${emp.breakfastTotal.toFixed(2)}`,
        H: `₹ ${emp.lunchTotal.toFixed(2)}`,
        I: `₹ ${emp.dinnerTotal.toFixed(2)}`,
        J: `₹ ${emp.totalAmount.toFixed(2)}`,
      })),
    ];

    const worksheet = XLSX.utils.json_to_sheet(dataWithHeader, { skipHeader: true });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Meals Report");

    worksheet['A1'].s = { font: { bold: true, color: { rgb: "000000" } }, alignment: { horizontal: "center" } };
    worksheet['A2'].s = { font: { bold: true, color: { rgb: "000000" } }, alignment: { horizontal: "center" } };

    worksheet["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 10 } },
    ];

    worksheet["!cols"] = Array(10).fill({ wpx: 100 });

    XLSX.writeFile(workbook, `Monthly_Meals_Report_${selectedMonth}_${selectedYear}.xlsx`);
  };

  return (
    <i
      onClick={exportToExcel}
      className="fas fa-file-excel fa-2x text-success me-3"
      style={{ cursor: "pointer" }}
      title="Download Excel"
    ></i>
  );
};

export default ExportToExcel;
