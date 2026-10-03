const connectionToDatabase = require("./database.js");
connectionToDatabase.connectionToDatabase();
const port = 3000;
const express = require("express");
const app = express();
const cors = require("cors");

const issues = require("../backend/routes/issue.js");

app.use(cors());

app.use(express.json());

app.use("/", require("./routes/auth.js"));
app.use("/", issues);
app.use("/", require("./routes/Teachpage.js"));

app.listen(port, () => {
  console.log("connected successfully");
});
