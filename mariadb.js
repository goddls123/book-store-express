const mysql = require("mysql2");
const dotenv = require("dotenv");
// create the connection

dotenv.config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PASS,
});

module.exports = conn;
