
import { useEffect, useState } from "react";

function App() {
  const [employees, setEmployees] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    salary: "",
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  const API_URL = "https://bootcamp-5yno.onrender.com/employees";

  // FETCH EMPLOYEES
  const getEmployees = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setEmployees(data);
  };

  useEffect(() => {
    getEmployees();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD OR UPDATE EMPLOYEE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editId) {
      // UPDATE
      await fetch(`${API_URL}/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setEditId(null);
    } else {
      // ADD
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    setFormData({
      name: "",
      department: "",
      salary: "",
    });

    getEmployees();
  };

  // DELETE EMPLOYEE
  const deleteEmployee = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    getEmployees();
  };

  // EDIT EMPLOYEE
  const editEmployee = (employee) => {
    setEditId(employee.id);

    setFormData({
      name: employee.name,
      department: employee.department,
      salary: employee.salary,
    });
  };

  // SEARCH + FILTER
  const filteredEmployees = employees.filter((employee) => {
    const matchName = employee.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchDepartment =
      departmentFilter === "" ||
      employee.department === departmentFilter;

    return matchName && matchDepartment;
  });

  // UNIQUE DEPARTMENTS
  const departments = [
    ...new Set(employees.map((emp) => emp.department)),
  ];

  return (
    <div className="container">
      <h1>Employee Management System</h1>

      {/* Employee Count */}
      <h3>Total Employees: {filteredEmployees.length}</h3>

      {/* Search */}
      <input
        type="text"
        placeholder="Search Employee"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Department Filter */}
      <select
        value={departmentFilter}
        onChange={(e) => setDepartmentFilter(e.target.value)}
      >
        <option value="">All Departments</option>

        {departments.map((dept) => (
          <option key={dept} value={dept}>
            {dept}
          </option>
        ))}
      </select>

      {/* Form */}
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="name"
          placeholder="Employee Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="department"
          placeholder="Department"
          value={formData.department}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          value={formData.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Update Employee" : "Add Employee"}
        </button>
      </form>

      {/* Employee Cards */}
      <div className="employee-grid">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="card">
            <h3>{employee.name}</h3>

            <p>Department: {employee.department}</p>

            <p>Salary: ₹{employee.salary}</p>

            <button onClick={() => editEmployee(employee)}>
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => deleteEmployee(employee.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

