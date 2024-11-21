import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocument } from "@aws-sdk/lib-dynamodb";

// Create DynamoDB document client using AWS SDK v3
const dynamo = DynamoDBDocument.from(new DynamoDB());

// Define your table names
const employeeMasterTable = process.env.EMPLOYEE_MASTER_TABLE;
const salaryMasterTable = process.env.SALARY_MASTER_TABLE;
const dailyAttendanceTable = process.env.DAILY_ATTENDANCE_TABLE;
const deductionTable = process.env.DEDUCTION_TABLE;

export const handler = async (event) => {
  let body;
  let statusCode = 200;

  // Define CORS headers
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  try {
    // Handle preflight OPTIONS request for CORS
    if (event.httpMethod === "OPTIONS") {
      return {
        statusCode: 200,
        body: "",
        headers,
      };
    }

    switch (event.httpMethod) {
      case "GET":
        // Handle GET requests for employee, salary, attendance, and deduction
        if (event.path === "/employee") {
          body = await handleEmployeeOperations("GET", event);
        } else if (event.path === "/salary") {
          body = await handleSalaryOperations("GET", event);
        } else if (event.path === "/attendance") {
          body = await handleAttendanceOperations("GET", event);
        } else if (event.path === "/deduction") {
          body = await handleDeductionOperations("GET", event);
        } else {
          statusCode = 404;
          body = { message: "Route not found" };
        }
        break;

      case "POST":
        // Handle POST requests to create new records
        if (event.path === "/employee") {
          body = await handleEmployeeOperations("POST", event);
        } else if (event.path === "/salary") {
          body = await handleSalaryOperations("POST", event);
        } else if (event.path === "/attendance") {
          body = await handleAttendanceOperations("POST", event);
        } else if (event.path === "/deduction") {
          body = await handleDeductionOperations("POST", event);
        } else {
          statusCode = 404;
          body = { message: "Route not found" };
        }
        break;

      case "PUT":
        // Handle PUT requests to update existing records
        if (event.path === "/employee") {
          body = await handleEmployeeOperations("PUT", event);
        } else if (event.path === "/salary") {
          body = await handleSalaryOperations("PUT", event);
        } else if (event.path === "/attendance") {
          body = await handleAttendanceOperations("PUT", event);
        } else if (event.path === "/deduction") {
          body = await handleDeductionOperations("PUT", event);
        } else {
          statusCode = 404;
          body = { message: "Route not found" };
        }
        break;

      case "DELETE":
        // Handle DELETE requests to delete records
        if (event.path === "/employee") {
          body = await handleEmployeeOperations("DELETE", event);
        } else if (event.path === "/salary") {
          body = await handleSalaryOperations("DELETE", event);
        } else if (event.path === "/attendance") {
          body = await handleAttendanceOperations("DELETE", event);
        } else if (event.path === "/deduction") {
          body = await handleDeductionOperations("DELETE", event);
        } else {
          statusCode = 404;
          body = { message: "Route not found" };
        }
        break;

      default:
        statusCode = 404;
        body = { message: "Method not allowed" };
    }

    return {
      statusCode,
      body: JSON.stringify(body),
      headers,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
      headers,
    };
  }
};

