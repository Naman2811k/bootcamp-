const Employee = require("../models/employeeSchema");

// ─────────────────────────────────────────────────────────────
// GET ALL EMPLOYEES
// GET /employees
// ─────────────────────────────────────────────────────────────
const getAllEmployees = async (req, res) => {
  try {
    const { department, minSalary, maxSalary, search } = req.query;

    const filter = {};

    // Department Filter
    if (department) {
      filter.department = {
        $regex: `^${department}$`,
        $options: "i",
      };
    }

    // Salary Filter
    if (minSalary || maxSalary) {
      filter.salary = {};

      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }

    // Search by Name
    if (search) {
      filter.name = {
        $regex: search,
        $options: "i",
      };
    }

    const employees = await Employee.find(filter);

    res.status(200).json({
      success: true,
      count: employees.length,
      data: employees,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// GET SINGLE EMPLOYEE
// GET /employees/:id
// ─────────────────────────────────────────────────────────────
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid Employee ID",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// ADD EMPLOYEE
// POST /employees
// ─────────────────────────────────────────────────────────────
const addEmployee = async (req, res) => {
  try {
    const { name, department, salary } = req.body;

    if (!name || !department || salary == null) {
      return res.status(400).json({
        success: false,
        message: "Name, department and salary are required",
      });
    }

    const employee = await Employee.create({
      name: name.trim(),
      department: department.trim(),
      salary,
    });

    res.status(201).json({
      success: true,
      message: "Employee added successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────────
// UPDATE EMPLOYEE
// PUT /employees/:id
// ─────────────────────────────────────────────────────────────
const updateEmployee = async (req, res) => {
  try {
    const { name, department, salary } = req.body;

    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      {
        name,
        department,
        salary,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid Employee ID",
    });
  }
};

// ─────────────────────────────────────────────────────────────
// DELETE EMPLOYEE
// DELETE /employees/:id
// ─────────────────────────────────────────────────────────────
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
      data: employee,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Invalid Employee ID",
    });
  }
};

module.exports = {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
};