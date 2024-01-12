const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const join = (req, res) => {
  const { email, password } = req.body;

  let sql = "INSERT INTO users (email,password) VALUES (?,?)";
  let values = [email, password];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.CREATED).json(results);
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * from users where email = ?";

  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const loginUser = results[0];

    if (loginUser && loginUser.password === password) {
      const token = jwt.sign(
        {
          email: loginUser.email,
        },
        process.env.PRIVATE_KEY,
        {
          expiresIn: "5m",
          issuer: "test",
        }
      );
      res.cookie("token", token, {
        httpOnly: true,
      });
      console.log(token);

      return res.status(StatusCodes.OK).json(results);
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordResetRequest = (req, res) => {
  const { email } = req.body;
  if (email) {
    res.status(201).json(true);
  } else {
    res.status(400).json({ message: "없는 아이디 입니다." });
  }
};

const passwordReset = (req, res) => {
  const { email, password } = req.body;

  if (password) {
    res.status(201).json(true);
  }
};

module.exports = { join, login, passwordReset, passwordResetRequest };