// Helper function for employee CRUD operations
async function handleEmployeeOperations(method, event) {
    switch (method) {
      case "GET":
        // Check if query string parameters are present
        if (event.queryStringParameters) {
          const queryParams = Object.keys(event.queryStringParameters);
  
          // If any query string other than 'empCode' is passed, return an error message
          if (queryParams.length !== 1 || queryParams[0] !== "empCode") {
            return {
              message: "Invalid query parameter. Only 'empCode' is allowed.",
            };
          }
  
          // If 'empCode' is provided, fetch the employee data
          const empCode = event.queryStringParameters.empCode;
  
          // Fetch the specific employee from DynamoDB using empCode
          const result = await dynamo.get({
            TableName: employeeMasterTable,
            Key: { empCode },
          });
  
          // If the employee exists, return the employee data, otherwise return an error message
          if (result.Item) {
            return {
              statusCode: 200,
              body: result.Item, // Directly return the item
            };
          } else {
            return {
              statusCode: 404,
              body: { message: "Employee not found." }, // Only the message without stringifying
            };
          }
        } else {
          // If no query string is provided, return all records
          const result = await dynamo.scan({ TableName: employeeMasterTable });
          return {
            statusCode: 200,
            body: result.Items, // Return the items directly without stringifying
          };
        }
  
      case "POST":
        const employeeData = JSON.parse(event.body);
  
        // Check if the empCode already exists
        const existingEmployee = await dynamo.get({
          TableName: employeeMasterTable,
          Key: { empCode: employeeData.empCode },
        });
  
        if (existingEmployee.Item) {
          return { message: "Employee with this empCode already exists" };
        }
  
        // Create a new employee
        await dynamo.put({
          TableName: employeeMasterTable,
          Item: {
            empCode: employeeData.empCode,
            Name: employeeData.Name,
            LastName: employeeData.LastName,
            DOB: employeeData.DOB,
            DOJ: employeeData.DOJ,
            Gender: employeeData.Gender,
            Department: employeeData.Department,
            City: employeeData.City,
            Pincode: employeeData.Pincode,
            Category: employeeData.Category,
            ContactNo: employeeData.ContactNo,
            Address: employeeData.Address,
            AadharNo: employeeData.AadharNo,
            WeekOff: employeeData.WeekOff,
            Status: employeeData.Status,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
  
        return { message: "Employee created successfully" };
  
      case "PUT":
        // Update an existing employee
        const updateData = JSON.parse(event.body);
        await dynamo.update({
          TableName: employeeMasterTable,
          Key: { empCode: updateData.empCode }, // Primary key is empCode
          UpdateExpression:
            "set #name = :name, LastName = :lastName, DOB = :dob, DOJ = :doj, Gender = :gender, Category = :category, Department = :department, ContactNo = :contactNo, Address = :address, City = :city, Pincode = :pincode, WeekOff = :weekOff, AadharNo = :aadharNo, #status = :status, updatedAt = :updatedAt",
          ExpressionAttributeNames: {
            "#name": "Name", // Alias for the reserved keyword
            "#status": "Status",
          },
          ExpressionAttributeValues: {
            ":name": updateData.Name,
            ":lastName": updateData.LastName,
            ":dob": updateData.DOB,
            ":doj": updateData.DOJ,
            ":gender": updateData.Gender,
            ":category": updateData.Category,
            ":department": updateData.Department,
            ":contactNo": updateData.ContactNo,
            ":address": updateData.Address,
            ":city": updateData.City,
            ":pincode": updateData.Pincode,
            ":weekOff": updateData.WeekOff,
            ":aadharNo": updateData.AadharNo,
            ":status": updateData.Status,
            ":updatedAt": new Date().toISOString(),
          },
        });
        return { message: "Employee updated successfully" };
  
      case "DELETE":
        // Delete an employee by empCode
        const deleteempCode = event.queryStringParameters.empCode;
        await dynamo.delete({
          TableName: employeeMasterTable,
          Key: { empCode: deleteempCode },
        });
        return { message: "Employee deleted successfully" };
  
      default:
        return { message: "Method not supported" };
    }
  }
 
// Helper function for Salary CRUD operations (with updated structure)
async function handleSalaryOperations(method, event) {
  switch (method) {
    case "GET":
      if (event.queryStringParameters && event.queryStringParameters.empCode) {
        const empCode = event.queryStringParameters.empCode;
        const result = await dynamo.get({
          TableName: salaryMasterTable,
          Key: { empCode },
        });
        return result.Item ? result.Item : { message: "Salary record not found" };
      } else {
        const result = await dynamo.scan({ TableName: salaryMasterTable });
        return result.Items;
      }

    case "POST":
      const salaryData = JSON.parse(event.body);
      const existingRecord = await dynamo.scan({
        TableName: salaryMasterTable,
        FilterExpression: "empCode = :empCode",
        ExpressionAttributeValues: { ":empCode": salaryData.empCode },
      });

      if (existingRecord.Items.length > 0) {
        return { message: "Error: empCode already exists. Duplicate empCode is not allowed." };
      }

      const totalSalary = [
        salaryData.Basic, salaryData.hra, salaryData.da, 
        salaryData.Special, salaryData.Allowance, salaryData.Bonus, salaryData.Holiday
      ].reduce((sum, field) => sum + (field || 0), 0);

      await dynamo.put({
        TableName: salaryMasterTable,
        Item: {
          empCode: salaryData.empCode,
          Name: salaryData.Name,
          Department: salaryData.Department,
          Basic: salaryData.Basic,
          hra: salaryData.hra,
          da: salaryData.da,
          Special: salaryData.Special,
          Allowance: salaryData.Allowance,
          Bonus: salaryData.Bonus,
          Holiday: salaryData.Holiday,
          Total: totalSalary,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });

      return { message: "Salary record created successfully" };

    case "PUT":
      const updateSalaryData = JSON.parse(event.body);
      const updatedTotal = [
        updateSalaryData.Basic, updateSalaryData.hra, updateSalaryData.da, 
        updateSalaryData.Special, updateSalaryData.Allowance, updateSalaryData.Bonus, updateSalaryData.Holiday
      ].reduce((sum, field) => sum + (field || 0), 0);

      await dynamo.update({
        TableName: salaryMasterTable,
        Key: { empCode: updateSalaryData.empCode },
        UpdateExpression: "set #name = :name, Department = :department, Basic = :basic, hra = :hra, da = :da, Special = :special, Allowance = :allowance, Bonus = :bonus, Holiday = :holiday, #total = :total, updatedAt = :updatedAt",
        ExpressionAttributeNames: {
          "#name": "Name", 
          "#total": "Total"
        },
        ExpressionAttributeValues: {
          ":name": updateSalaryData.Name,
          ":department": updateSalaryData.Department,
          ":basic": updateSalaryData.Basic,
          ":hra": updateSalaryData.hra,
          ":da": updateSalaryData.da,
          ":special": updateSalaryData.Special,
          ":allowance": updateSalaryData.Allowance,
          ":bonus": updateSalaryData.Bonus,
          ":holiday": updateSalaryData.Holiday,
          ":total": updatedTotal,
          ":updatedAt": new Date().toISOString(),
        },
      });
      return { message: "Salary record updated successfully" };

    case "DELETE":
      const deleteSalaryempCode = event.queryStringParameters.empCode;
      await dynamo.delete({
        TableName: salaryMasterTable,
        Key: { empCode: deleteSalaryempCode },
      });
      return { message: "Salary record deleted successfully" };

    default:
      return { message: "Method not supported" };
  }
}
// pattern for  attendancetables:
async function handleAttendanceOperations(method, event) {
  switch (method) {
    case "GET":
      // Get single attendance record or all attendance records
      if (event.queryStringParameters && event.queryStringParameters.idno) {
        const idno = event.queryStringParameters.idno;
        const result = await dynamo.get({
          TableName: dailyAttendanceTable,
          Key: { idno },
        });
        return result.Item
          ? result.Item
          : { message: "Attendance record not found" };
      } else {
        const result = await dynamo.scan({ TableName: dailyAttendanceTable });
        return result.Items;
      }

    case "POST":
      // Create a new attendance record
      const attendanceData = JSON.parse(event.body);
      await dynamo.put({
        TableName: dailyAttendanceTable,
        Item: {
          idno: attendanceData.idno, // Auto-generated or passed in payload
          Attndate: attendanceData.Attndate,
          empCode: attendanceData.empCode,
          AttnStatus: attendanceData.AttnStatus,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      return { message: "Attendance record created successfully" };

    case "PUT":
      // Update an existing attendance record
      const updateAttendanceData = JSON.parse(event.body);
      await dynamo.update({
        TableName: dailyAttendanceTable,
        Key: { idno: updateAttendanceData.idno },
        UpdateExpression:
          "set Attndate = :Attndate, empCode = :empCode, AttnStatus = :AttnStatus, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":Attndate": updateAttendanceData.Attndate,
          ":empCode": updateAttendanceData.empCode,
          ":AttnStatus": updateAttendanceData.AttnStatus,
          ":updatedAt": new Date().toISOString(),
        },
      });
      return { message: "Attendance record updated successfully" };

    case "DELETE":
      // Delete an attendance record by idno
      const deleteAttendanceIdno = event.queryStringParameters.idno;
      await dynamo.delete({
        TableName: dailyAttendanceTable,
        Key: { idno: deleteAttendanceIdno },
      });
      return { message: "Attendance record deleted successfully" };

    default:
      return { message: "Method not supported" };
  }
}

//  pattern for deduction tables:
async function handleDeductionOperations(method, event) {
  switch (method) {
    case "GET":
      // Get single deduction record or all deduction records
      if (event.queryStringParameters && event.queryStringParameters.txnno) {
        const txnno = event.queryStringParameters.txnno;
        const result = await dynamo.get({
          TableName: deductionTable,
          Key: { txnno },
        });
        return result.Item
          ? result.Item
          : { message: "Deduction record not found" };
      } else {
        const result = await dynamo.scan({ TableName: deductionTable });
        return result.Items;
      }

    case "POST":
      // Create a new deduction record
      const deductionData = JSON.parse(event.body);
      await dynamo.put({
        TableName: deductionTable,
        Item: {
          txnno: deductionData.txnno, // Auto-generated or passed in payload
          Date: deductionData.Date,
          empCode: deductionData.empCode,
          Name: deductionData.Name,
          Mess: deductionData.Mess,
          Uniform: deductionData.Uniform,
          House: deductionData.House,
          Tax: deductionData.Tax,
          additionalColumn: deductionData.additionalColumn || null, // Optional
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
      return { message: "Deduction record created successfully" };

    case "PUT":
      // Update an existing deduction record
      const updateDeductionData = JSON.parse(event.body);
      await dynamo.update({
        TableName: deductionTable,
        Key: { txnno: updateDeductionData.txnno },
        UpdateExpression:
          "set Date = :Date, empCode = :empCode, Name = :Name, Mess = :Mess, Uniform = :Uniform, House = :House, Tax = :Tax, additionalColumn = :additionalColumn, updatedAt = :updatedAt",
        ExpressionAttributeValues: {
          ":Date": updateDeductionData.Date,
          ":empCode": updateDeductionData.empCode,
          ":Name": updateDeductionData.Name,
          ":Mess": updateDeductionData.Mess,
          ":Uniform": updateDeductionData.Uniform,
          ":House": updateDeductionData.House,
          ":Tax": updateDeductionData.Tax,
          ":additionalColumn": updateDeductionData.additionalColumn || null,
          ":updatedAt": new Date().toISOString(),
        },
      });
      return { message: "Deduction record updated successfully" };

    case "DELETE":
      // Delete a deduction record by txnno
      const deleteDeductionTxnno = event.queryStringParameters.txnno;
      await dynamo.delete({
        TableName: deductionTable,
        Key: { txnno: deleteDeductionTxnno },
      });
      return { message: "Deduction record deleted successfully" };

    default:
      return { message: "Method not supported" };
  }
}
