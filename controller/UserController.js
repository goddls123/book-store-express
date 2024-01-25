const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");
const {
  makeToken,
  makeHashPassword,
  hashingPassword,
} = require("../uitl/auth.js");

const join = (req, res) => {
  const { email, password } = req.body;

  const { salt, hashPassword } = makeHashPassword(password);

  let sql = "INSERT INTO users (email,password,salt) VALUES (?,?,?)";

  let values = [email, hashPassword, salt];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    if (results.affectedRows) {
      res.status(StatusCodes.CREATED).json(results);
    } else {
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
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
    const hashPassword = hashingPassword(password, loginUser.salt);

    if (loginUser && loginUser.password === hashPassword) {
      const token = makeToken(loginUser);
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
  const sql = "SELECT * from users where email = ?";

  conn.query(sql, email, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    const user = results[0];

    if (user) {
      return res.status(StatusCodes.OK).json({ email: user.email });
    } else {
      return res.status(StatusCodes.UNAUTHORIZED).end();
    }
  });
};

const passwordReset = (req, res) => {
  const { email, password } = req.body;
  const sql = `UPDATE users SET password=?, salt=? where email = ?`;

  const { salt, hashPassword } = makeHashPassword(password);

  let values = [hashPassword, salt, email];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    if (results.affectedRows === 0) {
      return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
      return res.status(StatusCodes.OK).end();
    }
  });
};

module.exports = { join, login, passwordReset, passwordResetRequest };
