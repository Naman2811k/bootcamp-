use("employees")

db.employe.insertMany(
    [
  {
    "name": "Naman",
    "department": "Software Development",
    "salary": 650000,
    "email": "naman@example.com",
    "phone": "9876543210",
    "age": 22,
    "city": "Gurugram",
    "joiningDate": "2024-07-15",
    "isActive": true
  },
  {
    "name": "Aarav Sharma",
    "department": "Human Resources",
    "salary": 48000,
    "email": "aarav.sharma@example.com",
    "phone": "9876543211",
    "age": 28,
    "city": "Delhi",
    "joiningDate": "2023-11-20",
    "isActive": true
  },
  {
    "name": "Priya Verma",
    "department": "Marketing",
    "salary": 55000,
    "email": "priya.verma@example.com",
    "phone": "9876543212",
    "age": 26,
    "city": "Noida",
    "joiningDate": "2022-09-10",
    "isActive": true
  },
  {
    "name": "Rahul Mehta",
    "department": "Finance",
    "salary": 72000,
    "email": "rahul.mehta@example.com",
    "phone": "9876543213",
    "age": 31,
    "city": "Jaipur",
    "joiningDate": "2021-04-05",
    "isActive": false
  },
  {
    "name": "Sneha Kapoor",
    "department": "UI/UX Design",
    "salary": 60000,
    "email": "sneha.kapoor@example.com",
    "phone": "9876543214",
    "age": 25,
    "city": "Chandigarh",
    "joiningDate": "2024-01-12",
    "isActive": true
  }
]
)



// db.employe.aggregate([
//   {
//     $group: {
//       _id: null,
//       totalEmployees: { $sum: 1 }
//     }
//   }
// ])


// db.employe.aggregate([
//   {
//     $group: {
//       _id: null,
//       totalSalary: { $sum: "$salary" }
//     }
//   }
// ])