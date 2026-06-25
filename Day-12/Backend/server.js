const express = require("express");
const cors = require("cors");
const app = express();


const employeeRoutes = require("./routes/employeeRoutes");

const loggerMiddleware = require("./middleware/loggerMiddleware");


// Middleware
app.use(cors({
  origin: "https://bootcamp-b45p.vercel.app",  // your frontend domain
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());

app.use(loggerMiddleware);


// Routes

app.use("/employees", employeeRoutes);


app.get("/", (req, res) => {

  res.send("Employee Management API Running");

});


app.listen(3000, () => {

  console.log("Server Running on Port 3000");

});