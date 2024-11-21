// src/components/ExportToPDF.jsx
import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ExportToPDF = ({ totals, selectedYear, selectedMonth }) => {
  const exportToPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", format: "a4" });
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    // Center the Company Name
    doc.setFont("helvetica", "bold");
    const companyName = "Sri Jayajothi and Company Private Limited";
    const pageWidth = doc.internal.pageSize.width;
    const companyNameWidth = doc.getTextWidth(companyName);
    const companyNameX = (pageWidth - companyNameWidth) / 2;
    doc.text(companyName, companyNameX, 10);

    // Left-align Report Date
    const reportDate = new Date(selectedYear, selectedMonth - 1).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    doc.setFont("helvetica", "normal");
    const reportDateX = 10; // Left-align the report date
    doc.text(`Meals Report: ${reportDate}`, reportDateX, 16);

    const headers = [
      ["EMP CODE", "EMP NAME", "DEPARTMENT", "BREAKFAST DAYS", "LUNCH DAYS", "DINNER DAYS", "BREAKFAST TOTAL", "LUNCH TOTAL", "DINNER TOTAL", "GRAND TOTAL"]
    ];

    // Format data for the table
    const data = totals.map(emp => [
      emp.empCode,
      emp.empName,
      emp.department,
      emp.breakfastDays,
      emp.lunchDays,
      emp.dinnerDays,
      `₹ ${emp.breakfastTotal.toFixed(2)}`,
      `₹ ${emp.lunchTotal.toFixed(2)}`,
      `₹ ${emp.dinnerTotal.toFixed(2)}`,
      `₹ ${emp.totalAmount.toFixed(2)}`
    ]);

    // Table configuration (centered by default)
    doc.autoTable({
      head: headers,
      body: data,
      startY: 25,
      theme: "grid",
      styles: { fontSize: 8, textColor: [0, 0, 0] },
      headStyles: { fillColor: [220, 220, 220] },
      columnStyles: {
        9: { fontStyle: 'bold', textColor: [0, 0, 0] } // Bold the "Grand Total" column
      },
    });

    // Footer - "Prepared by", "Checked by", "Approved by" (centered)
    const gapAfterTable = 23; // Gap between table and footer
    const yOffset = doc.lastAutoTable.finalY + gapAfterTable; // Adding the gap

    doc.setFont("helvetica", "bold");

    const footerX = (pageWidth - 180) / 2; // Centering the footer text horizontally
    doc.text("Prepared by", footerX, yOffset);
    doc.text("Checked by", footerX + 60, yOffset); // Adjusted to the right of "Prepared by"
    doc.text("Approved by", footerX + 120, yOffset); // Adjusted to the right of "Checked by"

    // Save the PDF
    doc.save(`Monthly_Meals_Report_${selectedMonth}_${selectedYear}.pdf`);
  };

  return (
    <i
      onClick={exportToPDF}
      className="fas fa-file-pdf fa-2x text-danger"
      style={{ cursor: "pointer" }}
      title="Download PDF"
    ></i>
  );
};

export default ExportToPDF
