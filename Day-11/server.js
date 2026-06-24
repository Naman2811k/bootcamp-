const express = require("express");
const port = 3000;
const { data } = require("./data");

const app = express();

app.get("/bollywood", (req, res) => {
  const result = data.filter((item) => item.category === "bollywood");
  res.send(result);
});

app.get("/hollywood", (req, res) => {
  const result = data.filter((item) => item.category === "hollywood");
  res.send(result);
});

app.get("/food", (req, res) => {
  const result = data.filter((item) => item.category === "food");
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server listening at PORT:${port}`);
});
