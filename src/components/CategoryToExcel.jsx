import React from "react";
import * as XLSX from "xlsx";

const ExportToExcel = ({ totals, selectedYear, selectedMonth }) => {
  const handleExport = () => {
    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet([
      ["Company Name"], // Row 1: Company Name
      ["Category Wise Meal Report"], // Row 2: Report Title
      [`Month: ${new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })}, Year: ${selectedYear}`], // Row 3: Month and Year
      [], // Row 4: Empty row for spacing
    ]);

    // Add table data starting from A5
    const data = Object.keys(totals).map((category) => ({
      Category: category,
      "Breakfast Count": totals[category].breakfast,
      "Lunch Count": totals[category].lunch,
      "Dinner Count": totals[category].dinner,
    }));

    XLSX.utils.sheet_add_json(ws, data, { origin: "A5", header: ["Category", "Breakfast Count", "Lunch Count", "Dinner Count"] });

    // Apply styles
    ws["A1"].s = {
      font: { bold: true, color: { rgb: "FF0000" } }, // Bold and Red
      alignment: { horizontal: "center" }, // Center align
    };
    ws["A2"].s = { font: { bold: true } }; // Bold
    ws["A3"].s = { font: { italic: true } }; // Italic

    // Merge A1 across columns for better presentation
    ws["!merges"] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // Merge A1:D1
      { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Merge A2:D2
      { s: { r: 2, c: 0 }, e: { r: 2, c: 3 } }, // Merge A3:D3
    ];

    // Create workbook and append worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Category Wise ${selectedMonth}-${selectedYear}`);

    // Export file
    XLSX.writeFile(wb, `Category_Wise_Meals_${selectedMonth}_${selectedYear}.xlsx`);
  };

  return (
    <button onClick={handleExport} className="btn btn-success">
      Export to Excel
    </button>
  );
};

export default ExportToExcel;


// import React from 'react';
// import * as XLSX from 'xlsx';

// const ExportToExcel = ({ totals, selectedYear, selectedMonth }) => {
//   const handleExport = () => {
//     // Create worksheet
//     const ws = XLSX.utils.aoa_to_sheet([
//       ["SRI JAYAJOTHI AND COMPANY PRIVATE LIMITED"], // Row 1: Company Name
//       ["Category Wise Meal Report"], // Row 2: Report Title
//       [`Month: ${new Date(0, selectedMonth - 1).toLocaleString("default", { month: "long" })}, Year: ${selectedYear}`], // Row 3: Month and Year
//       [], // Row 4: Empty row for spacing
//     ]);

//     // Add table data starting from A5
//     const data = Object.keys(totals).map((category) => ({
//       Category: category,
//       "Breakfast Count": totals[category].breakfast,
//       "Lunch Count": totals[category].lunch,
//       "Dinner Count": totals[category].dinner,
//     }));

//     XLSX.utils.sheet_add_json(ws, data, { origin: "A5", header: ["Category", "Breakfast Count", "Lunch Count", "Dinner Count"] });

//     // Create workbook and append worksheet
//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws, `Category Wise ${selectedMonth}-${selectedYear}`);

//     // Export file
//     XLSX.writeFile(wb, `Category_Wise_Meals_${selectedMonth}_${selectedYear}.xlsx`);
//   };

//   return (
//     <button onClick={handleExport} className="btn btn-success">
//       Export to Excel
//     </button>
//   );
// };

// export default ExportToExcel;
