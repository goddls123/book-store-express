const mysql = require("mysql2");

// create the connection
const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "bookstore",
  password: "root",
});

module.exports = conn;
