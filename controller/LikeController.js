const conn = require("../mariadb.js");
const { StatusCodes } = require("http-status-codes");
const { ensureAuthorization } = require("../uitl/auth.js");

const addLike = (req, res) => {
  const bookId = req.params.id;

  const authorization = ensureAuthorization(req);

  if (!authorization.ok) {
    throw Error(authorization.message);
  }

  let sql = `INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)`;
  let values = [authorization.id, bookId];
  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }

    res.status(StatusCodes.OK).json(results[0]);
  });
};

const removeLike = (req, res) => {
  const bookId = req.params.id;

  const authorization = ensureAuthorization(req);

  if (!authorization.ok) {
    throw Error(authorization.message);
  }

  let sql = `DELETE FROM likes WHERE user_id=? AND liked_book_id=?`;
  let values = [authorization.id, bookId];

  conn.query(sql, values, (err, results) => {
    if (err) {
      console.log(err);
      return res.status(StatusCodes.BAD_REQUEST).end();
    }
    res.status(StatusCodes.OK).json(results);
  });
};

module.exports = { addLike, removeLike };
