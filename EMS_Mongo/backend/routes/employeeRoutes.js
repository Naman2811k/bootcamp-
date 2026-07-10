const express = require("express");
const router  = express.Router();

const {
  getAllEmployees,
  getEmployeeById,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");

// GET  /employees          → get all (supports ?department=&search=&minSalary=&maxSalary=)
router.get("/", getAllEmployees);

// GET  /employees/:id      → get single
router.get("/:id", getEmployeeById);

// POST /employees          → create new employee
router.post("/", addEmployee);

// PUT  /employees/:id      → update (partial OK)
router.put("/:id", updateEmployee);

// DELETE /employees/:id    → remove
router.delete("/:id", deleteEmployee);

module.exports = router;
