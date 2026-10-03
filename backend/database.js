const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "users2",
});

const connectionToDatabase = () => {
  connection.connect((err) => {
    if (err) {
      console.log("Error connecting to database", err);
    } else {
      console.log("Database successfully connected");
    }
  });
};

module.exports = { connectionToDatabase, connection };
