const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");

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
    if (results[0] && results[0].password === password) {
      res.status(201).send("로그인 성공");
    } else {
      res.status(403).json({ message: "올바른 email와 password를 입력하세요" });
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
